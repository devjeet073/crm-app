<?php

namespace App\Models;

use Database\Factories\WorkingTimeCalendarFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string|null $name
 * @property string|null $description
 * @property string|null $time_zone
 * @property string|null $time_ranges
 * @property bool $weekday0
 * @property bool $weekday1
 * @property bool $weekday2
 * @property bool $weekday3
 * @property bool $weekday4
 * @property bool $weekday5
 * @property bool $weekday6
 * @property string|null $weekday0_time_ranges
 * @property string|null $weekday1_time_ranges
 * @property string|null $weekday2_time_ranges
 * @property string|null $weekday3_time_ranges
 * @property string|null $weekday4_time_ranges
 * @property string|null $weekday5_time_ranges
 * @property string|null $weekday6_time_ranges
 * @property int|null $created_by_id
 * @property int|null $modified_by_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'name', 'description', 'time_zone', 'time_ranges',
    'weekday0', 'weekday1', 'weekday2', 'weekday3', 'weekday4', 'weekday5', 'weekday6',
    'weekday0_time_ranges', 'weekday1_time_ranges', 'weekday2_time_ranges', 'weekday3_time_ranges',
    'weekday4_time_ranges', 'weekday5_time_ranges', 'weekday6_time_ranges',
    'created_by_id', 'modified_by_id',
])]
class WorkingTimeCalendar extends Model
{
    /** @use HasFactory<WorkingTimeCalendarFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'weekday0' => 'boolean',
            'weekday1' => 'boolean',
            'weekday2' => 'boolean',
            'weekday3' => 'boolean',
            'weekday4' => 'boolean',
            'weekday5' => 'boolean',
            'weekday6' => 'boolean',
        ];
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_id');
    }

    public function modifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'modified_by_id');
    }

    public function workingTimeRanges(): BelongsToMany
    {
        return $this->belongsToMany(WorkingTimeRange::class, 'working_time_calendar_working_time_range')
            ->using(WorkingTimeCalendarWorkingTimeRange::class)
            ->wherePivotNull('deleted_at');
    }
}
