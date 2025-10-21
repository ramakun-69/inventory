<?php

namespace App\Http\Controllers\Inventory;

use App\Models\Item;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use App\Repositories\App\AppRepository;
use App\Http\Requests\Inventory\ItemRequest;
use App\Models\ItemRequest as ModelsItemRequest;
use App\Repositories\Inventory\InventoryRepository;

class CItemRequest extends Controller
{
    use ResponseOutput;
    protected $inventoryRepository, $appRepository;
    public function __construct(InventoryRepository $inventoryRepository, AppRepository $appRepository)
    {
        $this->inventoryRepository = $inventoryRepository;
        $this->appRepository = $appRepository;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Inventory/ItemRequest', [
            'items' => Item::with('category:id,name')
                ->select('id', 'name', 'item_code','stock', 'category_id')
                ->get()

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
    public function store(ItemRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $this->inventoryRepository->itemRequest($data);
            $message = !empty($data['id'])
                ? __('Item request updated successfully')
                : __('Item request created successfully');
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

    public function confirm($id, Request $request)
    {
        return $this->safeInertiaExecute(function () use ($id, $request) {
            $itemRequest = ModelsItemRequest::findOrFail($id);
            $this->inventoryRepository->confirmItemRequest($itemRequest, $request->input('status'));
            return redirect()->back()->with('success', __('Item request status updated successfully'));
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ModelsItemRequest $itemRequest)
    {
        return $this->safeInertiaExecute(function () use ($itemRequest) {
            $this->appRepository->deleteOneModel($itemRequest);
            return redirect()->back()->with('success', __('Item request deleted successfully'));
        });
    }
}
