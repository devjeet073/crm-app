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
        Schema::create('automated_greetings', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type'); // 'birthday', 'festival'
            $table->date('event_date')->nullable();
            $table->string('template_subject');
            $table->text('template_body');
            $table->string('target_type')->default('all'); // 'all', 'leads', 'users'
            $table->string('status')->default('active'); // 'active', 'paused'
            $table->boolean('recurring')->default(true);
            $table->timestamp('last_run_at')->nullable();
            $table->foreignId('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('automated_greetings');
    }
};
