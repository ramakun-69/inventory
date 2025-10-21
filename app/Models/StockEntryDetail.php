<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class StockEntryDetail extends Model
{
    use HasUuid;

    protected $guarded = ['id'];
    protected $keyType = 'string';
    public $incrementing = false;
    public $with = ['item'];
    public function entry()
    {
        return $this->belongsTo(StockEntry::class, 'stock_entry_id');
    }

    public function item()
    {
        return $this->belongsTo(Item::class, 'item_id');
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }
}
