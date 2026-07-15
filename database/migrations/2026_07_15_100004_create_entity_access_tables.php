<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Polymorphic: grant a team visibility to any entity record
        Schema::create('entity_team', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type', 100);
            $table->unsignedBigInteger('entity_id');
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->softDeletes();

            $table->unique(['entity_type', 'entity_id', 'team_id']);
            $table->index(['entity_type', 'entity_id']);
        });

        // Polymorphic: link a user to any entity record (assigned/relevant)
        Schema::create('entity_user', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type', 100);
            $table->unsignedBigInteger('entity_id');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->softDeletes();

            $table->unique(['entity_type', 'entity_id', 'user_id']);
            $table->index(['entity_type', 'entity_id']);
        });

        // Polymorphic: collaborators on any entity record
        Schema::create('entity_collaborator', function (Blueprint $table) {
            $table->id();
            $table->string('entity_type', 100);
            $table->unsignedBigInteger('entity_id');
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->softDeletes();

            $table->unique(['entity_type', 'entity_id', 'user_id']);
            $table->index(['entity_type', 'entity_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entity_collaborator');
        Schema::dropIfExists('entity_user');
        Schema::dropIfExists('entity_team');
    }
};
