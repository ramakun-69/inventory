<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class StockTakingDetail extends Model
{
    use HasUuid;

    protected $guarded = ['id'];
    protected $keyType = 'string';
    public $incrementing = false;
    protected $with = ['item'];
    public function stockTaking()
    {
        return $this->belongsTo(StockTaking::class);
    }
    public function item()
    {
        return $this->belongsTo(Item::class);
    }
}
