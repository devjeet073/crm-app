<?php

namespace App\Mail;

use App\Models\ComplianceReminder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ComplianceReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public ComplianceReminder $reminder
    ) {}

    public function envelope(): Envelope
    {
        $prefix = match ($this->reminder->risk_level) {
            'critical' => '🚨 CRITICAL COMPLIANCE ALERT: ',
            'high' => '⚠️ HIGH RISK REMINDER: ',
            default => '📌 COMPLIANCE REMINDER: ',
        };

        return new Envelope(
            subject: $prefix.$this->reminder->title,
        );
    }

    public function content(): Content
    {
        $html = "
        <div style='font-family: Arial, sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;'>
            <h2 style='color: #0f172a; margin-top: 0;'>Compliance Reminder: {$this->reminder->title}</h2>
            <div style='background-color: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #ef4444;'>
                <p style='margin: 0 0 8px 0;'><strong>Category:</strong> ".strtoupper($this->reminder->category)."</p>
                <p style='margin: 0 0 8px 0;'><strong>Due Date:</strong> {$this->reminder->due_date->format('d M Y')}</p>
                <p style='margin: 0 0 8px 0;'><strong>Risk Level:</strong> <span style='text-transform: uppercase; font-weight: bold; color: #dc2626;'>{$this->reminder->risk_level}</span></p>
                ".($this->reminder->amount ? "<p style='margin: 0;'><strong>Amount Payable:</strong> ₹".number_format((float) $this->reminder->amount, 2).'</p>' : '').'
            </div>
            '.($this->reminder->notes ? "<p style='color: #475569;'><strong>Notes / Details:</strong><br>{$this->reminder->notes}</p>" : '')."
            <p style='color: #64748b; font-size: 14px; margin-top: 24px;'>Please ensure timely action to avoid penalties or interest.</p>
        </div>";

        return new Content(
            htmlString: $html,
        );
    }
}
