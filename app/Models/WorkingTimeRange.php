<?php

namespace App\Models;

use Database\Factories\WorkingTimeRangeFactory;
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
 * @property string|null $time_ranges
 * @property Carbon|null $date_start
 * @property Carbon|null $date_end
 * @property string $type
 * @property string|null $description
 * @property int|null $created_by_id
 * @property int|null $modified_by_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
    'name', 'time_ranges', 'date_start', 'date_end', 'type', 'description',
    'created_by_id', 'modified_by_id',
])]
class WorkingTimeRange extends Model
{
    /** @use HasFactory<WorkingTimeRangeFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_start' => 'date',
            'date_end' => 'date',
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

    public function workingTimeCalendars(): BelongsToMany
    {
        return $this->belongsToMany(WorkingTimeCalendar::class, 'working_time_calendar_working_time_range')
            ->using(WorkingTimeCalendarWorkingTimeRange::class)
            ->wherePivotNull('deleted_at');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_working_time_range')
            ->using(UserWorkingTimeRange::class)
            ->wherePivotNull('deleted_at');
    }
}
