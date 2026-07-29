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
        Schema::create('sent_automation_logs', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // 'greeting', 'compliance'
            $table->string('reference_title');
            $table->string('recipient_email');
            $table->string('recipient_name')->nullable();
            $table->string('subject');
            $table->text('message');
            $table->string('status')->default('sent'); // 'sent', 'failed'
            $table->text('error_message')->nullable();
            $table->timestamp('sent_at')->useCurrent();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sent_automation_logs');
    }
};
