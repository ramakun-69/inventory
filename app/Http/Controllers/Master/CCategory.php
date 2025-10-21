<?php

namespace App\Http\Controllers\Master;

use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use App\Http\Requests\Master\CategoryRequest;
use App\Models\Category;
use App\Repositories\App\AppRepository;

class CCategory extends Controller
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
        return inertia('Master/Category');
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
    public function store(CategoryRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $category =  $this->appRepository->updateOrCreateOneModel(new Category(), ['id' => $data['id']], $data);
            $message = $category->wasRecentlyCreated
                ? __('Category created successfully')
                : __('Category updated successfully');
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
    public function destroy(Category $category)
    {
        return $this->safeInertiaExecute(function () use ($category) {
            $this->appRepository->deleteOneModel($category);
            return redirect()->back()->with('success', __('Category deleted successfully'));
        });
    }

    public function trash()
    {
        return inertia('Trash/Category');
    }

    public function restore(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $ids = $request->input('ids', []);
            $model = Category::onlyTrashed()->whereIn('id', $ids);
            $this->appRepository->restore($model);
            return redirect()->back()->with('success', __('Data restored successfully'));
        });
    }

    public function delete(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $ids = $request->input('ids', []);
            $model = Category::onlyTrashed()->whereIn('id', $ids);
            $this->appRepository->forceDeleteOneModel($model);
            return redirect()->back()->with('success', __('Data deleted successfully'));
        });
    }
}
