<?php

namespace App\Http\Controllers\Master;

use App\Models\Item;
use App\Models\Unit;
use App\Models\Category;
use App\Models\Supplier;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use App\Repositories\App\AppRepository;
use App\Http\Requests\Master\ItemRequest;

class CItem extends Controller
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
        return inertia('Master/Item', [
            'categories' => Category::select('id', 'name')->cursor(),
            'units' => Unit::select('id', 'name')->cursor(),
            'suppliers' => Supplier::select('id', 'name')->cursor(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(ItemRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $data['name'] = $data['item_name'];
            unset($data['item_name']);
            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('items', 'public');
            }
            $item =  $this->appRepository->updateOrCreateOneModel(new Item(), ['id' => $data['id']], $data);
            $message = $item->wasRecentlyCreated
                ? __('Item created successfully')
                : __('Item updated successfully');
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
    public function destroy(Item $item)
    {
        return $this->safeInertiaExecute(function () use ($item) {
            $this->appRepository->deleteOneModel($item);
            return redirect()->back()->with('success', __('Item deleted successfully'));
        });
    }

    public function trash()
    {
       return inertia('Trash/Item');
    }

    public function restore(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $this->appRepository->restore(Item::withTrashed()->whereIn('id', $request->ids));
            return redirect()->back()->with('success', __('Data restored successfully'));
        });
    }

    public function delete(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $this->appRepository->forceDeleteOneModelWithFile(Item::withTrashed()->whereIn('id', $request->ids), 'image');
            return redirect()->back()->with('success', __('Data deleted permanently'));
        });
    }
}
