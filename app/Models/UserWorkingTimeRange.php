<?php

namespace App\Models;

use Database\Factories\UserWorkingTimeRangeFactory;
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
 * @property int|null $working_time_range_id
 * @property Carbon|null $deleted_at
 */
#[Fillable(['user_id', 'working_time_range_id'])]
#[WithoutTimestamps]
class UserWorkingTimeRange extends Pivot
{
    /** @use HasFactory<UserWorkingTimeRangeFactory> */
    use HasFactory, SoftDeletes;

    public $incrementing = true;

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function workingTimeRange(): BelongsTo
    {
        return $this->belongsTo(WorkingTimeRange::class);
    }
}
