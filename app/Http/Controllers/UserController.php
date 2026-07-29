<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchUserRequest;
use App\Http\Requests\SendUserEmailRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\EmailConfiguration;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString() ?: null;
        $type = $request->input('type');

        $users = User::query()
            ->with('defaultTeam')
            ->withCount(['roles', 'teams'])
            ->when($search, fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%");
            }))
            ->when($type, function ($q, $t) {
                $val = is_array($t) && isset($t['value']) ? $t['value'] : $t;
                if (is_array($val)) {
                    $q->whereIn('type', $val);
                } else {
                    $q->where('type', $val);
                }
            })
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        $emailConfigurations = EmailConfiguration::where('is_active', true)
            ->get(['id', 'name', 'from_address', 'from_name']);

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => ['search' => $search, 'type' => is_array($type) ? $type : ($type ? [$type] : [])],
            'filterOptions' => [
                'types' => collect(['regular', 'admin', 'portal', 'api'])->map(fn ($t) => ['label' => ucfirst($t), 'value' => $t])->toArray(),
            ],
            'emailConfigurations' => $emailConfigurations,
        ]);
    }

    public function show(User $user): Response
    {
        $user->load(['roles', 'teams', 'defaultTeam', 'authLogRecords' => fn ($q) => $q->latest()->limit(20)]);

        $emailConfigurations = EmailConfiguration::where('is_active', true)
            ->get(['id', 'name', 'from_address', 'from_name']);

        return Inertia::render('users/show', [
            'user' => $user,
            'emailConfigurations' => $emailConfigurations,
        ]);
    }

    public function edit(User $user): Response
    {
        $teams = Team::orderBy('name')->get(['id', 'name']);

        return Inertia::render('users/edit', [
            'user' => $user->load(['roles', 'teams']),
            'teams' => $teams,
            'types' => ['regular', 'admin', 'portal', 'api'],
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $data = $request->validated();

        if ($request->boolean('remove_avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $data['avatar'] = null;
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User updated.')]);

        return to_route('users.show', $user);
    }

    public function destroy(Request $request, User $user): RedirectResponse
    {
        // Prevent self-deletion
        if ($user->is($request->user())) {
            return back()->with('error', __('You cannot delete your own account.'));
        }

        $user->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('User deleted.')]);

        return to_route('users.index');
    }

    public function sendEmail(SendUserEmailRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $emailConfig = EmailConfiguration::findOrFail($validated['email_configuration_id']);

        try {
            $emailConfig->sendMail(
                to: $validated['to'],
                subject: $validated['subject'],
                message: $validated['body']
            );

            Inertia::flash('toast', ['type' => 'success', 'message' => __('Email sent successfully.')]);
        } catch (\Throwable $e) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('Failed to send email: :error', ['error' => $e->getMessage()])]);
        }

        return back();
    }

    public function search(SearchUserRequest $request): JsonResponse
    {
        if ($id = $request->validated('id')) {
            $user = User::find($id, ['id', 'name', 'email', 'avatar_url', 'avatar_color']);

            return response()->json(['users' => $user ? [$user] : [], 'hasMore' => false]);
        }

        $search = $request->validated('search');
        $page = max(1, (int) $request->validated('page', 1));
        $perPage = 20;

        $query = User::query()
            ->when($search, function ($q, $s) {
                $q->where('name', 'like', "%{$s}%")
                    ->orWhere('email', 'like', "%{$s}%");
            });

        $users = (clone $query)
            ->orderBy('name')
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get(['id', 'name', 'email', 'avatar_url', 'avatar_color']);

        $hasMore = $query->count() > $page * $perPage;

        return response()->json(['users' => $users, 'hasMore' => $hasMore]);
    }
}
