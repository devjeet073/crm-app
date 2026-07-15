<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // team_user: team membership with optional position label
        Schema::create('team_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('role', 100)->nullable()->comment('Position/role label within the team');
            $table->softDeletes();

            $table->unique(['team_id', 'user_id']);
        });

        // role_user: roles assigned directly to individual users
        Schema::create('role_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->softDeletes();

            $table->unique(['role_id', 'user_id']);
        });

        // role_team: roles assigned to a whole team
        Schema::create('role_team', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->softDeletes();

            $table->unique(['role_id', 'team_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('role_team');
        Schema::dropIfExists('role_user');
        Schema::dropIfExists('team_user');
    }
};
