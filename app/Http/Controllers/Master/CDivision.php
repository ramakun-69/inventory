<?php

namespace App\Http\Controllers\Master;

use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\DivisionRequest;
use App\Models\Division;
use App\Repositories\App\AppRepository;

class CDivision extends Controller
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
        return inertia('Master/Division');
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
    public function store(DivisionRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $division =  $this->appRepository->updateOrCreateOneModel(new Division(), ['id' => $data['id']], [
                'name' => $data['division_name'],
            ]);
            $message = $division->wasRecentlyCreated
                ? __('Division created successfully')
                : __('Division updated successfully');
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
    public function destroy(Division $division)
    {
        return $this->safeInertiaExecute(function () use ($division) {
            $this->appRepository->deleteOneModel($division);
            return redirect()->back()->with('success', __('Division deleted successfully'));
        });
    }

    public function trash()
    {
        return inertia('Trash/Division');
    }

    public function restore(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $ids = $request->input('ids', []);
            $model = Division::onlyTrashed()->whereIn('id', $ids);
            $this->appRepository->restore($model);
            return redirect()->back()->with('success', __('Data restored successfully'));
        });
    }

    public function delete(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $ids = $request->input('ids', []);
            $model = Division::onlyTrashed()->whereIn('id', $ids);
            $this->appRepository->forceDeleteOneModel($model);
            return redirect()->back()->with('success', __('Data deleted successfully'));
        });
    }
}
