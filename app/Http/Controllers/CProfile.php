<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Division;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\ProfileRequest;

class CProfile extends Controller
{
    use ResponseOutput;
    public function index()
    {
        return inertia('Profile/Index', [
          'division' => Division::select('id', 'name')->get(),
        ]);
    }

    public function update(ProfileRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $user = User::find(Auth::id());
            if (isset($data['photo'])) {
                $data['photo'] = $request->file('photo')->store('photos', 'public');
            } else {
                unset($data['photo']);
            }
            if (empty($data['password'])) {
                unset($data['password']);
            }
            $user->update($data);
            return redirect()->back()->with('success', __('Profile updated successfully'));
        });
    }
}
