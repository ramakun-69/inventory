<?php

namespace App\Repositories\Inventory;

use Carbon\Carbon;
use App\Models\Item;
use App\Models\User;
use Ramsey\Uuid\Uuid;
use App\Models\Inventory;
use App\Models\StockEntry;
use App\Models\ItemRequest;
use App\Models\RequestItem;
use App\Models\StockTaking;
use App\Models\StockTakingDetail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Repositories\App\AppRepository;
use LaravelEasyRepository\Implementations\Eloquent;
use App\Repositories\SendNotification\SendNotificationRepository;

class InventoryRepositoryImplement extends Eloquent implements InventoryRepository
{

    /**
     * Model class to be used in this repository for the common methods inside Eloquent
     * Don't remove or change $this->model variable name
     * @property Model|mixed $model;
     */
    protected $appRepository, $sendNotificationRepository;

    public function __construct(AppRepository $appRepository, SendNotificationRepository $sendNotificationRepository)
    {
        $this->appRepository = $appRepository;
        $this->sendNotificationRepository = $sendNotificationRepository;
    }

    public function stockEntry($data)
    {
        DB::transaction(function () use ($data) {
            $oldEntry = !empty($data['id'])
                ? StockEntry::find($data['id'])
                : null;

            // Simpan atau update entry
            $entry = $this->appRepository->updateOrCreateOneModel(
                new StockEntry(),
                ['id' => $data['id'] ?? null],
                $data
            );
            Item::findOrFail($entry->item_id)->update([
                'supplier_id' => $data['supplier_id']
            ]);
            // Jika update → hitung selisih quantity
            if ($oldEntry) {
                // Jika item sama
                if ($oldEntry->item_id == $entry->item_id) {
                    $diff = $entry->quantity - $oldEntry->quantity;
                    if ($diff !== 0) {
                        Item::where('id', $entry->item_id)->increment('stock', $diff);
                    }
                } else {
                    // Item berubah → rollback stok lama, tambah stok baru
                    Item::where('id', $oldEntry->item_id)->decrement('stock', $oldEntry->quantity);
                    Item::where('id', $entry->item_id)->increment('stock', $entry->quantity);
                }
            } else {
                // Jika create baru
                Item::where('id', $entry->item_id)->increment('stock', $entry->quantity);
            }
        });
    }
    public function itemRequest($data)
    {
        DB::transaction(function () use ($data) {
            // 1️⃣ Simpan header ItemRequest
            $itemRequest = $this->appRepository->updateOrCreateOneModel(
                new ItemRequest(),
                ['id' => $data['id'] ?? null],
                [
                    'purpose' => $data['purpose'],
                    'user_id' => Auth::id(),
                    'request_date' => Carbon::now(),
                    'request_number' =>  $data['id'] ? ItemRequest::find($data['id'])->request_number : $this->generateRequestCode(),
                ]
            );

            // 2️⃣ Handle detail items
            $items = collect($data['items'] ?? [])
                ->filter(fn($i) => !empty($i['item_id']) && $i['quantity'] > 0)
                ->mapWithKeys(fn($i) => [
                    $i['item_id'] => ['quantity' => (int)$i['quantity']]
                ])
                ->toArray();
            // Upsert items (insert baru atau update quantity jika ada)
            $itemRequest->items()->sync($items);

            // 4️⃣ Kirim notifikasi (dispatch ke queue agar tidak blocking)
            $users = User::whereHas('roles', fn($q) => $q->whereIn('name', ['Admin', 'Warehouse']))->get();

            foreach ($users as $user) {
                dispatch(function () use ($user, $itemRequest) {
                    $this->sendNotification($user, [
                        'NAME' => $user?->name,
                        'REQUEST_NUMBER' => $itemRequest?->request_number,
                        'REQUEST_BY' => $itemRequest?->user?->name,
                        'REQUEST_DATE' => $itemRequest?->request_date,
                        'PURPOSE' => $itemRequest?->purpose,
                        'LIST_ITEMS' => $itemRequest->items->map(fn($ri, $key) => ($key + 1) . ". " . $ri->name . " (Qty: " . $ri->pivot->quantity . ")")->join("\n"),
                    ], 'item-request-notification.txt');
                });
            }
        });
    }


    public function deleteStockEntry($stockEntry)
    {
        DB::transaction(function () use ($stockEntry) {
            Item::where('id', $stockEntry->item_id)->decrement('stock', $stockEntry->quantity);
            $stockEntry->delete();
        });
    }

    public function confirmItemRequest($itemRequest, $status)
    {
        DB::transaction(function () use ($itemRequest, $status) {
            // Update status request
            $this->appRepository->updateOneModel($itemRequest, ['status' => $status]);

            // Jika disetujui, kurangi stok item
            if ($status === 'Approved') {
                foreach ($itemRequest->items as $item) {
                    Item::where('id', $item->id)->decrement('stock', $item->pivot->quantity);
                }
            }
            // Kirim notifikasi ke user yang request
            $this->sendNotification($itemRequest->user, [
                'NAME' => $itemRequest->user?->name,
                'REQUEST_NUMBER' => $itemRequest?->request_number,
                'REQUEST_BY' => $itemRequest?->user?->name,
                'REQUEST_DATE' => $itemRequest?->request_date,
                'PURPOSE' => $itemRequest?->purpose,
                'STATUS' => __($status),
                'LIST_ITEMS' => $itemRequest->items->map(fn($ri, $key) => ($key + 1) . ". " . $ri->name . " (Qty: " . $ri->pivot->quantity . ")")->join("\n"),
            ], 'item-request-confirmation.txt');
        });
    }

    public function stockTaking($data)
    {
        DB::transaction(function () use ($data) {
            $userId = Auth::id();

            // Simpan atau update StockTaking
            $entry = $this->appRepository->updateOrCreateOneModel(
                new StockTaking(),
                ['id' => $data['id'] ?? null],
                [
                    'stock_taking_number' =>  $data['id'] ? StockTaking::find($data['id'])->stock_taking_number : $this->generateStockTakingNumber(),
                    'user_id' => $userId,
                    'date' => Carbon::now(),
                ]
            );

            $stockTakingId = $entry->id;

            $itemsFromRequest = collect($data['items'] ?? []);

            // Ambil semua detail lama terkait StockTaking
            $existingDetails = StockTakingDetail::where('stock_taking_id', $stockTakingId)
                ->get()
                ->keyBy('item_id');

            $upsertData = [];

            foreach ($itemsFromRequest as $item) {
                $systemStock = $this->getSystemStock($item['item_id']); // Fungsi ambil stok sistem

                $upsertData[] = [
                    'id' => $existingDetails[$item['item_id']]->id ?? Uuid::uuid4()->toString(), // gunakan UUID jika baru
                    'stock_taking_id' => $stockTakingId,
                    'item_id' => $item['item_id'],
                    'system_stock' => $systemStock,
                    'actual_stock' => (int) $item['actual_stock'],
                    'difference' => (int) $item['actual_stock'] - $systemStock,
                    'updated_at' => now(),
                    'created_at' => $existingDetails[$item['item_id']]->created_at ?? now(),
                ];
            }

            // Upsert (insert atau update) data details
            StockTakingDetail::upsert(
                $upsertData,
                ['id'], // unique key
                ['system_stock', 'actual_stock', 'difference', 'updated_at'] // fields yang diupdate
            );

            // Hapus detail yang tidak ada di request (optional, bersihkan DB)
            $requestItemIds = $itemsFromRequest->pluck('item_id')->all();
            StockTakingDetail::where('stock_taking_id', $stockTakingId)
                ->whereNotIn('item_id', $requestItemIds)
                ->delete();
        });
    }

    private function generateRequestCode()
    {
        $today = Carbon::now()->format('d/m/Y');
        $latestEntry = ItemRequest::orderBy('created_at', 'desc')->first();
        if ($latestEntry) {
            // Ambil nomor terakhir setelah tanda "-"
            $lastCode = $latestEntry->request_number;
            $lastNumber = (int) substr($lastCode, strrpos($lastCode, '-') + 1);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }
        return "{$today}-{$newNumber}";
    }
    private function generateStockTakingNumber()
    {
        $today = Carbon::now()->format('d/m/Y');
        $latestEntry = StockTaking::orderBy('created_at', 'desc')->first();
        if ($latestEntry) {
            // Ambil nomor terakhir setelah tanda "-"
            $lastCode = $latestEntry->request_number;
            $lastNumber = (int) substr($lastCode, strrpos($lastCode, '-') + 1);
            $newNumber = str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
        } else {
            $newNumber = '0001';
        }
        return "{$today}-{$newNumber}";
    }

    private  function sendNotification($user, $data, $template)
    {
        $this->sendNotificationRepository->sendWhatsappMessage(
            $user->phone,
            $data,
            $template
        );
    }

    private function getSystemStock($itemId)
    {
        $item = Item::find($itemId);
        return $item->stock ?? 0;
    }
}
