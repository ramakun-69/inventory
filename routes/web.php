<?php

use App\Http\Controllers\CIndex;
use App\Http\Controllers\CProfile;
use App\Http\Controllers\CSettings;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Master\CItem;
use App\Http\Controllers\Master\CUnit;
use App\Http\Controllers\Master\CUser;
use App\Http\Controllers\Master\CCategory;
use App\Http\Controllers\Master\CDivision;
use App\Http\Controllers\Master\CSupplier;
use App\Http\Controllers\Report\CItemReport;
use App\Http\Controllers\Inventory\CStockEntry;
use App\Http\Controllers\Inventory\CItemRequest;
use App\Http\Controllers\Inventory\CStockTaking;
use App\Http\Controllers\Report\CStockEntryReport;
use App\Http\Controllers\Report\CItemRequestReport;

Route::middleware(['auth'])->group(function () {
    Route::middleware('role:Admin|User|Warehouse')->group(function () {
        Route::get('/dashboard', [CIndex::class, 'index'])->name('dashboard');
        Route::post('/set-language', [CIndex::class, 'setLanguage'])->name('set-language');
    });
    Route::prefix('master-data')->name('master-data.')->group(function () {
        // Admin Only
        Route::middleware('role:Admin')->group(function () {
            Route::post('restore/user', [CUser::class, 'restore'])->name('users.restore');
            Route::delete('delete/user', [CUser::class, 'delete'])->name('users.delete');
            Route::resource('users', CUser::class);
        });
        // Admin & Warehouse
        Route::middleware('role:Admin|Warehouse')->group(function () {
            Route::post('restore/divisions', [CDivision::class, 'restore'])->name('divisions.restore');
            Route::delete('delete/divisions', [CDivision::class, 'delete'])->name('divisions.delete');
            Route::resource('divisions', CDivision::class);
            Route::post('restore/suppliers', [CSupplier::class, 'restore'])->name('suppliers.restore');
            Route::delete('delete/suppliers', [CSupplier::class, 'delete'])->name('suppliers.delete');
            Route::resource('suppliers', CSupplier::class);
            Route::post('restore/categories', [CCategory::class, 'restore'])->name('categories.restore');
            Route::delete('delete/categories', [CCategory::class, 'delete'])->name('categories.delete');
            Route::resource('categories', CCategory::class);
            Route::post('restore/units', [CUnit::class, 'restore'])->name('units.restore');
            Route::delete('delete/units', [CUnit::class, 'delete'])->name('units.delete');
            Route::resource('units', CUnit::class);
            Route::post('restore/items', [CItem::class, 'restore'])->name('items.restore');
            Route::delete('delete/items', [CItem::class, 'delete'])->name('items.delete');
            Route::resource('items', CItem::class);
        });
    });
    Route::prefix('inventory')->name('inventory.')->group(function () {
        // Admin & Warehouse
        Route::middleware('role:Admin|Warehouse')->group(function () {
            Route::resource('stock-entries', CStockEntry::class);
            Route::resource('stock-takings', CStockTaking::class);
            Route::put('item-requests/confirm/{id}', [CItemRequest::class, 'confirm'])->name('item-requests.confirm');
        });
        Route::resource('item-requests', CItemRequest::class);
    });
    Route::prefix('report')->middleware('role:Admin|Warehouse')->name('report.')->group(function () {
        Route::post('items/export', [CItemReport::class, 'store'])->name('items.export');
        Route::resource('items', CItemReport::class);
        Route::post('stock-entries/export', [CStockEntryReport::class, 'store'])->name('stock-entries.export');
        Route::resource('stock-entries', CStockEntryReport::class);
        Route::post('item-requests/export', [CItemRequestReport::class, 'store'])->name('item-requests.export');
        Route::resource('item-requests', CItemRequestReport::class);
    });

    Route::resource('settings', CSettings::class)->middleware('role:Admin');
    Route::resource('profile', CProfile::class);
});
