<?php

use App\Http\Controllers\CDatatable;
use Illuminate\Support\Facades\Route;

Route::prefix('datatable')->name('datatable.')->middleware(['auth'])
    ->controller(CDatatable::class)->group(fn() => [
        Route::get('users', 'users')->name('users'),
        Route::get('divisions', 'divisions')->name('divisions'),
        Route::get('suppliers', 'suppliers')->name('suppliers'),
        Route::get('categories', 'categories')->name('categories'),
        Route::get('units', 'units')->name('units'),
        Route::get('items', 'items')->name('items'),
        Route::get('stock-entries', 'stockEntries')->name('stock-entries'),
        Route::get('stock-takings', 'stockTakings')->name('stock-takings'),
        Route::get('item-requests', 'itemRequests')->name('item-requests'),

        Route::get('item-report', 'itemReport')->name('item-report'),
        Route::get('stock-entry-report', 'stockEntryReport')->name('stock-entry-report'),
        Route::get('item-request-report', 'itemRequestReport')->name('item-request-report'),
    ]);
