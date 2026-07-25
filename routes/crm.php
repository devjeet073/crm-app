<?php

use App\Http\Controllers\AccessManagementController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentFolderController;
use App\Http\Controllers\EmailConfigurationController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use App\Models\Account;
use App\Models\EmailConfiguration;
use App\Models\Lead;
use App\Models\Role;
use App\Models\Task;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('command-search', function (Request $request) {
        $search = $request->string('search')->toString() ?: null;
        $tab = $request->string('tab')->toString() ?: 'all';
        $user = $request->user();
        $isAdmin = $user->isAdmin();

        if (! $search || mb_strlen(trim($search)) < 1) {
            return response()->json(['results' => []]);
        }

        $search = trim($search);
        $limit = 8;
        $results = collect();

        if ($tab === 'accounts') {
            if ($isAdmin || $user->canViewModule('Accounts')) {
                Account::where('name', 'like', "%{$search}%")
                    ->limit($limit)
                    ->get(['id', 'name'])
                    ->each(fn ($r) => $results->push([
                        'id' => $r->id,
                        'label' => $r->name,
                        'entity' => 'Account',
                        'href' => route('accounts.show', $r),
                    ]));
            }
        }

        if ($tab === 'leads') {
            if ($isAdmin || $user->canViewModule('Leads')) {
                Lead::whereAny(['first_name', 'last_name', 'account_name'], 'like', "%{$search}%")
                    ->limit($limit)
                    ->get(['id', 'first_name', 'last_name'])
                    ->each(fn ($r) => $results->push([
                        'id' => $r->id,
                        'label' => trim("{$r->first_name} {$r->last_name}"),
                        'entity' => 'Lead',
                        'href' => route('leads.show', $r),
                    ]));
            }
        }

        if ($tab === 'tasks') {
            if ($isAdmin || $user->canViewModule('Tasks')) {
                Task::where('name', 'like', "%{$search}%")
                    ->limit($limit)
                    ->get(['id', 'name'])
                    ->each(fn ($r) => $results->push([
                        'id' => $r->id,
                        'label' => $r->name,
                        'entity' => 'Task',
                        'href' => route('tasks.show', $r),
                    ]));
            }
        }

        if ($tab === 'users') {
            if ($isAdmin) {
                User::whereAny(['name', 'email'], 'like', "%{$search}%")
                    ->limit($limit)
                    ->get(['id', 'name', 'email'])
                    ->each(fn ($r) => $results->push([
                        'id' => $r->id,
                        'label' => $r->name,
                        'entity' => 'User',
                        'href' => route('users.show', $r),
                    ]));
            }
        }

        if ($tab === 'teams') {
            if ($isAdmin) {
                Team::where('name', 'like', "%{$search}%")
                    ->limit($limit)
                    ->get(['id', 'name'])
                    ->each(fn ($r) => $results->push([
                        'id' => $r->id,
                        'label' => $r->name,
                        'entity' => 'Team',
                        'href' => route('teams.show', $r),
                    ]));
            }
        }

        if ($tab === 'roles') {
            if ($isAdmin) {
                Role::where('name', 'like', "%{$search}%")
                    ->limit($limit)
                    ->get(['id', 'name'])
                    ->each(fn ($r) => $results->push([
                        'id' => $r->id,
                        'label' => $r->name,
                        'entity' => 'Role',
                        'href' => route('roles.show', $r),
                    ]));
            }
        }

        return response()->json(['results' => $results->values()]);
    })->name('command-search');

    Route::get('users/search', function (Request $request) {
        if ($id = $request->input('id')) {
            $user = User::find($id, ['id', 'name', 'email', 'avatar_url', 'avatar_color']);

            return response()->json(['users' => $user ? [$user] : [], 'hasMore' => false]);
        }

        $search = $request->string('search')->toString() ?: null;
        $page = max(1, (int) $request->input('page', 1));
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
    })->name('users.search');

    // ── CRM entities ────────────────────────────────────────────────────────
    Route::middleware('check-module:Leads')->group(function () {
        Route::delete('leads/bulk', [LeadController::class, 'bulkDestroy'])->name('leads.bulkDestroy');
        Route::resource('leads', LeadController::class);
    });

    Route::middleware('check-module:Accounts')->group(function () {
        Route::delete('accounts/bulk', [AccountController::class, 'bulkDestroy'])->name('accounts.bulkDestroy');
        Route::resource('accounts', AccountController::class);
    });

    Route::middleware('check-module:Tasks')->group(function () {
        Route::get('tasks/page', [TaskController::class, 'page'])->name('tasks.page');
        Route::patch('tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.updateStatus');
        Route::resource('tasks', TaskController::class);
    });

    // ── Document management ──────────────────────────────────────────────────
    Route::middleware('check-module:Documents')->group(function () {
        Route::delete('documents/bulk', [DocumentController::class, 'bulkDestroy'])->name('documents.bulkDestroy');
        Route::get('documents/{document}/download', [DocumentController::class, 'download'])->name('documents.file.download');
        Route::resource('documents', DocumentController::class);
        Route::resource('document-folders', DocumentFolderController::class)->except(['show']);
    });

    // ── User management (admin: full CRUD; any user: own show/edit) ─────────
    Route::resource('users', UserController::class)->only(['index', 'show', 'edit', 'update', 'destroy']);

    // ── Admin-only: Roles, Teams, Email Configurations ──────────────────────
    Route::middleware('admin')->group(function () {
        Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
        Route::resource('roles', RoleController::class);
        Route::resource('teams', TeamController::class);
        Route::post('email-configurations/{emailConfiguration}/send-test', function (Request $request, EmailConfiguration $emailConfiguration) {
            $data = $request->validate([
                'to' => ['required', 'email'],
                'subject' => ['required', 'string', 'max:255'],
                'message' => ['required', 'string', 'max:10000'],
            ]);

            $originalDefault = config('mail.default');
            $originalSmtp = config('mail.mailers.smtp');

            try {
                Config::set('mail.default', 'smtp');
                Config::set('mail.mailers.smtp', [
                    'transport' => $emailConfiguration->mailer,
                    'host' => $emailConfiguration->host,
                    'port' => $emailConfiguration->port,
                    'encryption' => $emailConfiguration->encryption,
                    'username' => $emailConfiguration->username,
                    'password' => $emailConfiguration->password,
                    'timeout' => $emailConfiguration->timeout,
                ]);
                Config::set('mail.from.address', $emailConfiguration->from_address);
                Config::set('mail.from.name', $emailConfiguration->from_name);

                Mail::raw($data['message'], function ($message) use ($data) {
                    $message->to($data['to'])->subject($data['subject']);
                });

                Inertia::flash('toast', ['type' => 'success', 'message' => __('Test email sent successfully.')]);
            } catch (Exception $e) {
                Inertia::flash('toast', ['type' => 'error', 'message' => __('Failed to send test email: :error', ['error' => $e->getMessage()])]);
            } finally {
                Config::set('mail.default', $originalDefault);
                Config::set('mail.mailers.smtp', $originalSmtp);
            }

            return back();
        })->name('email-configurations.send-test');

        Route::resource('email-configurations', EmailConfigurationController::class);

        // Access management: role ↔ user
        Route::post('roles/{role}/assign-user', [AccessManagementController::class, 'assignRoleToUser'])
            ->name('roles.assignUser');
        Route::delete('roles/{role}/revoke-user', [AccessManagementController::class, 'revokeRoleFromUser'])
            ->name('roles.revokeUser');

        // Access management: role ↔ team
        Route::post('roles/{role}/assign-team', [AccessManagementController::class, 'assignRoleToTeam'])
            ->name('roles.assignTeam');
        Route::delete('roles/{role}/revoke-team', [AccessManagementController::class, 'revokeRoleFromTeam'])
            ->name('roles.revokeTeam');

        // Access management: team ↔ user
        Route::post('teams/{team}/assign-user', [AccessManagementController::class, 'assignUserToTeam'])
            ->name('teams.assignUser');
        Route::delete('teams/{team}/revoke-user', [AccessManagementController::class, 'revokeUserFromTeam'])
            ->name('teams.revokeUser');
    });
});
