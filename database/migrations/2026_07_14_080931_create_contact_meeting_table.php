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
        Schema::create('contact_meeting', function (Blueprint $table) {
            $table->id();

            // No `contacts` table yet in this app; keep column + index, add the FK once it exists.
            $table->unsignedBigInteger('contact_id')->nullable();

            $table->foreignId('meeting_id')->nullable()->constrained('meetings')->cascadeOnDelete();
            $table->string('status', 36)->default('None');
            $table->softDeletes();

            $table->unique(['contact_id', 'meeting_id']);
            $table->index('contact_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_meeting');
    }
};
