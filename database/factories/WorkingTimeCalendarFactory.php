<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\WorkingTimeCalendar;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<WorkingTimeCalendar>
 */
class WorkingTimeCalendarFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->city().' Working Hours',
            'description' => fake()->optional()->sentence(),
            'time_zone' => fake()->timezone(),
            'time_ranges' => null,
            'weekday0' => false,
            'weekday1' => true,
            'weekday2' => true,
            'weekday3' => true,
            'weekday4' => true,
            'weekday5' => true,
            'weekday6' => false,
            'weekday0_time_ranges' => null,
            'weekday1_time_ranges' => null,
            'weekday2_time_ranges' => null,
            'weekday3_time_ranges' => null,
            'weekday4_time_ranges' => null,
            'weekday5_time_ranges' => null,
            'weekday6_time_ranges' => null,
            'created_by_id' => User::factory(),
            'modified_by_id' => User::factory(),
        ];
    }
}
