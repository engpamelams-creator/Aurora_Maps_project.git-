<?php

namespace App\Http\Controllers;

use App\Http\Requests\Map\StoreMapRequest;
use App\Http\Resources\MapResource;
use App\Models\Map;
use App\Services\MapService;
use Illuminate\Http\Request;

class MapController extends Controller
{
    public function __construct(
        protected MapService $mapService
    ) {
    }

    public function index()
    {
        $maps = $this->mapService->getAllMaps();
        return MapResource::collection($maps);
    }

    public function analyticsSearch(Request $request)
    {
        $this->mapService->logAnalytics($request->all(), $request->ip());
        return response()->json(['status' => 'logged']);
    }

    public function store(StoreMapRequest $request)
    {
        // Validation handled by StoreMapRequest
        $map = $this->mapService->createMap($request->validated());

        return new MapResource($map);
    }

    public function show($id)
    {
        try {
            $map = $this->mapService->findMap($id);
            return new MapResource($map);
        } catch (\Throwable $e) {
            // Mock Data for Detail View (preserving legacy fallback for demo)
            return response()->json([
                'id' => $id,
                'name' => 'Viagem à Aurora Boreal 🌌 (Demo)',
                'points' => [
                    ['id' => 1, 'name' => 'Ponto de Observação 1', 'latitude' => -23.5505, 'longitude' => -46.6333],
                    ['id' => 2, 'name' => 'Base Lunar Alpha', 'latitude' => -23.5555, 'longitude' => -46.6355],
                    ['id' => 3, 'name' => 'Portal Estelar', 'latitude' => -23.5605, 'longitude' => -46.6400],
                ]
            ], 200);
        }
    }
}
