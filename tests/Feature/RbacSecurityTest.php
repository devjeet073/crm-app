<?php

use App\Models\User;
use App\Models\Role;
use App\Models\Team;
use App\Models\AuthLogRecord;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

beforeEach(function () {
    // Clean tables for tests
    AuthLogRecord::truncate();
    Role::truncate();
    Team::truncate();
});

test('admin middleware restricts regular users', function () {
    $regularUser = User::factory()->create(['type' => 'regular']);
    $adminUser   = User::factory()->create(['type' => 'admin']);

    $role = Role::create(['name' => 'Test Role']);

    // Unauthenticated -> redirect to login
    $this->get(route('roles.index'))
        ->assertRedirect(route('login'));

    // Authenticated regular user -> 403 Forbidden
    $this->actingAs($regularUser)
        ->get(route('roles.index'))
        ->assertStatus(403);

    // Authenticated admin user -> 200 OK
    $this->actingAs($adminUser)
        ->get(route('roles.index'))
        ->assertStatus(200);
});

test('roles and teams assign/revoke endpoints work', function () {
    $adminUser = User::factory()->create(['type' => 'admin']);
    $user = User::factory()->create(['type' => 'regular']);
    $role = Role::create(['name' => 'Manager']);
    $team = Team::create(['name' => 'Sales Team']);

    $this->actingAs($adminUser);

    // Assign User to Role
    $this->post(route('roles.assignUser', $role), ['user_id' => $user->id])
        ->assertRedirect();
    expect($role->users()->where('users.id', $user->id)->exists())->toBeTrue();

    // Revoke User from Role
    $this->delete(route('roles.revokeUser', $role), ['user_id' => $user->id])
        ->assertRedirect();
    expect($role->users()->where('users.id', $user->id)->exists())->toBeFalse();

    // Assign Team to Role
    $this->post(route('roles.assignTeam', $role), ['team_id' => $team->id])
        ->assertRedirect();
    expect($role->teams()->where('teams.id', $team->id)->exists())->toBeTrue();

    // Revoke Team from Role
    $this->delete(route('roles.revokeTeam', $role), ['team_id' => $team->id])
        ->assertRedirect();
    expect($role->teams()->where('teams.id', $team->id)->exists())->toBeFalse();
});

test('effective permissions resolver handles priority hierarchy', function () {
    $user = User::factory()->create();
    
    // Create direct role (low priority)
    $lowRole = Role::create([
        'name' => 'Low Role',
        'export_permission' => 'own',
    ]);
    $user->roles()->attach($lowRole);

    expect($user->effectivePermission('export_permission'))->toBe('own');

    // Create high-priority team role
    $highRole = Role::create([
        'name' => 'High Role',
        'export_permission' => 'all',
    ]);
    $team = Team::create(['name' => 'Super Team']);
    $team->roles()->attach($highRole);
    $user->teams()->attach($team);

    // Should resolve to 'all' because 'all' > 'own' in permission priority
    expect($user->effectivePermission('export_permission'))->toBe('all');
});

test('login audit logger logs success and failures', function () {
    $user = User::factory()->create([
        'email' => 'audit-test@example.com',
        'password' => Hash::make('password123'),
    ]);

    // Successful attempt
    $response = $this->post(route('login'), [
        'email' => 'audit-test@example.com',
        'password' => 'password123',
    ]);

    // If it fails or redirects, let's debug the response if the log is empty
    $successLog = AuthLogRecord::where('username', 'audit-test@example.com')->first();
    if (!$successLog) {
        ray($response->status(), $response->content());
    }

    expect($successLog)->not->toBeNull()
        ->and($successLog->is_denied)->toBeFalse()
        ->and($successLog->user_id)->toBe($user->id);

    // Logout to ensure the next login attempt is not bypassed by RedirectIfAuthenticated middleware
    Auth::logout();

    // Failed attempt
    $this->post(route('login'), [
        'email' => 'audit-test@example.com',
        'password' => 'wrongpassword',
    ]);

    $failedLog = AuthLogRecord::where('username', 'audit-test@example.com')
        ->where('is_denied', true)
        ->first();
    expect($failedLog)->not->toBeNull()
        ->and($failedLog->denial_reason)->toBe('Invalid credentials');
});
