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
        Schema::create('documents', function (Blueprint $table) {
            $table->string('id', 17)->primary();

            $table->string('name')->nullable();
            $table->string('status')->default('Active');
            $table->string('type')->nullable();
            $table->date('publish_date')->nullable();
            $table->date('expiration_date')->nullable();
            $table->mediumText('description')->nullable();

            // FK-style references (varchar(17), no formal FK since attachment table not yet created)
            $table->string('file_id', 17)->nullable()->index();

            $table->string('folder_id', 17)->nullable();
            $table->string('created_by_id', 17)->nullable();
            $table->string('modified_by_id', 17)->nullable();
            $table->string('assigned_user_id', 17)->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index('folder_id', 'IDX_FOLDER_ID');
            $table->index('created_by_id', 'IDX_CREATED_BY_ID');
            $table->index('modified_by_id', 'IDX_MODIFIED_BY_ID');
            $table->index('assigned_user_id', 'IDX_ASSIGNED_USER_ID');

            $table->foreign('folder_id')
                ->references('id')->on('document_folders')
                ->nullOnDelete();

            $table->foreign('created_by_id')
                ->references('id')->on('users')
                ->nullOnDelete();

            $table->foreign('modified_by_id')
                ->references('id')->on('users')
                ->nullOnDelete();

            $table->foreign('assigned_user_id')
                ->references('id')->on('users')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
