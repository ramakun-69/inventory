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
    protected $with = ['details', 'user'];

    public function details()
    {
        return $this->hasMany(StockEntryDetail::class);
    }
   
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
