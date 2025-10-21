<?php

namespace App\Http\Controllers\Auth;

use App\Models\User;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Repositories\SendNotification\SendNotificationRepository;


class CResetPassword extends Controller
{

    use ResponseOutput;
    protected $sendNotificationRepository;
    public function __construct(SendNotificationRepository $sendNotificationRepository)
    {
        $this->sendNotificationRepository = $sendNotificationRepository;
    }
    public function index(Request $request)
    {
        if (!$request->hasValidSignature()) {
            return redirect()->route('login')
                ->with('error', __('Invalid or expired reset password link.'));
        }
        return inertia('Auth/ResetPassword', [
            'identity' => $request->query('identity'),
        ]);
    }

    public function store(ResetPasswordRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $user = User::where('email', $request->identity)
                ->orWhere('username', $request->identity)
                ->first();
            
            if (! $user) {
                return back()
                    ->with(['error' => __('auth.failed')])
                    ->withInput();
            }
            $user->update([
                'password' => $data['password'],
            ]);
            return redirect()
                ->route('login')
                ->with('success', __('Password has been reset successfully.'));
        });
    }
}
