<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class GreetingMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $greetingSubject,
        public string $greetingContent
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->greetingSubject,
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: $this->greetingContent,
        );
    }
}
