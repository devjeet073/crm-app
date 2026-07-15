<?php

namespace Database\Factories;

use App\Models\WorkingTimeCalendar;
use App\Models\WorkingTimeCalendarWorkingTimeRange;
use App\Models\WorkingTimeRange;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WorkingTimeCalendarWorkingTimeRange>
 */
class WorkingTimeCalendarWorkingTimeRangeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'working_time_calendar_id' => WorkingTimeCalendar::factory(),
            'working_time_range_id' => WorkingTimeRange::factory(),
        ];
    }
}
