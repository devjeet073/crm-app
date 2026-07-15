<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * Audit log of login attempts (success and denied).
 * No soft-delete — audit logs are immutable.
 *
 * @property int $id
 * @property string|null $username
 * @property string|null $ip_address
 * @property bool $is_denied
 * @property string|null $denial_reason
 * @property float|null $request_time
 * @property string|null $request_url
 * @property string|null $request_method
 * @property string|null $authentication_method
 * @property int|null $user_id
 * @property int|null $auth_token_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'username', 'ip_address', 'is_denied', 'denial_reason',
    'request_time', 'request_url', 'request_method', 'authentication_method',
    'user_id', 'auth_token_id',
])]
class AuthLogRecord extends Model
{
    use HasFactory;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_denied'    => 'boolean',
            'request_time' => 'double',
        ];
    }

    public function user(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
