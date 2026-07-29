<?php

namespace App\Console\Commands;

use App\Mail\ComplianceReminderMail;
use App\Models\ComplianceReminder;
use App\Models\EmailConfiguration;
use App\Models\SentAutomationLog;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;

class ProcessComplianceReminders extends Command
{
    protected $signature = 'crm:process-reminders {--force : Force send reminders regardless of last_notified_at}';

    protected $description = 'Mitigate risk by processing critical compliance reminders for GST, ITR, and EMI payments';

    public function handle(): int
    {
        $today = Carbon::today();
        $this->info("Evaluating critical compliance reminders for {$today->toDateString()}...");

        $reminders = ComplianceReminder::whereIn('status', ['pending', 'reminded', 'overdue'])->get();
        $activeEmailConfig = EmailConfiguration::where('is_active', true)->first();

        $processedCount = 0;

        foreach ($reminders as $reminder) {
            $dueDate = $reminder->due_date;
            $daysRemaining = (int) $today->diffInDays($dueDate, false);

            // Mark overdue if due date passed
            if ($daysRemaining < 0 && $reminder->status !== 'completed') {
                $reminder->update(['status' => 'overdue']);
            }

            // Check if reminder threshold is reached
            $shouldRemind = ($daysRemaining <= $reminder->remind_days_before);

            if (! $shouldRemind && ! $this->option('force')) {
                continue;
            }

            // Avoid spamming multiple times the same day unless forced
            if ($reminder->last_notified_at && $reminder->last_notified_at->isToday() && ! $this->option('force')) {
                continue;
            }

            // Identify target notification users
            $recipients = collect();

            if ($reminder->assignedUser) {
                $recipients->push($reminder->assignedUser);
            } else {
                // Default to admin users if unassigned
                User::where('type', 'admin')->get()->each(function ($admin) use ($recipients) {
                    $recipients->push($admin);
                });
            }

            foreach ($recipients->unique('id') as $user) {
                $this->dispatchReminder($reminder, $user, $activeEmailConfig);
            }

            $reminder->update([
                'status' => $reminder->status === 'overdue' ? 'overdue' : 'reminded',
                'last_notified_at' => now(),
            ]);

            $processedCount++;
        }

        $this->info("Processed {$processedCount} compliance reminders successfully.");

        return Command::SUCCESS;
    }

    protected function dispatchReminder(ComplianceReminder $reminder, User $user, ?EmailConfiguration $emailConfig): void
    {
        $subject = match ($reminder->risk_level) {
            'critical' => "🚨 CRITICAL RISK ALERT: {$reminder->title} (Due: {$reminder->due_date->format('d M Y')})",
            'high' => "⚠️ HIGH RISK REMINDER: {$reminder->title} (Due: {$reminder->due_date->format('d M Y')})",
            default => "📌 COMPLIANCE REMINDER: {$reminder->title} (Due: {$reminder->due_date->format('d M Y')})",
        };

        $categoryLabel = strtoupper($reminder->category);
        $amountFormatted = $reminder->amount ? '₹'.number_format((float) $reminder->amount, 2) : 'N/A';
        $riskFormatted = strtoupper($reminder->risk_level);

        $bodyHtml = "
            <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;'>
                <h2 style='color: #0f172a; margin-top: 0;'>Compliance Reminder: {$reminder->title}</h2>
                <p>Hello <strong>{$user->name}</strong>,</p>
                <p>This is an automated risk mitigation alert for upcoming compliance / financial obligations.</p>

                <div style='background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;'>
                    <p style='margin: 0 0 8px 0;'><strong>Category:</strong> {$categoryLabel}</p>
                    <p style='margin: 0 0 8px 0;'><strong>Due Date:</strong> {$reminder->due_date->format('d M Y')}</p>
                    <p style='margin: 0 0 8px 0;'><strong>Risk Level:</strong> <span style='color: #dc2626; font-weight: bold;'>{$riskFormatted}</span></p>
                    <p style='margin: 0 0 8px 0;'><strong>Amount Payable:</strong> {$amountFormatted}</p>
                    <p style='margin: 0;'><strong>Status:</strong> ".ucfirst($reminder->status).'</p>
                </div>

                '.($reminder->notes ? "<p style='color: #475569;'><strong>Additional Notes:</strong><br>".nl2br(e($reminder->notes)).'</p>' : '')."

                <p style='color: #64748b; font-size: 14px; margin-top: 24px;'>Please resolve this item in your CRM portal once completed to prevent further notifications.</p>
            </div>
        ";

        try {
            if ($emailConfig) {
                $emailConfig->sendMail($user->email, $subject, $bodyHtml);
            } else {
                Mail::to($user->email)->send(new ComplianceReminderMail($reminder));
            }

            SentAutomationLog::create([
                'type' => 'compliance',
                'reference_title' => $reminder->title,
                'recipient_email' => $user->email,
                'recipient_name' => $user->name,
                'subject' => $subject,
                'message' => $reminder->notes ?? "Reminder for {$reminder->title}",
                'status' => 'sent',
                'sent_at' => now(),
            ]);
        } catch (\Exception $e) {
            SentAutomationLog::create([
                'type' => 'compliance',
                'reference_title' => $reminder->title,
                'recipient_email' => $user->email,
                'recipient_name' => $user->name,
                'subject' => $subject,
                'message' => $reminder->notes ?? "Reminder for {$reminder->title}",
                'status' => 'failed',
                'error_message' => $e->getMessage(),
                'sent_at' => now(),
            ]);
        }
    }
}
