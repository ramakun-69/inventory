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
        Schema::create('stock_entries', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('entry_number')->unique();
            $table->foreignUuid('item_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('supplier_id')->constrained()->onDelete('cascade');
            $table->integer('quantity');
            $table->date('entry_date');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_entries');
    }
};
