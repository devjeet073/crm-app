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
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // ── User search (lightweight JSON endpoint) ─────────────────────────────
    Route::get('users/search', function (Request $request) {
        if ($id = $request->input('id')) {
            $user = User::find($id, ['id', 'name']);

            return response()->json(['users' => $user ? [$user] : [], 'hasMore' => false]);
        }

        $search = $request->string('search')->toString() ?: null;
        $page = max(1, (int) $request->input('page', 1));
        $perPage = 20;

        $users = User::query()
            ->when($search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->orderBy('name')
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->get(['id', 'name']);

        $hasMore = User::query()
            ->when($search, fn ($q, $s) => $q->where('name', 'like', "%{$s}%"))
            ->count() > $page * $perPage;

        return response()->json(['users' => $users, 'hasMore' => $hasMore]);
    })->name('users.search');

    // ── CRM entities ────────────────────────────────────────────────────────
    Route::delete('leads/bulk', [LeadController::class, 'bulkDestroy'])->name('leads.bulkDestroy');
    Route::delete('accounts/bulk', [AccountController::class, 'bulkDestroy'])->name('accounts.bulkDestroy');
    Route::resource('accounts', AccountController::class);
    Route::resource('leads', LeadController::class);
    Route::get('tasks/page', [TaskController::class, 'page'])->name('tasks.page');
    Route::resource('tasks', TaskController::class);
    Route::patch('tasks/{task}/status', [TaskController::class, 'updateStatus'])->name('tasks.updateStatus');
    // ── Document management ──────────────────────────────────────────────────
    Route::delete('documents/bulk', [DocumentController::class, 'bulkDestroy'])->name('documents.bulkDestroy');
    Route::get('documents/{document}/download', [DocumentController::class, 'download'])->name('documents.file.download');
    Route::resource('documents', DocumentController::class);
    Route::resource('document-folders', DocumentFolderController::class)->except(['show']);

    // ── User management (admin: full CRUD; any user: own show/edit) ─────────
    Route::resource('users', UserController::class)->only(['index', 'show', 'edit', 'update', 'destroy']);

    // ── Admin-only: Roles, Teams, Email Configurations ──────────────────────
    Route::middleware('admin')->group(function () {
        Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
        Route::resource('roles', RoleController::class);
        Route::resource('teams', TeamController::class);
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
