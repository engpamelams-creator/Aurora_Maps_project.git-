<?php

namespace App\Services;

use App\Models\Map;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Log;

class MapService
{
    /**
     * Retrieve all maps ordered by curation and creation date.
     *
     * @return Collection
     */
    public function getAllMaps(): Collection
    {
        return Map::with('points')
            ->orderBy('is_curated', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Create a new map for a user.
     *
     * @param array $data
     * @param User|null $user
     * @return Map
     */
    public function createMap(array $data): Map
    {
        // Business logic can be expanded here (e.g., checking user limits)
        return Map::create($data);
    }

    /**
     * Find a map by ID or throw exception.
     *
     * @param int|string $id
     * @return Map
     */
    public function findMap($id): Map
    {
        return Map::with('points')->findOrFail($id);
    }

    /**
     * Log analytics search data.
     *
     * @param array $data
     * @param string|null $ip
     * @return void
     */
    public function logAnalytics(array $data, ?string $ip): void
    {
        Log::channel('daily')->info('SEARCH_ANALYTICS', [
            'query' => $data['query'] ?? null,
            'timestamp' => now(),
            'ip' => $ip
        ]);
    }
}
