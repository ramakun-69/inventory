<?php

namespace App\Http\Controllers\Report;

use App\Models\Division;
use App\Models\ItemRequest;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Exports\ItemRequestReport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

class CItemRequestReport extends Controller
{
    use ResponseOutput;
    public function index(Request $request)
    {
        return inertia('Report/ItemRequestReport', [
            'divisions' => Division::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = ItemRequest::with(['user', 'items.unit'])
                ->when($request->filled('start_date') && $request->filled('end_date'), function ($query) use ($request) {
                    $query->whereBetween('request_date', [$request->start_date, $request->end_date]);
                })
                ->when(
                    $request->filled('division_id'),
                    fn($q) =>
                    $q->whereHas('user', fn($q2) => $q2->where('division_id', $request->division_id))
                )->get();
            $export = Excel::download(new ItemRequestReport($data), __("Item Request Report") . '.xlsx');
            return $export;
        });
    }
}
