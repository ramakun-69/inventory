<?php

use App\Http\Controllers\CTrash;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Master\CItem;
use App\Http\Controllers\Master\CUnit;
use App\Http\Controllers\Master\CUser;
use App\Http\Controllers\Master\CCategory;
use App\Http\Controllers\Master\CDivision;
use App\Http\Controllers\Master\CSupplier;

Route::prefix('datatable/trash')->name('datatable.trash.')->middleware(['auth'])
    ->controller(CTrash::class)->group(fn() => [
        Route::get('users', 'users')->name('users'),
        Route::get('divisions', 'divisions')->name('divisions'),
        Route::get('suppliers', 'suppliers')->name('suppliers'),
        Route::get('categories', 'categories')->name('categories'),
        Route::get('units', 'units')->name('units'),
        Route::get('items', 'items')->name('items'),
    ]);
Route::prefix('trash')->name('trash.')->middleware(['auth'])
    ->group(fn() => [
        Route::get('users', [CUser::class,'trash'])->name('users'),
        Route::get('divisions', [CDivision::class,'trash'])->name('divisions'),
        Route::get('suppliers', [CSupplier::class,'trash'])->name('suppliers'),
        Route::get('categories', [CCategory::class,'trash'])->name('categories'),
        Route::get('units', [CUnit::class,'trash'])->name('units'),
        Route::get('items', [CItem::class,'trash'])->name('items'),
    ]);
