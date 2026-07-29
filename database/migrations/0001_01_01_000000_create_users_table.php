<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('salutation_name', 20)->nullable();
            $table->string('middle_name', 100)->nullable();
            $table->string('email');
            $table->string('type', 24)->default('regular')->index();
            $table->boolean('is_active')->default(true);
            $table->string('title', 100)->nullable()->comment('Job title');
            $table->string('avatar_color', 7)->nullable()->comment('UI color hex');
            $table->string('avatar')->nullable();
            $table->string('gender', 20)->nullable();
            $table->date('birth_date')->nullable();
            $table->string('auth_method', 24)->nullable()->comment('Override authentication method');
            $table->string('api_key', 100)->nullable()->unique()->comment('API key for api-type users');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->text('two_factor_secret')->nullable();
            $table->text('two_factor_recovery_codes')->nullable();
            $table->timestamp('two_factor_confirmed_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
