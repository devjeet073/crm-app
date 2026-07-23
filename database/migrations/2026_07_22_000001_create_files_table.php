<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('files', function (Blueprint $table) {
            $table->string('id', 17)->primary();

            $table->string('name');
            $table->string('original_name');
            $table->string('mime_type');
            $table->unsignedBigInteger('size');
            $table->string('disk')->default('local');
            $table->string('path');

            $table->string('uploaded_by_id', 17)->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('uploaded_by_id')
                ->references('id')->on('users')
                ->nullOnDelete();
        });

        Schema::table('documents', function (Blueprint $table) {
            $table->foreign('file_id')
                ->references('id')->on('files')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('documents', function (Blueprint $table) {
            $table->dropForeign(['file_id']);
        });

        Schema::dropIfExists('files');
    }
};
