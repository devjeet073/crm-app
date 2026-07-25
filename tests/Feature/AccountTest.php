<?php

use App\Models\Account;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get(route('accounts.index'))->assertRedirect(route('login'));
});

test('authenticated users can list accounts', function () {
    $user = User::factory()->create(['type' => 'admin']);
    Account::factory(3)->create();

    $this->actingAs($user)
        ->get(route('accounts.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('accounts/index')
            ->has('accounts.data', 3)
        );
});

test('accounts can be sorted by type on the server', function () {
    $user = User::factory()->create(['type' => 'admin']);
    Account::factory()->create(['name' => 'Zeta', 'type' => 'Reseller']);
    Account::factory()->create(['name' => 'Alpha', 'type' => 'Customer']);
    Account::factory()->create(['name' => 'Mid', 'type' => 'Investor']);

    $this->actingAs($user)
        ->get(route('accounts.index', ['sort' => 'type', 'direction' => 'desc']))
        ->assertInertia(fn ($page) => $page
            ->component('accounts/index')
            ->where('filters.sort', 'type')
            ->where('filters.direction', 'desc')
            ->where('accounts.data.0.type', 'Reseller')
            ->where('accounts.data.2.type', 'Customer')
        );
});

test('accounts can be sorted by assigned user on the server', function () {
    $user = User::factory()->create(['type' => 'admin']);
    $first = User::factory()->create(['name' => 'Amy Adams']);
    $second = User::factory()->create(['name' => 'Zack Zim']);
    Account::factory()->create(['name' => 'One', 'assigned_user_id' => $second->id]);
    Account::factory()->create(['name' => 'Two', 'assigned_user_id' => $first->id]);

    $this->actingAs($user)
        ->get(route('accounts.index', ['sort' => 'assigned_to', 'direction' => 'asc']))
        ->assertInertia(fn ($page) => $page
            ->component('accounts/index')
            ->where('accounts.data.0.name', 'Two')
            ->where('accounts.data.1.name', 'One')
        );
});

test('an invalid sort field falls back to the default', function () {
    $user = User::factory()->create(['type' => 'admin']);
    Account::factory()->create(['name' => 'Acme Corp']);

    $this->actingAs($user)
        ->get(route('accounts.index', ['sort' => 'not-a-real-column']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('accounts/index')
            ->where('filters.sort', 'name')
            ->where('filters.direction', 'asc')
        );
});

test('the account search filter matches by name', function () {
    $user = User::factory()->create(['type' => 'admin']);
    Account::factory()->create(['name' => 'Acme Corp']);
    Account::factory()->create(['name' => 'Globex']);

    $this->actingAs($user)
        ->get(route('accounts.index', ['search' => 'Acme']))
        ->assertInertia(fn ($page) => $page
            ->component('accounts/index')
            ->has('accounts.data', 1)
            ->where('accounts.data.0.name', 'Acme Corp')
        );
});

test('authenticated users can view the create account form', function () {
    $user = User::factory()->create(['type' => 'admin']);

    $this->actingAs($user)
        ->get(route('accounts.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('accounts/create'));
});

test('an account can be created', function () {
    $user = User::factory()->create(['type' => 'admin']);

    $response = $this->actingAs($user)->post(route('accounts.store'), [
        'name' => 'Acme Corp',
        'type' => 'Customer',
        'industry' => 'Technology',
    ]);

    $account = Account::sole();

    $response->assertRedirect(route('accounts.show', $account));
    expect($account->name)->toBe('Acme Corp');
    expect($account->created_by_id)->toBe($user->id);
    expect($account->modified_by_id)->toBe($user->id);
});

test('creating an account requires a name', function () {
    $user = User::factory()->create(['type' => 'admin']);

    $this->actingAs($user)
        ->post(route('accounts.store'), ['name' => ''])
        ->assertInvalid(['name']);
});

test('an account can be viewed', function () {
    $user = User::factory()->create(['type' => 'admin']);
    $account = Account::factory()->create();

    $this->actingAs($user)
        ->get(route('accounts.show', $account))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('accounts/show')
            ->where('account.id', $account->id)
        );
});

test('an account can be updated', function () {
    $user = User::factory()->create(['type' => 'admin']);
    $account = Account::factory()->create(['name' => 'Old Name']);

    $response = $this->actingAs($user)->put(route('accounts.update', $account), [
        'name' => 'New Name',
    ]);

    $response->assertRedirect(route('accounts.show', $account));
    expect($account->fresh()->name)->toBe('New Name');
    expect($account->fresh()->modified_by_id)->toBe($user->id);
});

test('an account can be deleted', function () {
    $user = User::factory()->create(['type' => 'admin']);
    $account = Account::factory()->create();

    $response = $this->actingAs($user)->delete(route('accounts.destroy', $account));

    $response->assertRedirect(route('accounts.index'));
    expect(Account::find($account->id))->toBeNull();
    expect(Account::withTrashed()->find($account->id))->not->toBeNull();
});
