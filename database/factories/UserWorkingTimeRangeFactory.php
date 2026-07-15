<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserWorkingTimeRange;
use App\Models\WorkingTimeRange;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UserWorkingTimeRange>
 */
class UserWorkingTimeRangeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'working_time_range_id' => WorkingTimeRange::factory(),
        ];
    }
}
