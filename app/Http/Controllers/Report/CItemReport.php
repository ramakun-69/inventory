<?php

namespace App\Http\Controllers\Report;

use App\Models\Item;
use App\Models\Category;
use App\Models\Supplier;
use App\Exports\ItemReport;
use Illuminate\Http\Request;
use App\Traits\ResponseOutput;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;

class CItemReport extends Controller
{

    use ResponseOutput;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia('Report/ItemReport', [
            'categories' => Category::select('id', 'name')->get(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        return $this->safeInertiaExecute(function () use ($request) {
            $data = Item::with(['category', 'unit'])
                ->when($request->filled('category_id'), function ($query) use ($request) {
                    $query->where('category_id', $request->category_id);
                })
                ->get();
            $export = Excel::download(new ItemReport($data), __("Item Report") . '.xlsx');
            return $export;
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
    public function destroy(string $id)
    {
        //
    }
}
