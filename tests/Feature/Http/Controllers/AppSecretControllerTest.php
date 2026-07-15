<?php

use App\Models\AppSecret;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get(route('app-secrets.index'))->assertRedirect(route('login'));
});

test('authenticated users can list app secrets', function () {
    $user = User::factory()->create();
    AppSecret::factory()->create(['name' => 'API_TOKEN']);

    $this->actingAs($user)
        ->get(route('app-secrets.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('app-secrets/index')
            ->has('appSecrets.data', 1)
        );
});

test('an app secret can be created', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('app-secrets.store'), [
        'name' => 'WEBHOOK_SECRET',
        'value' => 'abc123',
        'description' => 'Used for webhooks',
    ]);

    $response->assertRedirect(route('app-secrets.index'));
    expect(AppSecret::where('name', 'WEBHOOK_SECRET')->exists())->toBeTrue();
});

test('an app secret can be updated', function () {
    $user = User::factory()->create();
    $secret = AppSecret::factory()->create(['name' => 'OLD_NAME', 'value' => 'value']);

    $response = $this->actingAs($user)->put(route('app-secrets.update', $secret), [
        'name' => 'NEW_NAME',
        'value' => 'changed',
    ]);

    $response->assertRedirect(route('app-secrets.index'));
    expect($secret->fresh()->name)->toBe('NEW_NAME');
    expect($secret->fresh()->value)->toBe('changed');
});

test('an app secret can be deleted', function () {
    $user = User::factory()->create();
    $secret = AppSecret::factory()->create(['name' => 'DELETE_ME']);

    $response = $this->actingAs($user)->delete(route('app-secrets.destroy', $secret));

    $response->assertRedirect(route('app-secrets.index'));
    expect(AppSecret::find($secret->id))->toBeNull();
    expect(AppSecret::withTrashed()->find($secret->id))->not->toBeNull();
});
