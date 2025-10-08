<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class RequestItem extends Model
{
    use HasUuid;
    protected $guarded = ['id'];
    protected $keyType = 'string';
    public $incrementing = false;

    public function itemRequest()
    {
        return $this->belongsTo(ItemRequest::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }
   
}
