<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Point extends Model
{
    protected $fillable = [
        'map_id',
        'name',
        'latitude',
        'longitude',
        'category',
        'description',
        'has_ramp',
        'is_pet_friendly',
        'has_braille',
        'is_sensory_friendly',
        'wifi_free'
    ];

    public function map()
    {
        return $this->belongsTo(Map::class);
    }
}
