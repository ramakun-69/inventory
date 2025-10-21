<?php

namespace App\Http\Controllers\Inventory;

use App\Models\Item;
use App\Models\StockTaking;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use App\Repositories\App\AppRepository;
use App\Http\Requests\Inventory\StockTakingRequest;
use App\Repositories\Inventory\InventoryRepository;

class CStockTaking extends Controller
{
    use ResponseOutput;
    protected $inventoryRepository, $appRepository;
    public function __construct(InventoryRepository $inventoryRepository, AppRepository $appRepository)
    {
        $this->inventoryRepository = $inventoryRepository;
        $this->appRepository = $appRepository;
    }
    public function index()
    {
        return inertia('Inventory/StockTaking', [
            'items' => Item::with('category:id,name')
                ->select('id', 'name', 'item_code', 'category_id','stock')
                ->get()

        ]);
    }

    public function store(StockTakingRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $this->inventoryRepository->stockTaking($data);
            $message = !empty($data['id'])
                ? __('Stock Taking updated successfully')
                : __('Stock Taking created successfully');
            return redirect()->back()->with('success', $message);
        });
    }

    public function destroy(StockTaking $stockTaking)
    {
        return $this->safeInertiaExecute(function () use ($stockTaking) {
            $this->appRepository->deleteOneModel($stockTaking);
            return redirect()->back()->with('success', __('Stock Taking deleted successfully'));
        });
    }
}
