<?php

namespace App\Http\Controllers\Master;

use App\Models\Supplier;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use App\Repositories\App\AppRepository;
use App\Http\Requests\Master\SupplierRequest;

class CSupplier extends Controller
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
        return inertia('Master/Supplier');
    }

     public function store(SupplierRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $supplier =  $this->appRepository->updateOrCreateOneModel(new Supplier(), ['id' => $data['id']], $data);
            $message = $supplier->wasRecentlyCreated
                ? __('Supplier created successfully')
                : __('Supplier updated successfully');
            return redirect()->back()->with('success', $message);
        });
    }

     public function destroy(Supplier $supplier)
    {
        return $this->safeInertiaExecute(function () use ($supplier) {
            $this->appRepository->deleteOneModel($supplier);
            return redirect()->back()->with('success', __('Supplier deleted successfully'));
        });
    }

    public function trash()
    {
        return inertia('Trash/Supplier');
    }

    public function restore(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $ids = $request->input('ids', []);
            $model = Supplier::onlyTrashed()->whereIn('id', $ids);
            $this->appRepository->restore($model);
            return redirect()->back()->with('success', __('Data restored successfully'));
        });
    }

    public function delete(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $ids = $request->input('ids', []);
            $model = Supplier::onlyTrashed()->whereIn('id', $ids);
            $this->appRepository->forceDeleteOneModel($model);
            return redirect()->back()->with('success', __('Data deleted successfully'));
        });
    }

}
