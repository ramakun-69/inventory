<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StockEntry extends Model
{
    use HasUuid;
    protected $guarded = ['id'];
    protected $keyType = 'string';
    public $incrementing = false;
    protected $with = ['item', 'supplier', 'user'];

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
