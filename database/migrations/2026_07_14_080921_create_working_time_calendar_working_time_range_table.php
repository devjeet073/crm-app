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
        Schema::create('working_time_calendar_working_time_range', function (Blueprint $table) {
            $table->id();
            $table->foreignId('working_time_calendar_id')->nullable()->constrained('working_time_calendars')->cascadeOnDelete();
            $table->foreignId('working_time_range_id')->nullable()->constrained('working_time_ranges')->cascadeOnDelete();
            $table->softDeletes();

            $table->unique(['working_time_calendar_id', 'working_time_range_id'], 'wtc_wtr_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('working_time_calendar_working_time_range');
    }
};
