<?php

use App\Models\Call;
use App\Models\Meeting;
use App\Models\Task;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $this->get(route('calendar.index'))->assertRedirect(route('login'));
});

test('authenticated users can visit the calendar with a default range', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('calendar.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('calendar/index')
            ->has('events')
            ->has('from')
            ->has('to')
        );
});

test('it only returns the current users meetings, calls, and tasks within range', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    $from = now()->startOfWeek();
    $to = now()->endOfWeek();

    $meetingInRange = Meeting::factory()->create([
        'date_start' => $from->copy()->addDay(),
        'date_end' => $from->copy()->addDay()->addHour(),
    ]);
    $meetingInRange->users()->attach($user->id, ['status' => 'Accepted']);

    $declinedMeeting = Meeting::factory()->create([
        'date_start' => $from->copy()->addDay(),
        'date_end' => $from->copy()->addDay()->addHour(),
    ]);
    $declinedMeeting->users()->attach($user->id, ['status' => 'Declined']);

    $meetingOutOfRange = Meeting::factory()->create([
        'date_start' => $to->copy()->addWeek(),
        'date_end' => $to->copy()->addWeek()->addHour(),
    ]);
    $meetingOutOfRange->users()->attach($user->id, ['status' => 'Accepted']);

    $meetingForOtherUser = Meeting::factory()->create([
        'date_start' => $from->copy()->addDay(),
        'date_end' => $from->copy()->addDay()->addHour(),
    ]);
    $meetingForOtherUser->users()->attach($otherUser->id, ['status' => 'Accepted']);

    $call = Call::factory()->create([
        'date_start' => $from->copy()->addDays(2),
        'date_end' => $from->copy()->addDays(2)->addMinutes(30),
    ]);
    $call->users()->attach($user->id, ['status' => 'Accepted']);

    Task::factory()->create([
        'assigned_user_id' => $user->id,
        'date_start' => $from->copy()->addDays(3),
        'date_end' => $from->copy()->addDays(3)->addHour(),
    ]);

    Task::factory()->create([
        'assigned_user_id' => $otherUser->id,
        'date_start' => $from->copy()->addDays(3),
        'date_end' => $from->copy()->addDays(3)->addHour(),
    ]);

    $this->actingAs($user)
        ->get(route('calendar.index', ['from' => $from->toISOString(), 'to' => $to->toISOString()]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('calendar/index')
            ->has('events', 3)
            ->where('events.0.scope', 'Meeting')
            ->where('events.1.scope', 'Call')
            ->where('events.2.scope', 'Task')
        );
});

test('validation rejects an inverted or too-long range', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('calendar.index', ['from' => now()->toISOString(), 'to' => now()->subDay()->toISOString()]))
        ->assertInvalid(['to']);

    $this->actingAs($user)
        ->get(route('calendar.index', ['from' => now()->toISOString(), 'to' => now()->addDays(200)->toISOString()]))
        ->assertInvalid(['to']);
});
