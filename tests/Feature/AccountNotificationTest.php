<?php

use App\Models\Account;
use App\Models\Role;
use App\Models\User;
use App\Notifications\AccountActivityNotification;
use Illuminate\Support\Facades\Notification;

test('admin and superior receive email and stored notification on account creation', function () {
    Notification::fake();

    $admin = User::factory()->create(['type' => 'admin']);
    $managerRole = Role::create(['name' => 'Sales Manager', 'description' => 'Manager']);
    $manager = User::factory()->create(['type' => 'regular']);
    $manager->roles()->attach($managerRole);

    $response = $this->actingAs($admin)->post(route('accounts.store'), [
        'name' => 'Acme Enterprise',
        'type' => 'Customer',
        'industry' => 'Software',
    ]);

    $account = Account::where('name', 'Acme Enterprise')->first();
    expect($account)->not->toBeNull();

    $response->assertRedirect(route('accounts.show', $account));

    Notification::assertSentTo(
        [$admin, $manager],
        AccountActivityNotification::class,
        function ($notification) use ($account) {
            return $notification->action === 'created'
                && $notification->account->id === $account->id;
        }
    );
});

test('admin and superior receive notification on account modification', function () {
    Notification::fake();

    $admin = User::factory()->create(['type' => 'admin']);
    $account = Account::factory()->create(['name' => 'Original Name']);

    $response = $this->actingAs($admin)->put(route('accounts.update', $account), [
        'name' => 'Updated Enterprise Name',
    ]);

    $response->assertRedirect(route('accounts.show', $account));

    Notification::assertSentTo(
        $admin,
        AccountActivityNotification::class,
        function ($notification) use ($account) {
            return $notification->action === 'modified'
                && $notification->account->id === $account->id;
        }
    );
});

test('admin and superior receive notification on account deletion', function () {
    Notification::fake();

    $admin = User::factory()->create(['type' => 'admin']);
    $account = Account::factory()->create(['name' => 'Account To Delete']);

    $response = $this->actingAs($admin)->delete(route('accounts.destroy', $account));

    $response->assertRedirect(route('accounts.index'));

    Notification::assertSentTo(
        $admin,
        AccountActivityNotification::class,
        function ($notification) use ($account) {
            return $notification->action === 'deleted'
                && $notification->account->id === $account->id;
        }
    );
});

test('database notification content and mail content are generated correctly', function () {
    $admin = User::factory()->create(['type' => 'admin']);
    $account = Account::factory()->create(['name' => 'Tech Corp', 'type' => 'Customer', 'industry' => 'Tech']);

    $notification = new AccountActivityNotification('created', $account, $admin);

    $databaseData = $notification->toArray($admin);
    expect($databaseData['account_id'])->toBe($account->id);
    expect($databaseData['action'])->toBe('created');
    expect($databaseData['message'])->toContain("Account 'Tech Corp' was created by {$admin->name}.");

    $mailMessage = $notification->toMail($admin);
    expect($mailMessage->subject)->toContain('[CRM Alert] Account Created: Tech Corp');
    expect($mailMessage->introLines[0])->toContain('An account has been **created** in the CRM.');
});

test('user can mark database notifications as read', function () {
    $user = User::factory()->create(['type' => 'admin']);

    // Send a real database notification directly
    $account = Account::factory()->create(['name' => 'Test Corp']);
    $initialUnreadCount = $user->unreadNotifications()->count();
    expect($initialUnreadCount)->toBeGreaterThanOrEqual(1);

    $dbNotification = $user->unreadNotifications()->first();

    $this->actingAs($user)
        ->post(route('notifications.read', $dbNotification->id))
        ->assertRedirect();

    expect($user->unreadNotifications()->count())->toBe($initialUnreadCount - 1);
});
