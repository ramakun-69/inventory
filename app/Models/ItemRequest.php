<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;

class ItemRequest extends Model
{
    use HasUuid;
    protected $table = 'requests';
    protected $guarded = ['id'];
    protected $keyType = 'string';
    public $incrementing = false;
    protected $with = ['items'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->belongsToMany(Item::class, 'request_items', 'request_id', 'item_id')
            ->withPivot('quantity')
            ->withTimestamps();
    }
}
