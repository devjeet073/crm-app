<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Closure table flattening the document_folder hierarchy.
     * One row per (ancestor, descendant) pair, including self-pairs.
     * Allows O(1) ancestor/descendant lookups without recursive CTEs.
     */
    public function up(): void
    {
        Schema::create('document_folder_paths', function (Blueprint $table) {
            $table->id(); // surrogate int PK, auto-increment

            $table->string('ascendor_id', 17)->nullable();
            $table->string('descendor_id', 17)->nullable();

            $table->index('ascendor_id', 'IDX_ASCENDOR_ID');
            $table->index('descendor_id', 'IDX_DESCENDOR_ID');

            $table->foreign('ascendor_id')
                ->references('id')->on('document_folders')
                ->cascadeOnDelete();

            $table->foreign('descendor_id')
                ->references('id')->on('document_folders')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_folder_paths');
    }
};
