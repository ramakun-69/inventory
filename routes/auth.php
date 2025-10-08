<?php

use App\Http\Controllers\Auth\CLogin;
use App\Http\Controllers\Auth\CResetPassword;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest'])->group(function () {
    Route::get('/', [CLogin::class, 'index'])->name('login');
    Route::post('/authenticate', [CLogin::class, 'authenticate'])->name('authenticate');
    // Route::resource('reset-password', CResetPassword::class);
});
Route::post('/logout', [CLogin::class, 'logout'])->name('logout');
