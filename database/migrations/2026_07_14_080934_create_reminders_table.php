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
        Schema::create('reminders', function (Blueprint $table) {
            $table->id();
            $table->dateTime('remind_at')->nullable()->index();
            $table->dateTime('start_at')->nullable()->index();
            $table->string('type', 36)->default('Popup')->index();
            $table->integer('seconds')->default(0);
            $table->boolean('is_submitted')->default(false);

            $table->foreignId('user_id')->nullable()->constrained('users')->cascadeOnDelete();

            // Polymorphic target (Call, Meeting, Task, etc. depending on entity_type)
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->string('entity_type', 100)->nullable();

            $table->softDeletes();

            $table->index(['entity_id', 'entity_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reminders');
    }
};
