<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Creates four junction tables linking documents to CRM core entities.
     */
    public function up(): void
    {
        // ── document_lead ───────────────────────────────────────────────────
        Schema::create('document_lead', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('document_id', 17)->nullable();
            $table->unsignedBigInteger('lead_id')->nullable();
            $table->tinyInteger('deleted')->default(0);

            $table->unique(['document_id', 'lead_id'], 'UNIQ_DL_DOCUMENT_ID_LEAD_ID');
            $table->index('document_id', 'IDX_DL_DOCUMENT_ID');
            $table->index('lead_id', 'IDX_DL_LEAD_ID');

            $table->foreign('document_id')
                ->references('id')->on('documents')
                ->cascadeOnDelete();

            $table->foreign('lead_id')
                ->references('id')->on('leads')
                ->cascadeOnDelete();
        });

        // ── document_opportunity ────────────────────────────────────────────
        // No `opportunities` table yet — keep columns & indexes, add FK later.
        Schema::create('document_opportunity', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('document_id', 17)->nullable();
            $table->unsignedBigInteger('opportunity_id')->nullable();
            $table->tinyInteger('deleted')->default(0);

            $table->unique(['document_id', 'opportunity_id'], 'UNIQ_DO_DOCUMENT_ID_OPPORTUNITY_ID');
            $table->index('document_id', 'IDX_DO_DOCUMENT_ID');
            $table->index('opportunity_id', 'IDX_DO_OPPORTUNITY_ID');

            $table->foreign('document_id')
                ->references('id')->on('documents')
                ->cascadeOnDelete();
        });

        // ── account_document ────────────────────────────────────────────────
        Schema::create('account_document', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('account_id')->nullable();
            $table->string('document_id', 17)->nullable();
            $table->tinyInteger('deleted')->default(0);

            $table->unique(['account_id', 'document_id'], 'UNIQ_AD_ACCOUNT_ID_DOCUMENT_ID');
            $table->index('account_id', 'IDX_AD_ACCOUNT_ID');
            $table->index('document_id', 'IDX_AD_DOCUMENT_ID');

            $table->foreign('account_id')
                ->references('id')->on('accounts')
                ->cascadeOnDelete();

            $table->foreign('document_id')
                ->references('id')->on('documents')
                ->cascadeOnDelete();
        });

        // ── contact_document ─────────────────────────────────────────────────
        // No `contacts` table yet — keep columns & indexes, add FK later.
        Schema::create('contact_document', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('contact_id')->nullable();
            $table->string('document_id', 17)->nullable();
            $table->tinyInteger('deleted')->default(0);

            $table->unique(['contact_id', 'document_id'], 'UNIQ_CD_CONTACT_ID_DOCUMENT_ID');
            $table->index('contact_id', 'IDX_CD_CONTACT_ID');
            $table->index('document_id', 'IDX_CD_DOCUMENT_ID');

            $table->foreign('document_id')
                ->references('id')->on('documents')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_document');
        Schema::dropIfExists('account_document');
        Schema::dropIfExists('document_opportunity');
        Schema::dropIfExists('document_lead');
    }
};
