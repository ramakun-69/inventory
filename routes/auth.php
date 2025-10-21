<?php

use App\Http\Controllers\Auth\CLogin;
use App\Http\Controllers\Auth\CForgotPassword;
use App\Http\Controllers\Auth\CResetPassword;
use App\Http\Controllers\Auth\CVerifyOTP;
use Illuminate\Support\Facades\Route;

Route::middleware(['guest'])->group(function () {
    Route::get('/', [CLogin::class, 'index'])->name('login');
    Route::post('/authenticate', [CLogin::class, 'authenticate'])->name('authenticate');

    Route::resource('forgot-password', CForgotPassword::class);
    Route::get('reset-password', [CResetPassword::class, 'index'])
        ->name('reset-password.index');
    Route::post('reset-password', [CResetPassword::class, 'store'])
        ->name('reset-password.store');
    Route::get('verify-otp', [CVerifyOTP::class, 'index'])
        ->name('verify-otp.index');

    Route::post('verify-otp', [CVerifyOTP::class, 'store'])
        ->name('verify-otp.store');
});
Route::post('/logout', [CLogin::class, 'logout'])->name('logout');
