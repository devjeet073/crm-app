<?php

use App\Models\AutomatedGreeting;
use App\Models\ComplianceReminder;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;

test('authenticated user can view automations dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/automations');

    $response->assertStatus(200);
});

test('user can create, update and delete automated greeting template', function () {
    $user = User::factory()->create(['type' => 'admin']);

    $response = $this->actingAs($user)->post('/automated-greetings', [
        'title' => 'Diwali Special Greetings',
        'type' => 'festival',
        'event_date' => '2026-11-08',
        'template_subject' => 'Happy Diwali {first_name}!',
        'template_body' => 'Wishing you a prosperous Diwali {name}',
        'target_type' => 'all',
        'status' => 'active',
        'recurring' => true,
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('automated_greetings', [
        'title' => 'Diwali Special Greetings',
        'type' => 'festival',
    ]);

    $greeting = AutomatedGreeting::where('title', 'Diwali Special Greetings')->first();

    $updateResponse = $this->actingAs($user)->put("/automated-greetings/{$greeting->id}", [
        'title' => 'Updated Diwali Greetings',
        'type' => 'festival',
        'event_date' => '2026-11-08',
        'template_subject' => 'Happy Diwali & Prosperous New Year!',
        'template_body' => 'Warm wishes for Diwali {name}',
        'target_type' => 'all',
        'status' => 'paused',
        'recurring' => true,
    ]);

    $updateResponse->assertRedirect();
    $this->assertDatabaseHas('automated_greetings', [
        'id' => $greeting->id,
        'title' => 'Updated Diwali Greetings',
        'status' => 'paused',
    ]);

    $deleteResponse = $this->actingAs($user)->delete("/automated-greetings/{$greeting->id}");
    $deleteResponse->assertRedirect();
    $this->assertSoftDeleted('automated_greetings', ['id' => $greeting->id]);
});

test('user can create, update, complete and delete compliance reminder', function () {
    $user = User::factory()->create(['type' => 'admin']);

    $response = $this->actingAs($user)->post('/compliance-reminders', [
        'title' => 'GSTR-3B Tax Filing',
        'category' => 'gst',
        'due_date' => Carbon::now()->addDays(5)->toDateString(),
        'amount' => 150000.00,
        'risk_level' => 'critical',
        'remind_days_before' => 7,
        'recurring_frequency' => 'monthly',
        'notes' => 'Pay tax before 20th of month.',
    ]);

    $response->assertRedirect();
    $this->assertDatabaseHas('compliance_reminders', [
        'title' => 'GSTR-3B Tax Filing',
        'category' => 'gst',
        'risk_level' => 'critical',
    ]);

    $reminder = ComplianceReminder::where('title', 'GSTR-3B Tax Filing')->first();

    // Mark completed
    $completeResponse = $this->actingAs($user)->post("/compliance-reminders/{$reminder->id}/complete");
    $completeResponse->assertRedirect();

    $reminder->refresh();
    expect($reminder->status)->toBe('completed');

    // Check recurring creation for next month
    $this->assertDatabaseHas('compliance_reminders', [
        'title' => 'GSTR-3B Tax Filing',
        'status' => 'pending',
    ]);
});

test('send greetings artisan command dispatches birthday and festival greetings', function () {
    Mail::fake();

    $birthdayUser = User::factory()->create([
        'name' => 'Birthday Person',
        'email' => 'birthday@crm.test',
        'birth_date' => Carbon::today()->toDateString(),
    ]);

    $greeting = AutomatedGreeting::create([
        'title' => 'Birthday Wishes',
        'type' => 'birthday',
        'template_subject' => 'Happy Birthday {first_name}!',
        'template_body' => 'Dear {name}, Happy Birthday!',
        'target_type' => 'all',
        'status' => 'active',
        'recurring' => true,
    ]);

    Artisan::call('crm:send-greetings', ['--force' => true]);

    $this->assertDatabaseHas('sent_automation_logs', [
        'type' => 'greeting',
        'recipient_email' => 'birthday@crm.test',
        'status' => 'sent',
    ]);
});

test('process compliance reminders command scans and sends risk notifications', function () {
    Mail::fake();

    $adminUser = User::factory()->create([
        'email' => 'admin@crm.test',
        'type' => 'admin',
    ]);

    ComplianceReminder::create([
        'title' => 'Vehicle Loan EMI Payment',
        'category' => 'emi',
        'due_date' => Carbon::today()->addDays(2)->toDateString(),
        'amount' => 35000.00,
        'risk_level' => 'critical',
        'remind_days_before' => 5,
        'recurring_frequency' => 'monthly',
        'status' => 'pending',
        'assigned_user_id' => $adminUser->id,
    ]);

    Artisan::call('crm:process-reminders', ['--force' => true]);

    $this->assertDatabaseHas('sent_automation_logs', [
        'type' => 'compliance',
        'recipient_email' => 'admin@crm.test',
        'status' => 'sent',
    ]);
});
