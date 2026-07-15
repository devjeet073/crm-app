<?php

namespace Database\Factories;

use App\Models\Call;
use App\Models\CallContact;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CallContact>
 */
class CallContactFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'call_id' => Call::factory(),
            // No `Contact` model exists in this app yet; fake a plausible foreign id.
            'contact_id' => fake()->numberBetween(1, 1000),
            'status' => fake()->randomElement(['None', 'Accepted', 'Declined', 'Tentative']),
        ];
    }
}
