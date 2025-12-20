<?php

namespace App\Http\Controllers;

use App\Models\Point;
use App\Models\Map;
use Illuminate\Http\Request;

class PointController extends Controller
{
    public function store(Request $request, Map $map)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);

        $point = $map->points()->create($validated);

        return response()->json($point, 201);
    }

    public function update(Request $request, Point $point)
    {
        // IDOR Protection
        if ($request->user()->cannot('update', $point)) {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $point->update($validated);

        return response()->json($point);
    }

    public function destroy(Point $point)
    {
        // IDOR Protection
        if (request()->user()->cannot('delete', $point)) {
            abort(403, 'Unauthorized action.');
        }

        $point->delete();

        return response()->noContent();
    }

    public function destroyAll(Map $map)
    {
        $map->points()->delete();

        return response()->noContent();
    }
}
