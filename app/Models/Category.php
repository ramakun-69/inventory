<?php

namespace App\Models;

use App\Traits\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasUuid, SoftDeletes;
    protected $guarded = ['id'];
    protected $keyType = 'string';
    public $incrementing = false;
}
