<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('description')->nullable();

            // Scope-level permission columns (values: not-set | yes | no | team | own | all)
            $table->string('assignment_permission', 50)->default('not-set');
            $table->string('user_permission', 50)->default('not-set');
            $table->string('message_permission', 50)->default('not-set');
            $table->string('portal_permission', 50)->default('not-set');
            $table->string('group_email_account_permission', 50)->default('not-set');
            $table->string('export_permission', 50)->default('not-set');
            $table->string('mass_update_permission', 50)->default('not-set');
            $table->string('data_privacy_permission', 50)->default('not-set');
            $table->string('follower_management_permission', 50)->default('not-set');
            $table->string('audit_permission', 50)->default('not-set');
            $table->string('mention_permission', 50)->default('not-set');
            $table->string('user_calendar_permission', 50)->default('not-set');
            $table->string('lock_permission', 50)->default('not-set');

            // Serialized per-entity CRUD / per-field ACL data
            $table->json('data')->nullable()->comment('Per-entity-type CRUD/access-level ACL table');
            $table->json('field_data')->nullable()->comment('Per-field-level ACL table');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
