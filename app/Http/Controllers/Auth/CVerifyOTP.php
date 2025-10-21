<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use Illuminate\Support\Facades\URL;
use App\Http\Controllers\Controller;

class CVerifyOTP extends Controller
{
    use ResponseOutput;
    public function index(Request $request)
    {
        if (! $request->hasValidSignature()) {
            return redirect()->route('forgot-password.index')
                ->with('error', __('Invalid or expired OTP link.'));
        }

        return inertia('Auth/VerifyOtp', [
            'identity' => $request->query('identity'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'otp' => 'required',
            'identity' => 'required|string',
        ]);
        $otp = implode('', $request->otp);
        $user = User::where('email', $request->identity)
            ->orWhere('username', $request->identity)
            ->first();
        if (! $user || $user->otp !== $otp || now()->greaterThan($user->otp_expires_at)) {
            return back()->with('error', __('Invalid or expired OTP.'));
        }
        $signedUrl = URL::temporarySignedRoute(
            'reset-password.index',
            now()->addMinutes(10),
            ['identity' => $user->email ?? $user->username]
        );
        return redirect($signedUrl)
            ->with('success', __('OTP verified successfully.'));
    }
}
