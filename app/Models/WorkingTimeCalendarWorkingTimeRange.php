<?php

namespace App\Models;

use Database\Factories\WorkingTimeCalendarWorkingTimeRangeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\WithoutTimestamps;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int|null $working_time_calendar_id
 * @property int|null $working_time_range_id
 * @property Carbon|null $deleted_at
 */
#[Fillable(['working_time_calendar_id', 'working_time_range_id'])]
#[WithoutTimestamps]
class WorkingTimeCalendarWorkingTimeRange extends Pivot
{
    /** @use HasFactory<WorkingTimeCalendarWorkingTimeRangeFactory> */
    use HasFactory, SoftDeletes;

    public $incrementing = true;

    public function workingTimeCalendar(): BelongsTo
    {
        return $this->belongsTo(WorkingTimeCalendar::class);
    }

    public function workingTimeRange(): BelongsTo
    {
        return $this->belongsTo(WorkingTimeRange::class);
    }
}
