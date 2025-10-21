<?php

namespace App\Http\Controllers\Master;

use App\Models\User;
use App\Models\Division;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Controller;
use App\Repositories\App\AppRepository;
use App\Http\Requests\Master\UserRequest;
use App\Repositories\SendNotification\SendNotificationRepository;

class CUser extends Controller
{
    use ResponseOutput;
    protected $appRepository, $sendNotificationRepository;
    public function __construct(AppRepository $appRepository, SendNotificationRepository $sendNotificationRepository)
    {
        $this->appRepository = $appRepository;
        $this->sendNotificationRepository = $sendNotificationRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Master/User', [
            'divisions' => Division::select('id', 'name')->get(),
            'roles' => Role::select('id', 'name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $userData = collect($data)
                ->except('role')
                ->toArray();
            $user = $this->appRepository->updateOrCreateOneModel(
                new User(),
                ['id' => $data['id']],
                array_merge($userData, ['password' => bcrypt('12345678')])
            );
            $user->syncRoles($data['role']);
            $message = $user->wasRecentlyCreated ? __("User created successfully") : __("User updated successfully");
            $user->wasRecentlyCreated && $this->sendNotification($user, [
                'NAME' => $user->name,
                'EMAIL' => $user->email,
                'USERNAME' => $user->username,
                'PASSWORD' => '12345678',
            ]);
            return redirect()->back()->with('success', $message);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        return $this->safeInertiaExecute(function () use ($user) {
            $this->appRepository->deleteOneModel($user);
            return redirect()->back()->with('success', __('User deleted successfully'));
        });
    }

    public function trash(Request $request)
    {
        return inertia('Trash/User');
    }
    public function delete(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $this->appRepository->forceDeleteOneModel(User::onlyTrashed()->whereIn('id', $request->ids));
            return redirect()->back()->with('success', __('Data deleted successfully'));
        });
    }

    public function restore(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $this->appRepository->restore(User::onlyTrashed()->whereIn('id', $request->ids));
            return redirect()->back()->with('success', __('User restored successfully'));
        });
    }

    protected function sendNotification($user, $data)
    {
        $this->sendNotificationRepository->sendWhatsappMessage(
            $user->phone,
            $data,
            'new-user-notification.txt'
        );
    }
}
