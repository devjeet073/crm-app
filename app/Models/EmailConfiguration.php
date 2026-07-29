<?php

namespace App\Models;

use Exception;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;

/**
 * @property int $id
 * @property string $name
 * @property string $mailer
 * @property string|null $host
 * @property int|null $port
 * @property string|null $encryption
 * @property string|null $username
 * @property string|null $password
 * @property string $from_address
 * @property string|null $from_name
 * @property int|null $timeout
 * @property bool $is_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class EmailConfiguration extends Model
{
    protected $fillable = [
        'name',
        'mailer',
        'host',
        'port',
        'encryption',
        'username',
        'password',
        'from_address',
        'from_name',
        'timeout',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'port' => 'integer',
            'timeout' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    protected function password(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? decrypt($value) : null,
            set: fn (?string $value) => $value ? encrypt($value) : null,
        );
    }

    /**
     * Send an email using this configuration's dynamic mailer settings.
     *
     * @throws Exception
     */
    public function sendMail(string $to, string $subject, string $message): void
    {
        $originalDefault = config('mail.default');
        $originalSmtp = config('mail.mailers.smtp');

        try {
            if (! app()->runningUnitTests()) {
                Config::set('mail.default', 'smtp');
                Config::set('mail.mailers.smtp', [
                    'transport' => $this->mailer,
                    'host' => $this->host,
                    'port' => $this->port,
                    'encryption' => $this->encryption,
                    'username' => $this->username,
                    'password' => $this->password,
                    'timeout' => $this->timeout,
                ]);
                Config::set('mail.from.address', $this->from_address);
                Config::set('mail.from.name', $this->from_name);
            }

            Mail::raw($message, function ($mail) use ($to, $subject) {
                $mail->to($to)->subject($subject);
            });
        } finally {
            if (! app()->runningUnitTests()) {
                Config::set('mail.default', $originalDefault);
                Config::set('mail.mailers.smtp', $originalSmtp);
            }
        }
    }
}
