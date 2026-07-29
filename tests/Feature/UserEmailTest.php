<?php

use App\Models\EmailConfiguration;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

test('authenticated user can send email via selected email configuration', function () {
    Mail::fake();

    $user = User::factory()->create(['type' => 'admin']);
    $recipient = User::factory()->create();

    $emailConfig = EmailConfiguration::create([
        'name' => 'Default Mailer',
        'mailer' => 'smtp',
        'host' => '127.0.0.1',
        'port' => 1025,
        'from_address' => 'noreply@crm.test',
        'from_name' => 'CRM Demo',
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)->post('/users/send-email', [
        'email_configuration_id' => $emailConfig->id,
        'to' => $recipient->email,
        'subject' => 'Hello from CRM',
        'body' => 'This is a test email message content.',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasNoErrors();
});

test('send email validates required fields', function () {
    $user = User::factory()->create(['type' => 'admin']);

    $response = $this->actingAs($user)->post('/users/send-email', []);

    $response->assertSessionHasErrors(['email_configuration_id', 'to', 'subject', 'body']);
});
