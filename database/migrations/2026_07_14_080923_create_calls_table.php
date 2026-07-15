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
        Schema::create('calls', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('status')->default('Planned');
            $table->dateTime('date_start')->nullable();
            $table->dateTime('date_end')->nullable();
            $table->string('direction')->default('Outbound');
            $table->mediumText('description')->nullable();
            $table->string('uid')->nullable();

            // Polymorphic parent (Account, Opportunity, Case, etc. depending on parent_type)
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('parent_type', 100)->nullable();

            // No `accounts` table yet in this app; keep column + index, add the FK once it exists.
            $table->unsignedBigInteger('account_id')->nullable();

            $table->foreignId('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('modified_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['date_start', 'status']);
            $table->index('date_start');
            $table->index('status');
            $table->index('uid');
            $table->index(['parent_id', 'parent_type']);
            $table->index('account_id');
            $table->index(['assigned_user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calls');
    }
};
