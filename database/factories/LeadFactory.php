<?php

namespace Database\Factories;

use App\Models\Account;
use App\Models\Lead;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Lead>
 */
class LeadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'salutation_name' => fake()->optional()->randomElement(['Mr.', 'Ms.', 'Dr.']),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'middle_name' => null,
            'title' => fake()->optional()->jobTitle(),
            'status' => 'New',
            'source' => fake()->optional()->randomElement(['Web Site', 'Cold Call', 'Referral', 'Partner']),
            'industry' => fake()->optional()->randomElement(['Technology', 'Manufacturing', 'Healthcare', 'Retail', 'Finance']),
            'opportunity_amount' => fake()->optional()->randomFloat(2, 1000, 100000),
            'opportunity_amount_currency' => 'USD',
            'website' => fake()->optional()->url(),
            'address_street' => fake()->streetAddress(),
            'address_city' => fake()->city(),
            'address_state' => fake()->state(),
            'address_country' => fake()->country(),
            'address_postal_code' => fake()->postcode(),
            'do_not_call' => false,
            'description' => fake()->optional()->paragraph(),
            'converted_at' => null,
            'account_name' => fake()->company(),
            'stream_updated_at' => null,
            'campaign_id' => null,
            'created_account_id' => null,
            'created_contact_id' => null,
            'created_opportunity_id' => null,
            'created_by_id' => User::factory(),
            'modified_by_id' => User::factory(),
            'assigned_user_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the lead has been converted into an Account.
     */
    public function converted(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'Converted',
            'converted_at' => now(),
            'created_account_id' => Account::factory(),
        ]);
    }
}
