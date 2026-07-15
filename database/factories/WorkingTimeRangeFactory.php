<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\WorkingTimeRange;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

/**
 * @extends Factory<WorkingTimeRange>
 */
class WorkingTimeRangeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true).' Holiday',
            'time_ranges' => null,
            'date_start' => fake()->dateTimeBetween('-1 month', '+1 month')->format('Y-m-d'),
            'date_end' => fn (array $attributes) => Carbon::parse($attributes['date_start'])->format('Y-m-d'),
            'type' => fake()->randomElement(['Working', 'Non-working']),
            'description' => fake()->optional()->sentence(),
            'created_by_id' => User::factory(),
            'modified_by_id' => User::factory(),
        ];
    }
}
