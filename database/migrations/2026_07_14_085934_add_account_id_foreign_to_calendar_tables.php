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
        foreach (['calls', 'meetings', 'tasks'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->foreign('account_id')->references('id')->on('accounts')->nullOnDelete();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        foreach (['calls', 'meetings', 'tasks'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropForeign(['account_id']);
            });
        }
    }
};
