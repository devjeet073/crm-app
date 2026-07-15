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
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('salutation_name')->nullable();
            $table->string('first_name', 100)->nullable();
            $table->string('last_name', 100)->nullable();
            $table->string('middle_name', 100)->nullable();
            $table->string('title', 100)->nullable();
            $table->string('status')->default('New');
            $table->string('source')->nullable();
            $table->string('industry')->nullable();
            $table->double('opportunity_amount')->nullable();
            $table->string('opportunity_amount_currency', 3)->nullable();
            $table->string('website')->nullable();
            $table->string('address_street')->nullable();
            $table->string('address_city', 100)->nullable();
            $table->string('address_state', 100)->nullable();
            $table->string('address_country', 100)->nullable();
            $table->string('address_postal_code', 40)->nullable();
            $table->boolean('do_not_call')->default(false);
            $table->mediumText('description')->nullable();
            $table->dateTime('converted_at')->nullable();
            $table->string('account_name')->nullable();
            $table->dateTime('stream_updated_at')->nullable();

            // No `campaigns` table yet in this app; keep column + index, add the FK once it exists.
            $table->unsignedBigInteger('campaign_id')->nullable();

            $table->foreignId('created_account_id')->nullable()->constrained('accounts')->nullOnDelete();

            // No `contacts`/`opportunities` tables yet in this app; keep columns + indexes,
            // add the FKs once those tables exist.
            $table->unsignedBigInteger('created_contact_id')->nullable();
            $table->unsignedBigInteger('created_opportunity_id')->nullable();

            $table->foreignId('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('modified_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['created_at', 'id']);
            $table->index(['first_name', 'deleted_at']);
            $table->index(['first_name', 'last_name']);
            $table->index(['status', 'deleted_at']);
            $table->index(['created_at', 'deleted_at']);
            $table->index(['created_at', 'status']);
            $table->index(['assigned_user_id', 'deleted_at']);
            $table->index(['assigned_user_id', 'status']);
            $table->index('campaign_id');
            $table->index('created_contact_id');
            $table->index('created_opportunity_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
