<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Requests\SettingsRequest;

class CSettings extends Controller
{
    use ResponseOutput;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Settings');
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
    public function store(SettingsRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            if ($request->hasFile('logo')) {
                $data['logo'] = $request->file('logo')->store('settings', 'public');
            }
            settings()->set($data);
            return redirect()->back()->with('success', __('Settings updated successfully.'));
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
    public function destroy(string $id)
    {
        //
    }
}
