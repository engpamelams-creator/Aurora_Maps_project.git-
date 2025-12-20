<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Capsule extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'message',
        'image_url',
        'latitude',
        'longitude',
        'is_collected',
        'collected_by',
        'collected_at'
    ];

    protected $casts = [
        'latitude' => 'float',
        'longitude' => 'float',
        'is_collected' => 'boolean',
        'collected_at' => 'datetime',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function collector()
    {
        return $this->belongsTo(User::class, 'collected_by');
    }
}
