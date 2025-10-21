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
        Schema::create('request_items', function (Blueprint $table) {
            $table->foreignUuid('request_id')
                ->constrained('requests')
                ->cascadeOnDelete();

            $table->foreignUuid('item_id')
                ->constrained('items')
                ->cascadeOnDelete();

            $table->unsignedInteger('quantity');

            // Ini yang penting agar upsert tahu key uniknya
            $table->unique(['request_id', 'item_id']);

            // Untuk optimasi query join/filter
            $table->index(['request_id']);
            $table->index(['item_id']);

            $table->timestamps();
            $table->softDeletes();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('request_items');
    }
};
