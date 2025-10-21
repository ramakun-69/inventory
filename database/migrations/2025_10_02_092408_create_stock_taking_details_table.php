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
        Schema::create('stock_taking_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('stock_taking_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('item_id')->constrained()->onDelete('cascade');
            $table->integer('system_stock');
            $table->integer('actual_stock');
            $table->integer('difference');
            $table->longText('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_taking_details');
    }
};
