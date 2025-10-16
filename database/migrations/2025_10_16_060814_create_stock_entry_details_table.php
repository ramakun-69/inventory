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
        Schema::table('stock_entries', function (Blueprint $table) {
            $table->foreignId('user_id')->after('id')->constrained()->onDelete('cascade');
        });
        Schema::create('stock_entry_details', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('stock_entry_id')
                ->constrained('stock_entries')
                ->cascadeOnDelete();
            $table->foreignUuid('item_id')
                ->constrained('items')
                ->cascadeOnDelete();
            $table->foreignUuid('supplier_id')
                ->constrained('suppliers')
                ->cascadeOnDelete();
            $table->integer('quantity');
            $table->timestamps();
            $table->unique(['stock_entry_id', 'item_id'], 'unique_entry_item');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stock_entries', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
        Schema::dropIfExists('stock_entry_details');
    }
};
