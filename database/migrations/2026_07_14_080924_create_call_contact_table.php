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
        Schema::create('call_contact', function (Blueprint $table) {
            $table->id();
            $table->foreignId('call_id')->nullable()->constrained('calls')->cascadeOnDelete();

            // No `contacts` table yet in this app; keep column + index, add the FK once it exists.
            $table->unsignedBigInteger('contact_id')->nullable();

            $table->string('status', 36)->default('None');
            $table->softDeletes();

            $table->unique(['call_id', 'contact_id']);
            $table->index('contact_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('call_contact');
    }
};
