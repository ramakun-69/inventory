<?php

namespace App\Http\Controllers\Inventory;

use Carbon\Carbon;
use App\Models\Item;
use App\Models\Supplier;
use App\Models\StockEntry;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Repositories\App\AppRepository;
use App\Http\Requests\Inventory\StockEntryRequest;
use App\Repositories\Inventory\InventoryRepository;

class CStockEntry extends Controller
{
    use ResponseOutput;
    protected $inventoryRepository;
    public function __construct(InventoryRepository $inventoryRepository)
    {
        $this->inventoryRepository = $inventoryRepository;
    }
    public function index()
    {
        return inertia('Inventory/StockEntry', [
            'items' => Item::cursor(),
            'suppliers' => Supplier::cursor()
        ]);
    }

    public function store(StockEntryRequest $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = $request->validated();
            $data['user_id'] = Auth::id();
            if ($data['id'] == null) {
                $data['entry_number'] = $this->generateEntryCode();
            }
            $data['entry_date'] = Carbon::now();
            $this->inventoryRepository->stockEntry($data);
            $message = !empty($data['id'])
                ? __('Stock entry updated successfully')
                : __('Stock entry created successfully');
            return redirect()->back()->with('success', $message);
        });
    }
    public function destroy(StockEntry $stockEntry)
    {
        return $this->safeInertiaExecute(function () use ($stockEntry) {
            $this->inventoryRepository->deleteStockEntry($stockEntry);
            return redirect()->back()->with('success', __('Stock entry deleted successfully'));
        });
    }


    protected function generateEntryCode()
    {
        $today = Carbon::now()->format('d/m/Y');
        $latestEntry = StockEntry::orderBy('created_at', 'desc')->first();
        if ($latestEntry) {
            // Ambil nomor terakhir setelah tanda "-"
            $lastNumber = $latestEntry->entry_number;
            $lastNumber = (int) substr($lastNumber, strrpos($lastNumber, '-') + 1);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }
        return "{$today}-{$newNumber}";
    }
}
