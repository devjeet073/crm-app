<?php

namespace Database\Factories;

use App\Models\AppSecret;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AppSecret>
 */
class AppSecretFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->unique()->word(),
            'value' => $this->faker->password(),
            'description' => $this->faker->sentence(),
            'delete_id' => '0',
        ];
    }
}
