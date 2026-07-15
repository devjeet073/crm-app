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
        Schema::create('accounts', function (Blueprint $table) {
            $table->id();
            $table->string('name', 249)->nullable();
            $table->string('website')->nullable();
            $table->string('type')->nullable();
            $table->string('industry')->nullable();
            $table->string('sic_code', 40)->nullable();
            $table->string('billing_address_street')->nullable();
            $table->string('billing_address_city', 100)->nullable();
            $table->string('billing_address_state', 100)->nullable();
            $table->string('billing_address_country', 100)->nullable();
            $table->string('billing_address_postal_code', 40)->nullable();
            $table->string('shipping_address_street')->nullable();
            $table->string('shipping_address_city', 100)->nullable();
            $table->string('shipping_address_state', 100)->nullable();
            $table->string('shipping_address_country', 100)->nullable();
            $table->string('shipping_address_postal_code', 40)->nullable();
            $table->mediumText('description')->nullable();
            $table->boolean('is_locked')->default(false);
            $table->dateTime('stream_updated_at')->nullable();

            // No `campaigns` table yet in this app; keep column + index, add the FK once it exists.
            $table->unsignedBigInteger('campaign_id')->nullable();

            $table->foreignId('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('modified_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->unsignedBigInteger('version_number')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->unique(['created_at', 'id']);
            $table->index(['created_at', 'deleted_at']);
            $table->index(['name', 'deleted_at']);
            $table->index(['assigned_user_id', 'deleted_at']);
            $table->index('campaign_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('accounts');
    }
};
