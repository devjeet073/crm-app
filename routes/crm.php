<?php

use App\Http\Controllers\AccessManagementController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AutomatedGreetingController;
use App\Http\Controllers\AutomationDashboardController;
use App\Http\Controllers\CommandSearchController;
use App\Http\Controllers\ComplianceReminderController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DocumentFolderController;
use App\Http\Controllers\EmailConfigurationController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('command-search', CommandSearchController::class)->name('command-search');
    Route::get('users/search', [UserController::class, 'search'])->name('users.search');

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

    // ── Notifications ────────────────────────────────────────────────────────
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');

    // ── User management (admin: full CRUD; any user: own show/edit) ─────────
    Route::post('users/send-email', [UserController::class, 'sendEmail'])->name('users.sendEmail');
    Route::resource('users', UserController::class)->only(['index', 'show', 'edit', 'update', 'destroy']);

    // ── Automations & Risk Compliance ──────────────────────────────────────
    Route::get('automations', [AutomationDashboardController::class, 'index'])->name('automations.index');
    Route::post('automated-greetings/trigger', [AutomatedGreetingController::class, 'trigger'])->name('automated-greetings.trigger');
    Route::post('automated-greetings/{automatedGreeting}/test', [AutomatedGreetingController::class, 'test'])->name('automated-greetings.test');
    Route::resource('automated-greetings', AutomatedGreetingController::class)->only(['store', 'update', 'destroy']);

    Route::post('compliance-reminders/trigger', [ComplianceReminderController::class, 'trigger'])->name('compliance-reminders.trigger');
    Route::post('compliance-reminders/{complianceReminder}/complete', [ComplianceReminderController::class, 'markAsCompleted'])->name('compliance-reminders.complete');
    Route::resource('compliance-reminders', ComplianceReminderController::class)->only(['store', 'update', 'destroy']);

    // ── Admin-only: Roles, Teams, Email Configurations ──────────────────────
    Route::middleware('admin')->group(function () {
        Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
        Route::resource('roles', RoleController::class);
        Route::resource('teams', TeamController::class);
        Route::post('email-configurations/{emailConfiguration}/send-test', [EmailConfigurationController::class, 'sendTest'])
            ->name('email-configurations.send-test');

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
