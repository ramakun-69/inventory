<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\User;
use App\Models\Category;
use App\Models\Supplier;
use App\Models\StockEntry;
use App\Models\ItemRequest;
use App\Models\RequestItem;
use App\Models\StockTaking;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

class CIndex extends Controller
{
    use ResponseOutput;
    public function index()
    {
        $monthlyRequests = ItemRequest::selectRaw('MONTH(request_date) as month, COUNT(*) as total')
            ->whereYear('request_date', now()->year)
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('total', 'month');

        $monthlyData = [];
        for ($i = 1; $i <= 12; $i++) {
            $monthlyData[] = $monthlyRequests[$i] ?? 0;
        }
        $popularItems = RequestItem::select('item_id', DB::raw('COUNT(*) as total'))
            ->groupBy('item_id')
            ->orderByDesc('total')
            ->with('item:id,name') // pastikan relasi item() ada di model ItemRequestDetail
            ->limit(5)
            ->get()
            ->map(fn($r) => [
                'name' => $r->item?->name ?? 'Unknown',
                'count' => $r->total,
            ]);
        return inertia('Index', [
            'users' => User::cursor(),
            'items' => Item::cursor(),
            'suppliers' => Supplier::cursor(),
            'categories' => Category::cursor(),
            'itemRequests' => ItemRequest::cursor(),
            'stockTakings' => StockTaking::cursor(),
            'stockEntries' => StockEntry::cursor(),
            'monthlyRequests' => $monthlyData,
            'popularItems' => $popularItems
        ]);
    }

    public function setLanguage(Request $request)
    {
        return $this->safeExecute(function () use ($request) {
            $lang = $request->locale;
            $lang = strtolower(substr($lang, 0, 2));
            Session::put('locale', $lang);
            return $this->responseSuccess([
                'message' => __('Language changed successfully')
            ]);
        });
    }
}
