<?php

namespace App\Models;

use Database\Factories\MeetingUserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $user_id
 * @property int|null $meeting_id
 * @property string $status
 * @property Carbon|null $deleted_at
 */
#[Fillable(['user_id', 'meeting_id', 'status'])]
#[WithoutTimestamps]
class MeetingUser extends Pivot
{
    /** @use HasFactory<MeetingUserFactory> */
    use HasFactory, SoftDeletes;

    public $incrementing = true;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function meeting(): BelongsTo
    {
        return $this->belongsTo(Meeting::class);
    }
}
