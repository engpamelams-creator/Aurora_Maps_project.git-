<?php

namespace App\Models;

use Illuminate\Database\Eloquent\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecurityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'ip_address',
        'user_agent',
        'endpoint',
        'payload',
        'detector_type',
    ];

    protected $casts = [
        'payload' => 'array',
    ];
}
