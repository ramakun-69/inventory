<?php 
namespace App\Traits;
use Illuminate\Support\Str;


trait HasUuid
{
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = (string) Str::orderedUuid();
        });
    }

    /**
     * Generate UUID before inserting
     */
    public function insertGetId(array $values, $sequence = null)
    {
        if (!isset($values['id'])) {
            $values['id'] = (string) Str::orderedUuid();
        }
        return parent::insertGetId($values, $sequence);
    }
}