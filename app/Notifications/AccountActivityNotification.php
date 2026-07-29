<?php

namespace App\Notifications;

use App\Models\Account;
use App\Models\EmailConfiguration;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Config;

class AccountActivityNotification extends Notification
{
    use Queueable;

    public string $action;

    public Account $account;

    public ?User $actor;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $action, Account $account, ?User $actor = null)
    {
        $this->action = $action;
        $this->account = $account;
        $this->actor = $actor ?? auth()->user();
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        if (! app()->runningUnitTests()) {
            $activeConfig = EmailConfiguration::where('is_active', true)->first();
            if ($activeConfig) {
                Config::set('mail.default', 'smtp');
                Config::set('mail.mailers.smtp', [
                    'transport' => $activeConfig->mailer,
                    'host' => $activeConfig->host,
                    'port' => $activeConfig->port,
                    'encryption' => $activeConfig->encryption,
                    'username' => $activeConfig->username,
                    'password' => $activeConfig->password,
                    'timeout' => $activeConfig->timeout,
                ]);
                if ($activeConfig->from_address) {
                    Config::set('mail.from.address', $activeConfig->from_address);
                }
                if ($activeConfig->from_name) {
                    Config::set('mail.from.name', $activeConfig->from_name);
                }
            }
        }

        $actorName = $this->actor ? $this->actor->name : 'System';
        $accountName = $this->account->name ?? 'N/A';
        $actionTitle = ucfirst($this->action);

        $mailMessage = (new MailMessage)
            ->subject("[CRM Alert] Account {$actionTitle}: {$accountName}")
            ->greeting("Hello {$notifiable->name},")
            ->line("An account has been **{$this->action}** in the CRM.")
            ->line('**Account Details:**')
            ->line("• **Account Name:** {$accountName}")
            ->line('• **Type:** '.($this->account->type ?? 'N/A'))
            ->line('• **Industry:** '.($this->account->industry ?? 'N/A'))
            ->line("• **Action By:** {$actorName}");

        if ($this->action !== 'deleted' && $this->account->exists) {
            $mailMessage->action('View Account', route('accounts.show', $this->account->id));
        } else {
            $mailMessage->action('View Accounts', route('accounts.index'));
        }

        $mailMessage->line('Thank you for using our CRM application!');

        return $mailMessage;
    }

    /**
     * Get the array representation of the notification for database storage.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $actorName = $this->actor ? $this->actor->name : 'System';
        $accountName = $this->account->name ?? 'N/A';

        return [
            'account_id' => $this->account->id,
            'account_name' => $accountName,
            'action' => $this->action,
            'actor_id' => $this->actor?->id,
            'actor_name' => $actorName,
            'title' => "Account {$accountName} {$this->action}",
            'message' => "Account '{$accountName}' was {$this->action} by {$actorName}.",
            'url' => ($this->action !== 'deleted' && $this->account->exists) ? route('accounts.show', $this->account->id) : route('accounts.index'),
        ];
    }
}
