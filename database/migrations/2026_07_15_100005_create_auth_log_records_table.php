<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auth_log_records', function (Blueprint $table) {
            $table->id();
            $table->string('username', 100)->nullable();
            $table->string('ip_address', 45)->nullable()->index();
            $table->boolean('is_denied')->default(false);
            $table->string('denial_reason', 255)->nullable();
            $table->double('request_time')->nullable()->index();
            $table->string('request_url', 255)->nullable();
            $table->string('request_method', 15)->nullable();
            $table->string('authentication_method', 255)->nullable();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->unsignedBigInteger('auth_token_id')->nullable()->index();
            $table->timestamps();

            $table->index(['username', 'ip_address']);
            $table->index(['ip_address', 'request_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auth_log_records');
    }
};
