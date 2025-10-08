<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {

        Schema::table('stock_takings', function (Blueprint $table) {
            // Tambah kolom stock_taking_number
            $table->string('stock_taking_number')->after('id')->unique();
        });
        Schema::table('stock_taking_details', function (Blueprint $table) {
            // Tambah unique composite index
            $table->unique(['stock_taking_id', 'item_id'], 'stock_taking_item_unique');
        });
    }

    public function down(): void
    {
        // Karena MySQL bisa menolak drop jika FK masih aktif,
        // kita cek dulu dan drop constraint-nya sementara
        DB::statement('ALTER TABLE stock_taking_details DROP FOREIGN KEY stock_taking_details_stock_taking_id_foreign');
        DB::statement('ALTER TABLE stock_taking_details DROP FOREIGN KEY stock_taking_details_item_id_foreign');

        Schema::table('stock_takings', function (Blueprint $table) {
            $table->dropColumn('stock_taking_number');
        });
        Schema::table('stock_taking_details', function (Blueprint $table) {
            $table->dropUnique('stock_taking_item_unique');
        });


        // Recreate foreign keys agar tetap aman
        Schema::table('stock_taking_details', function (Blueprint $table) {
            $table->foreign('stock_taking_id')
                ->references('id')
                ->on('stock_takings')
                ->onDelete('cascade');

            $table->foreign('item_id')
                ->references('id')
                ->on('items')
                ->onDelete('cascade');
        });
    }
};
