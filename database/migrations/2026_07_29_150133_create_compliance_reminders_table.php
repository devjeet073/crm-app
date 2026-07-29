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
        Schema::create('compliance_reminders', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category'); // 'gst', 'itr', 'emi', 'other'
            $table->date('due_date');
            $table->decimal('amount', 12, 2)->nullable();
            $table->string('risk_level')->default('medium'); // 'low', 'medium', 'high', 'critical'
            $table->integer('remind_days_before')->default(7);
            $table->string('recurring_frequency')->default('none'); // 'none', 'monthly', 'quarterly', 'yearly'
            $table->string('status')->default('pending'); // 'pending', 'reminded', 'completed', 'overdue'
            $table->text('notes')->nullable();
            $table->foreignId('assigned_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('last_notified_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('compliance_reminders');
    }
};
