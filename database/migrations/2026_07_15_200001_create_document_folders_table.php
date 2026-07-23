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
        Schema::create('document_folders', function (Blueprint $table) {
            $table->string('id', 17)->primary();
            $table->string('name')->nullable();
            $table->mediumText('description')->nullable();

            $table->string('parent_id', 17)->nullable();
            $table->string('created_by_id', 17)->nullable();
            $table->string('modified_by_id', 17)->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('parent_id');
            $table->index('created_by_id');
            $table->index('modified_by_id');
        });

        // Self-referencing FK (deferred — only add once the table exists)
        Schema::table('document_folders', function (Blueprint $table) {
            $table->foreign('parent_id')
                ->references('id')->on('document_folders')
                ->nullOnDelete();
            $table->foreign('created_by_id')
                ->references('id')->on('users')
                ->nullOnDelete();
            $table->foreign('modified_by_id')
                ->references('id')->on('users')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_folders');
    }
};
