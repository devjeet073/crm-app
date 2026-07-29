<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $type greeting|compliance
 * @property string $reference_title
 * @property string $recipient_email
 * @property string|null $recipient_name
 * @property string $subject
 * @property string $message
 * @property string $status sent|failed
 * @property string|null $error_message
 * @property Carbon $sent_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'type',
    'reference_title',
    'recipient_email',
    'recipient_name',
    'subject',
    'message',
    'status',
    'error_message',
    'sent_at',
])]
class SentAutomationLog extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'sent_at' => 'datetime',
        ];
    }
}
