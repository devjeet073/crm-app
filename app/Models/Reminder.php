<?php

namespace App\Models;

use Database\Factories\ReminderFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property Carbon|null $remind_at
 * @property Carbon|null $start_at
 * @property string $type
 * @property int $seconds
 * @property bool $is_submitted
 * @property int|null $user_id
 * @property int|null $entity_id
 * @property string|null $entity_type
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'remind_at', 'start_at', 'type', 'seconds', 'is_submitted',
    'user_id', 'entity_id', 'entity_type',
])]
#[WithoutTimestamps]
class Reminder extends Model
{
    /** @use HasFactory<ReminderFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'remind_at' => 'datetime',
            'start_at' => 'datetime',
            'seconds' => 'integer',
            'is_submitted' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * The reminded record (Call, Meeting, Task, ...) resolved dynamically by `entity_type`.
     */
    public function entity(): MorphTo
    {
        return $this->morphTo();
    }
}
