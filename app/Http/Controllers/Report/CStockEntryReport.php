<?php

namespace App\Http\Controllers\Report;

use App\Exports\StockEntryReport;
use App\Models\Supplier;
use App\Models\StockEntry;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

class CStockEntryReport extends Controller
{
    use ResponseOutput;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Report/StockEntryReport', [
            'suppliers' => Supplier::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
           $data = StockEntry::with(['item', 'supplier', 'user'])
            ->when($request->filled('start_date') && $request->filled('end_date'), function ($query) use ($request) {
                $query->whereBetween('entry_date', [$request->start_date, $request->end_date]);
            })
            ->when(
                $request->filled('supplier_id'),
                fn($q) =>
                $q->where('supplier_id', $request->supplier_id)
            )
            ->get();

            $export = Excel::download(new StockEntryReport($data), __("Stock Entry Report") . '.xlsx');
            return $export;
        });
    }
    /**
     * Show the form for creating a new resource.
     */
}
