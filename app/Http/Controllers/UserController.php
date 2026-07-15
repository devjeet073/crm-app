<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateUserRequest;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString() ?: null;
        $type   = $request->string('type')->toString() ?: null;

        $users = User::query()
            ->with('defaultTeam')
            ->withCount(['roles', 'teams'])
            ->when($search, fn ($q, $s) => $q->where(function ($q) use ($s) {
                $q->where('name', 'like', "%{$s}%")
                  ->orWhere('email', 'like', "%{$s}%");
            }))
            ->when($type, fn ($q, $t) => $q->where('type', $t))
            ->orderBy('name')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('users/index', [
            'users'   => $users,
            'filters' => ['search' => $search, 'type' => $type],
            'types'   => ['regular', 'admin', 'portal', 'api'],
        ]);
    }

    public function show(User $user): Response
    {
        $user->load(['roles', 'teams', 'defaultTeam', 'authLogRecords' => fn ($q) => $q->latest()->limit(20)]);

        return Inertia::render('users/show', [
            'user' => $user,
        ]);
    }

    public function edit(User $user): Response
    {
        $teams = Team::orderBy('name')->get(['id', 'name']);

        return Inertia::render('users/edit', [
            'user'  => $user->load(['roles', 'teams']),
            'teams' => $teams,
            'types' => ['regular', 'admin', 'portal', 'api'],
        ]);
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $user->update($request->validated());

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
}
