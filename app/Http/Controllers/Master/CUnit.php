<?php

namespace App\Http\Controllers\Master;

use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\UnitRequest;
use App\Models\Unit;
use App\Repositories\App\AppRepository;

class CUnit extends Controller
{
    use ResponseOutput;
    protected $appRepository;
    public function __construct(AppRepository $appRepository)
    {
        $this->appRepository = $appRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Master/Unit');
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
    public function store(UnitRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $unit =  $this->appRepository->updateOrCreateOneModel(new Unit(), ['id' => $data['id']], $data);
            $message = $unit->wasRecentlyCreated
                ? __('Unit created successfully')
                : __('Unit updated successfully');
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
    public function destroy(Unit $unit)
    {
        return $this->safeInertiaExecute(function () use ($unit) {
            $this->appRepository->deleteOneModel($unit);
            return redirect()->back()->with('success', __('Unit deleted successfully'));
        });
    }

    public function trash()
    {
        return inertia('Trash/Unit');
    }

    public function restore(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $this->appRepository->restore(Unit::onlyTrashed()->whereIn('id', $request->ids));
            return redirect()->back()->with('success', __("Data restored successfully"));
        });
    }
    public function delete(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $this->appRepository->forceDeleteOneModel(Unit::onlyTrashed()->whereIn('id', $request->ids));
            return redirect()->back()->with('success', __("Data deleted successfully"));
        });
    }
}
