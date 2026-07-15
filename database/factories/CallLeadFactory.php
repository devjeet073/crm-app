<?php

namespace Database\Factories;

use App\Models\Call;
use App\Models\CallLead;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<CallLead>
 */
class CallLeadFactory extends Factory
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
            // No `Lead` model exists in this app yet; fake a plausible foreign id.
            'lead_id' => fake()->numberBetween(1, 1000),
            'status' => fake()->randomElement(['None', 'Accepted', 'Declined', 'Tentative']),
        ];
    }
}
