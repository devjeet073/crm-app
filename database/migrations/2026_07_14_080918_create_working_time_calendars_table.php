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
        Schema::create('working_time_calendars', function (Blueprint $table) {
            $table->id();
            $table->string('name')->nullable();
            $table->mediumText('description')->nullable();
            $table->string('time_zone')->nullable();
            $table->mediumText('time_ranges')->nullable();

            $table->boolean('weekday0')->default(false);
            $table->boolean('weekday1')->default(true);
            $table->boolean('weekday2')->default(true);
            $table->boolean('weekday3')->default(true);
            $table->boolean('weekday4')->default(true);
            $table->boolean('weekday5')->default(true);
            $table->boolean('weekday6')->default(false);

            $table->mediumText('weekday0_time_ranges')->nullable();
            $table->mediumText('weekday1_time_ranges')->nullable();
            $table->mediumText('weekday2_time_ranges')->nullable();
            $table->mediumText('weekday3_time_ranges')->nullable();
            $table->mediumText('weekday4_time_ranges')->nullable();
            $table->mediumText('weekday5_time_ranges')->nullable();
            $table->mediumText('weekday6_time_ranges')->nullable();

            $table->foreignId('created_by_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('modified_by_id')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('working_time_calendars');
    }
};
