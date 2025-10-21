<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Traits\ResponseOutput;
use Illuminate\Support\Facades\URL;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Repositories\SendNotification\SendNotificationRepository;

class CForgotPassword extends Controller
{

    use ResponseOutput;
    protected $sendNotificationRepository;
    public function __construct(SendNotificationRepository $sendNotificationRepository)
    {
        $this->sendNotificationRepository = $sendNotificationRepository;
    }
    public function index()
    {
        return inertia('Auth/ForgotPassword');
    }

    public function store(ForgotPasswordRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $user = User::where('email', $request->identity)
                ->orWhere('username', $request->identity)
                ->first();

            if (! $user) {
                return back()
                    ->withErrors(['identity' => __('auth.failed')])
                    ->withInput();
            }

            $otp = rand(100000, 999999);

            $user->update([
                'otp' => $otp,
                'otp_expires_at' => now()->addMinutes(10),
            ]);

            $this->sendNotificationRepository->sendWhatsappMessage(
                $user->phone,
                compact('otp'),
                'otp-message.txt'
            );

            $signedUrl = URL::temporarySignedRoute(
                'verify-otp.index',
                now()->addMinutes(10),
                ['identity' => $user->email ?? $user->username]
            );

            // 🚀 Redirect ke halaman verify-otp lewat Inertia
            return redirect($signedUrl)
                ->with('success', __('An OTP has been sent to your WhatsApp.'));
        });
    }
}
