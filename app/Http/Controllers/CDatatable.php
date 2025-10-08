<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Unit;
use App\Models\User;
use App\Models\Category;
use App\Models\Division;
use App\Models\ItemRequest;
use App\Models\Supplier;
use App\Models\StockEntry;
use App\Models\StockTaking;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CDatatable extends Controller
{

    // MASTER DATA 
    public function users(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $data = User::query()
            ->when($request->filled('search'), function ($query) use ($request) {
                $search = $request->get('search');
                $query->where(function ($q) use ($search) {
                    $q->whereAny(['name', 'email', 'position'], 'like', "%{$search}%")
                        ->orWhereHas('division', function ($q2) use ($search) {
                            $q2->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->paginate($perPage);

        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }
    public function divisions(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $data = Division::query()
            ->when($request->has('search'), function ($query) use ($request) {
                $search = $request->get('search');
                $query->whereLike('name', "%{$search}%");
            })
            ->paginate($perPage);

        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }
    public function suppliers(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $data = Supplier::query()
            ->when($request->has('search'), function ($query) use ($request) {
                $search = $request->get('search');
                $query->whereLike('name', "%{$search}%");
            })
            ->paginate($perPage);

        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }
    public function categories(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $data = Category::query()
            ->when($request->has('search'), function ($query) use ($request) {
                $search = $request->get('search');
                $query->whereLike('name', "%{$search}%");
            })
            ->paginate($perPage);

        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }
    public function units(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $data = Unit::query()
            ->when($request->has('search'), function ($query) use ($request) {
                $search = $request->get('search');
                $query->whereLike('name', "%{$search}%");
            })
            ->paginate($perPage);

        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }

    public function items(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $data = Item::with(['category', 'supplier', 'unit'])
            ->when($request->has('search'), function ($query) use ($request) {
                $search = $request->get('search');
                $query->where(function ($q) use ($search) {
                    $q->whereAny(['name', 'item_code'], "%{$search}%")
                        ->orWhereHas('category', function ($q2) use ($search) {
                            $q2->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('supplier', function ($q2) use ($search) {
                            $q2->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->paginate($perPage);

        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }
    public function stockEntries(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $data = StockEntry::with(['item', 'supplier', 'user'])
            ->when($request->has('search'), function ($query) use ($request) {
                $search = $request->get('search');
                $query->where(function ($q) use ($search) {
                    $q->whereAny(['entry_number'], "%{$search}%")
                        ->orWhereHas('item', function ($q2) use ($search) {
                            $q2->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('supplier', function ($q2) use ($search) {
                            $q2->where('name', 'like', "%{$search}%");
                        })
                        ->orWhereHas('user', function ($q2) use ($search) {
                            $q2->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->paginate($perPage);

        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }
    public function itemRequests(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $user = Auth::user();

        $data = ItemRequest::with(['user', 'items.unit'])
            // Filter berdasarkan role
            ->when($user->role === 'User', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })
            // Filter pencarian
            ->when($request->has('search'), function ($query) use ($request) {
                $search = $request->get('search');
                $query->where(function ($q) use ($search) {
                    $q->where('request_number', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q2) use ($search) {
                            $q2->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->paginate($perPage);

        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }

    public function stockTakings(Request $request)
    {
        $perPage = $request->get('per_page', 10);
        $data = StockTaking::with(['details.item', 'user'])
            ->when($request->has('search'), function ($query) use ($request) {
                $search = $request->get('search');
                $query->where(function ($q) use ($search) {
                    $q->whereAny(['stock_taking_number'], "%{$search}%")
                        ->orWhereHas('user', function ($q2) use ($search) {
                            $q2->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->paginate($perPage);

        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }

    public function itemReport(Request $request)
    {

        $perPage = $request->get('per_page', 10);
        $data = Item::with(['category', 'supplier', 'unit'])
            ->when(
                $request->filled('category_id'),
                fn($q) =>
                $q->where('category_id', $request->category_id)
            )
            ->when(
                $request->filled('supplier_id'),
                fn($q) =>
                $q->where('supplier_id', $request->supplier_id)
            )

            ->paginate($perPage);

        return response()->json([
            'data' => $data->items(),
            'total' => $data->total(),
            'current_page' => $data->currentPage(),
            'per_page' => $data->perPage(),
        ]);
    }
}
