<?php

namespace App\Http\Controllers\Report;

use App\Models\Supplier;
use App\Models\StockEntry;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Models\StockEntryDetail;
use App\Exports\StockEntryReport;
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
            $data = StockEntryDetail::with(['entry.user', 'item', 'supplier'])
                ->when(
                    $request->filled('start_date') && $request->filled('end_date'),
                    fn($q) => $q->whereHas(
                        'entry',
                        fn($q2) =>
                        $q2->whereBetween('entry_date', [$request->start_date, $request->end_date])
                    )
                )
                ->when(
                    $request->filled('supplier_id'),
                    fn($q) => $q->where('supplier_id', $request->supplier_id)
                )
                ->orderByDesc('created_at')
                ->get();


            $export = Excel::download(new StockEntryReport($data), __("Stock Entry Report") . '.xlsx');
            return $export;
        });
    }
    /**
     * Show the form for creating a new resource.
     */
}
