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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->string('status')->default('Not Started');
            $table->string('priority')->default('Normal');
            $table->dateTime('date_start')->nullable();
            $table->dateTime('date_end')->nullable();
            $table->date('date_start_date')->nullable();
            $table->date('date_end_date')->nullable();
            $table->dateTime('date_completed')->nullable();
            $table->mediumText('description')->nullable();
            $table->dateTime('stream_updated_at')->nullable();

            // Polymorphic parent (Account, Opportunity, Case, etc. depending on parent_type)
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->string('parent_type', 100)->nullable();

            // No `accounts`/`contacts`/`emails` tables yet in this app; keep columns + indexes,
            // add the FKs once those tables exist.
            $table->unsignedBigInteger('account_id')->nullable();
            $table->unsignedBigInteger('contact_id')->nullable();
            $table->unsignedBigInteger('email_id')->nullable();

            $table->foreignId('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('modified_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();

            $table->unsignedBigInteger('version_number')->default(0);

            $table->timestamps();
            $table->softDeletes();

            $table->index(['date_start', 'status']);
            $table->index(['date_end', 'status']);
            $table->index('date_start');
            $table->index('status');
            $table->index(['parent_id', 'parent_type']);
            $table->index('account_id');
            $table->index('contact_id');
            $table->index('email_id');
            $table->index(['assigned_user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
