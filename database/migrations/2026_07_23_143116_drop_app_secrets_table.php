<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('app_secrets');
    }

    public function down(): void
    {
        // Re-create is handled by the original migration
    }
};
