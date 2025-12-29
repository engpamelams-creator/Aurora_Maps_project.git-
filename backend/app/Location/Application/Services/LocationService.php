<?php

namespace App\Location\Application\Services;

use App\Location\Domain\Interfaces\LocationProviderInterface;
use App\Location\Domain\DTOs\StandardLocationDTO;
use App\Location\Infrastructure\Providers\OverpassProvider;
use App\Location\Infrastructure\Providers\GeoapifyProvider;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class LocationService
{
    /** @var LocationProviderInterface[] */
    private array $providers;

    public function __construct(
        OverpassProvider $overpassProvider,
        GeoapifyProvider $geoapifyProvider
    ) {
        // [ARCHITECTURAL DECISION]
        // We prioritize OpenStreetMap (Overpass) because it's completely free and community-driven.
        // Geoapify is our "safety net" - it costs money per request, so we only use it if OSM fails.
        // This keeps our operational costs near zero ($0) for 90% of traffic. - Pamela
        $this->providers = [
            $overpassProvider,
            $geoapifyProvider
            // TODO: In the future, maybe add Google Maps API here only for premium users?
        ];
    }

    /**
     * Finds nearby places with an aggressive caching strategy.
     * We don't need real-time precision for "Tourist Spots", so 24h cache is acceptable.
     */
    public function nearby(string $category, float $lat, float $lng, int $radius = 1000): array
    {
        // Cache key includes all unique parameters to prevent collision
        $cacheKey = "locations:nearby:{$category}:{$lat}:{$lng}:{$radius}";

        return Cache::remember($cacheKey, 60 * 60 * 24, function () use ($category, $lat, $lng, $radius) {
            foreach ($this->providers as $provider) {
                try {
                    $results = $provider->nearby($category, $lat, $lng, $radius);

                    if (!empty($results)) {
                        Log::info("LocationService: Success via " . $provider->getProviderName());
                        return $results;
                    }
                } catch (\Exception $e) {
                    // Failing silently on one provider is expected behavior, we just try the next one.
                    // Only log as warning to monitor if a specific provider is consistently down.
                    Log::warning("LocationService provider failure: " . $provider->getProviderName() . " - " . $e->getMessage());
                }
            }

            // FIXME: If all providers fail, we return empty array. 
            // Should we return a cached fallback or a generic error? 
            // For now, empty is safer than crashing the frontend.
            return [];
        });
    }

    /**
     * Text Search with Fallback.
     */
    public function search(string $query, float $lat, float $lng): array
    {
        $cacheKey = "locations:search:" . md5($query . $lat . $lng);

        return Cache::remember($cacheKey, 60 * 60 * 24, function () use ($query, $lat, $lng) {
            foreach ($this->providers as $provider) {
                try {
                    $results = $provider->search($query, $lat, $lng);

                    if (!empty($results)) {
                        return $results;
                    }
                } catch (\Exception $e) {
                    Log::warning("LocationService Search Failed: " . $provider->getProviderName());
                }
            }
            return [];
        });
    }
}
