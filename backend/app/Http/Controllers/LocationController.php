<?php

namespace App\Http\Controllers;

use App\Location\Application\Services\LocationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LocationController extends Controller
{
    private LocationService $locationService;

    public function __construct(LocationService $locationService)
    {
        $this->locationService = $locationService;
    }

    public function nearby(Request $request): JsonResponse
    {
        $request->validate([
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
            'category' => 'required|string',
            'radius' => 'integer|min:100|max:10000'
        ]);

        $results = $this->locationService->nearby(
            $request->input('category'),
            (float) $request->input('lat'),
            (float) $request->input('lng'),
            (int) $request->input('radius', 1000)
        );

        return response()->json([
            'data' => array_map(fn($dto) => $dto->toArray(), $results)
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $request->validate([
            'q' => 'required|string|min:3',
            'lat' => 'required|numeric',
            'lng' => 'required|numeric',
        ]);

        $results = $this->locationService->search(
            $request->input('q'),
            (float) $request->input('lat'),
            (float) $request->input('lng')
        );

        return response()->json([
            'data' => array_map(fn($dto) => $dto->toArray(), $results)
        ]);
    }
}
