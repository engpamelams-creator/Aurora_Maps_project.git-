<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Map extends Model
{
    protected $fillable = ['name', 'description', 'is_curated', 'is_public', 'category', 'views'];

    public function points()
    {
        return $this->hasMany(Point::class);
    }
}
