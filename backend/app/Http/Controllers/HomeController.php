<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Map;
use App\Models\User;

class HomeController extends Controller
{
    /**
     * Return a lightweight summary for the Home Page initial paint.
     * Avoids heavy queries like points or complex relationships.
     */
    public function summary()
    {
        // Cache these queries if high traffic
        $stats = [
            'total_maps' => Map::count(),
            'active_explorers' => User::count(),
            'featured_maps' => Map::where('is_curated', true)->select('id', 'name', 'category', 'points_count')->limit(4)->get(),
            'banner_url' => '/banner-aurora-optimized.webp', // Optimistic WebP
            'message' => 'Ready for liftoff 🚀'
        ];

        return response()->json($stats);
    }
}
