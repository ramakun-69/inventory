<?php

namespace App\Http\Controllers\Auth;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\LoginRequest;

class CLogin extends Controller
{
    use ResponseOutput;
    public function index()
    {
        return Inertia::render('Auth/Login');
    }

    public function authenticate(LoginRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $credentials = [
                filter_var($request->identity, FILTER_VALIDATE_EMAIL) ? 'email' : 'username' => $request->identity,
                'password' => $request->password,
            ];

            if (Auth::attempt($credentials, $request->boolean('remember'))) {
                return redirect()->intended(route('dashboard'))
                    ->with('success', __('Login successful'));
            }
            return redirect()->back()
                ->withErrors(['identity' => __('auth.failed')])
                ->withInput();
        });
    }

    public function logout(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect()->route('login')->with('success', __('Logged out successfully'));
        });
    }
}
