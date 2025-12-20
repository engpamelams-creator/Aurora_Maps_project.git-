<?php

namespace App\Http\Controllers;

use App\Models\Capsule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CapsuleController extends Controller
{
    /**
     * Store a newly created capsule in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'nullable|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'image_url' => 'nullable|string'
        ]);

        $capsule = Auth::user()->createdCapsules()->create($validated);

        return response()->json($capsule, 201);
    }

    /**
     * Display a listing of uncollected capsules near the user.
     * Uses Haversine formula for distance calculation.
     */
    public function index(Request $request)
    {
        $lat = $request->query('lat');
        $lng = $request->query('lng');
        $radius = 5000; // Search within 5km

        if (!$lat || !$lng) {
            return response()->json(['error' => 'Latitude and Longitude required'], 400);
        }

        // Haversine Formula: 6371 * acos(...)
        $capsules = Capsule::select('*')
            ->selectRaw(
                '(6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance',
                [$lat, $lng, $lat]
            )
            ->where('is_collected', false)
            ->having('distance', '<', $radius / 1000) // Convert meters to km
            ->orderBy('distance')
            ->limit(50)
            ->get();

        return response()->json($capsules);
    }

    /**
     * Attempt to collect a capsule.
     */
    public function collect(Request $request, Capsule $capsule)
    {
        $userLat = $request->input('lat');
        $userLng = $request->input('lng');

        if (!$userLat || !$userLng) {
            return response()->json(['error' => 'Your location is required'], 400);
        }

        if ($capsule->is_collected) {
            return response()->json(['error' => 'Capsule already collected!'], 409);
        }

        // Calculate distance (simplified for short range)
        $earthRadius = 6371000; // meters
        $dLat = deg2rad($capsule->latitude - $userLat);
        $dLon = deg2rad($capsule->longitude - $userLng);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($userLat)) * cos(deg2rad($capsule->latitude)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        $distance = $earthRadius * $c;

        if ($distance > 20) { // 20 meters tolerance
            return response()->json([
                'error' => 'Too far away!',
                'distance' => round($distance, 2) . 'm'
            ], 403);
        }

        // Unlock Capsule
        $capsule->update([
            'is_collected' => true,
            'collected_by' => Auth::id(),
            'collected_at' => now()
        ]);

        return response()->json([
            'message' => 'Capsule Collected!',
            'item' => $capsule,
            'xp_earned' => 100 // Gamification stub
        ]);
    }
}
