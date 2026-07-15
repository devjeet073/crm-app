<?php

use App\Models\Lead;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get(route('leads.index'))->assertRedirect(route('login'));
});

test('authenticated users can list leads', function () {
    $user = User::factory()->create();
    Lead::factory(3)->create();

    $this->actingAs($user)
        ->get(route('leads.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('leads/index')
            ->has('leads.data', 3)
        );
});

test('leads can be sorted by status on the server', function () {
    $user = User::factory()->create();
    Lead::factory()->create(['first_name' => 'Zed', 'status' => 'Qualified']);
    Lead::factory()->create(['first_name' => 'Amy', 'status' => 'Assigned']);
    Lead::factory()->create(['first_name' => 'Mid', 'status' => 'New']);

    $this->actingAs($user)
        ->get(route('leads.index', ['sort' => 'status', 'direction' => 'asc']))
        ->assertInertia(fn ($page) => $page
            ->component('leads/index')
            ->where('filters.sort', 'status')
            ->where('filters.direction', 'asc')
            ->where('leads.data.0.status', 'Assigned')
            ->where('leads.data.2.status', 'Qualified')
        );
});

test('leads can be sorted by assigned user on the server', function () {
    $user = User::factory()->create();
    $first = User::factory()->create(['name' => 'Amy Adams']);
    $second = User::factory()->create(['name' => 'Zack Zim']);
    Lead::factory()->create(['first_name' => 'One', 'assigned_user_id' => $second->id]);
    Lead::factory()->create(['first_name' => 'Two', 'assigned_user_id' => $first->id]);

    $this->actingAs($user)
        ->get(route('leads.index', ['sort' => 'assigned_to', 'direction' => 'asc']))
        ->assertInertia(fn ($page) => $page
            ->component('leads/index')
            ->where('leads.data.0.first_name', 'Two')
            ->where('leads.data.1.first_name', 'One')
        );
});

test('an invalid lead sort field falls back to the default', function () {
    $user = User::factory()->create();
    Lead::factory()->create();

    $this->actingAs($user)
        ->get(route('leads.index', ['sort' => 'not-a-real-column']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('leads/index')
            ->where('filters.sort', 'created_at')
            ->where('filters.direction', 'desc')
        );
});

test('the lead search filter matches by name', function () {
    $user = User::factory()->create();
    Lead::factory()->create(['first_name' => 'Jane', 'last_name' => 'Doe']);
    Lead::factory()->create(['first_name' => 'John', 'last_name' => 'Smith']);

    $this->actingAs($user)
        ->get(route('leads.index', ['search' => 'Jane']))
        ->assertInertia(fn ($page) => $page
            ->component('leads/index')
            ->has('leads.data', 1)
            ->where('leads.data.0.first_name', 'Jane')
        );
});

test('authenticated users can view the create lead form', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('leads.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('leads/create'));
});

test('a lead can be created', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('leads.store'), [
        'first_name' => 'Jane',
        'last_name' => 'Doe',
        'status' => 'New',
    ]);

    $lead = Lead::sole();

    $response->assertRedirect(route('leads.show', $lead));
    expect($lead->last_name)->toBe('Doe');
    expect($lead->created_by_id)->toBe($user->id);
});

test('creating a lead requires a last name', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('leads.store'), ['last_name' => '', 'status' => 'New'])
        ->assertInvalid(['last_name']);
});

test('a lead can be viewed', function () {
    $user = User::factory()->create();
    $lead = Lead::factory()->create();

    $this->actingAs($user)
        ->get(route('leads.show', $lead))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('leads/show')
            ->where('lead.id', $lead->id)
        );
});

test('a lead can be updated', function () {
    $user = User::factory()->create();
    $lead = Lead::factory()->create(['status' => 'New']);

    $response = $this->actingAs($user)->put(route('leads.update', $lead), [
        'last_name' => $lead->last_name,
        'status' => 'Assigned',
    ]);

    $response->assertRedirect(route('leads.show', $lead));
    expect($lead->fresh()->status)->toBe('Assigned');
    expect($lead->fresh()->modified_by_id)->toBe($user->id);
});

test('a lead can be deleted', function () {
    $user = User::factory()->create();
    $lead = Lead::factory()->create();

    $response = $this->actingAs($user)->delete(route('leads.destroy', $lead));

    $response->assertRedirect(route('leads.index'));
    expect(Lead::find($lead->id))->toBeNull();
    expect(Lead::withTrashed()->find($lead->id))->not->toBeNull();
});
