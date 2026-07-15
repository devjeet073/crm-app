<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // User type: regular | admin | portal | api | system
            $table->string('type', 24)->default('regular')->after('email')->index();
            $table->boolean('is_active')->default(true)->after('type');
            $table->string('title', 100)->nullable()->after('is_active')->comment('Job title');
            $table->string('avatar_color', 7)->nullable()->after('title')->comment('UI color hex');
            $table->string('salutation_name', 20)->nullable()->after('avatar_color');
            $table->string('middle_name', 100)->nullable()->after('name');
            $table->string('gender', 20)->nullable();
            $table->string('auth_method', 24)->nullable()->comment('Override authentication method');
            $table->string('api_key', 100)->nullable()->unique()->comment('API key for api-type users');

            // Default team FK
            $table->foreignId('default_team_id')->nullable()->after('gender')
                ->constrained('teams')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['default_team_id']);
            $table->dropColumn([
                'type', 'is_active', 'title', 'avatar_color', 'salutation_name',
                'middle_name', 'gender', 'auth_method', 'api_key', 'default_team_id',
            ]);
        });
    }
};
