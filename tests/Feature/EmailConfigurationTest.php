<?php

use App\Models\EmailConfiguration;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

test('admin can send test email using email configuration', function () {
    Mail::fake();

    $user = User::factory()->create(['type' => 'admin']);
    $config = EmailConfiguration::create([
        'name' => 'Primary Mailer',
        'mailer' => 'smtp',
        'host' => 'smtp.mailtrap.io',
        'port' => 2525,
        'encryption' => 'tls',
        'username' => 'test_user',
        'password' => 'secret_pass',
        'from_address' => 'noreply@crm.com',
        'from_name' => 'CRM Demo',
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)->post(route('email-configurations.send-test', $config), [
        'to' => 'test@example.com',
        'subject' => 'Test Subject',
        'message' => 'Test Body Message',
    ]);

    $response->assertRedirect();
    $response->assertSessionHasNoErrors();
    $response->assertSessionHas('inertia.flash_data.toast.type', 'success');
});

test('test email validation fails with invalid data', function () {
    $user = User::factory()->create(['type' => 'admin']);
    $config = EmailConfiguration::create([
        'name' => 'Primary Mailer',
        'mailer' => 'smtp',
        'host' => 'smtp.mailtrap.io',
        'port' => 2525,
        'from_address' => 'noreply@crm.com',
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)->post(route('email-configurations.send-test', $config), [
        'to' => 'not-an-email',
        'subject' => '',
        'message' => '',
    ]);

    $response->assertSessionHasErrors(['to', 'subject', 'message']);
});
