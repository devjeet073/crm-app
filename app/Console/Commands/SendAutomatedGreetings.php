<?php

namespace App\Console\Commands;

use App\Mail\GreetingMail;
use App\Models\AutomatedGreeting;
use App\Models\EmailConfiguration;
use App\Models\Lead;
use App\Models\SentAutomationLog;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

class SendAutomatedGreetings extends Command
{
    protected $signature = 'crm:send-greetings {--force : Force run regardless of last_run_at timestamp}';

    protected $description = 'Automate birthday and festival greetings for users and leads';

    public function handle(): int
    {
        $today = Carbon::today();
        $this->info("Processing automated greetings for {$today->toDateString()}...");

        $greetings = AutomatedGreeting::where('status', 'active')->get();
        $activeEmailConfig = EmailConfiguration::where('is_active', true)->first();

        $totalSent = 0;

        foreach ($greetings as $greeting) {
            if ($greeting->type === 'festival') {
                if (! $greeting->event_date) {
                    continue;
                }

                $isMatch = $greeting->recurring
                    ? ($greeting->event_date->format('m-d') === $today->format('m-d'))
                    : ($greeting->event_date->isSameDay($today));

                if (! $isMatch && ! $this->option('force')) {
                    continue;
                }

                // Check if already sent today
                if ($greeting->last_run_at && $greeting->last_run_at->isToday() && ! $this->option('force')) {
                    continue;
                }

                $recipients = collect();

                if (in_array($greeting->target_type, ['all', 'users'])) {
                    User::whereNotNull('email')->get()->each(function ($u) use ($recipients) {
                        $recipients->push(['name' => $u->name, 'email' => $u->email]);
                    });
                }

                if (in_array($greeting->target_type, ['all', 'leads'])) {
                    Lead::whereNotNull('website')->get()->each(function ($l) use ($recipients) {
                        // Using lead name
                        $name = trim("{$l->first_name} {$l->last_name}") ?: ($l->account_name ?: 'Valued Client');
                        // If lead has address/email or associated user email
                        if ($l->assignedUser?->email) {
                            $recipients->push(['name' => $name, 'email' => $l->assignedUser->email]);
                        }
                    });
                }

                foreach ($recipients->unique('email') as $recipient) {
                    $this->dispatchGreeting($greeting, $recipient['name'], $recipient['email'], $activeEmailConfig);
                    $totalSent++;
                }

                $greeting->update(['last_run_at' => now()]);
            } elseif ($greeting->type === 'birthday') {
                // Process birthday greetings for users
                $users = User::whereNotNull('birth_date')
                    ->whereMonth('birth_date', $today->month)
                    ->whereDay('birth_date', $today->day)
                    ->get();

                foreach ($users as $user) {
                    $this->dispatchGreeting($greeting, $user->name, $user->email, $activeEmailConfig);
                    $totalSent++;
                }

                // Process birthday greetings for leads
                $leads = Lead::whereNotNull('birth_date')
                    ->whereMonth('birth_date', $today->month)
                    ->whereDay('birth_date', $today->day)
                    ->get();

                foreach ($leads as $lead) {
                    $name = trim("{$lead->first_name} {$lead->last_name}") ?: 'Valued Client';
                    $email = $lead->assignedUser?->email;
                    if ($email) {
                        $this->dispatchGreeting($greeting, $name, $email, $activeEmailConfig);
                        $totalSent++;
                    }
                }

                $greeting->update(['last_run_at' => now()]);
            }
        }

        $this->info("Completed automated greetings. Dispatched {$totalSent} messages.");

        return Command::SUCCESS;
    }

    protected function dispatchGreeting(AutomatedGreeting $greeting, string $name, string $email, ?EmailConfiguration $emailConfig): void
    {
        $subject = str_replace(['{name}', '{first_name}'], [$name, explode(' ', $name)[0]], $greeting->template_subject);
        $body = str_replace(['{name}', '{first_name}'], [$name, explode(' ', $name)[0]], $greeting->template_body);

        $bodyHtml = "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;'>
                <div style='text-align: center; margin-bottom: 24px;'>
                    <h1 style='color: #4f46e5; margin-bottom: 8px;'>🎉 {$greeting->title}</h1>
                </div>
                <div style='font-size: 16px; line-height: 1.6; color: #334155;'>
                    ".nl2br(e($body))."
                </div>
                <div style='margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 13px;'>
                    Sent with best wishes from ".config('app.name').'
                </div>
            </div>
        ';

        try {
            if ($emailConfig) {
                $emailConfig->sendMail($email, $subject, $bodyHtml);
            } else {
                Mail::to($email)->send(new GreetingMail($subject, $bodyHtml));
            }

            SentAutomationLog::create([
                'type' => 'greeting',
                'reference_title' => $greeting->title,
                'recipient_email' => $email,
                'recipient_name' => $name,
                'subject' => $subject,
                'message' => $body,
                'status' => 'sent',
                'sent_at' => now(),
            ]);
        } catch (\Exception $e) {
            SentAutomationLog::create([
                'type' => 'greeting',
                'reference_title' => $greeting->title,
                'recipient_email' => $email,
                'recipient_name' => $name,
                'subject' => $subject,
                'message' => $body,
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'sent_at' => now(),
            ]);
        }
    }
}
