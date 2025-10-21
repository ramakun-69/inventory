<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Support\Facades\File;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\SoftDeletes;

class Item extends Model
{
    use HasUuid, SoftDeletes;
    protected $guarded = ['id'];
    protected $keyType = 'string';
    public $incrementing = false;
    protected $appends = ['image_url'];
    protected $with = ['unit'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    public function stockEntryDetails()
    {
        return $this->hasMany(StockEntryDetail::class, 'item_id');
    }

    public function getImageUrlAttribute()
    {
        if ($this->image && File::exists(storage_path("app/public/" . $this->image))) {
            return url("storage/" . $this->image);
        }

        return asset('/assets/images/box.png');
    }
}
