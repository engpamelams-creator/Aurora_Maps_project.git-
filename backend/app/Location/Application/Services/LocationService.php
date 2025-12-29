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
        // Priority Order: 1. OSM (Free), 2. Geoapify (Freemium)
        $this->providers = [
            $overpassProvider,
            $geoapifyProvider
            // Add other providers here (HereMaps, TomTom...)
        ];
    }

    /**
     * Search for places nearby with Fallback Strategy.
     *
     * @return StandardLocationDTO[]
     */
    public function nearby(string $category, float $lat, float $lng, int $radius = 1000): array
    {
        $cacheKey = "locations:nearby:{$category}:{$lat}:{$lng}:{$radius}";

        return Cache::remember($cacheKey, 60 * 60 * 24, function () use ($category, $lat, $lng, $radius) {
            foreach ($this->providers as $provider) {
                try {
                    $results = $provider->nearby($category, $lat, $lng, $radius);

                    if (!empty($results)) {
                        Log::info("LocationService: Found " . count($results) . " results via " . $provider->getProviderName());
                        return $results;
                    }
                } catch (\Exception $e) {
                    Log::warning("LocationService: Provider " . $provider->getProviderName() . " failed: " . $e->getMessage());
                    // Continue to next provider
                }
            }

            return []; // Nothing found after all providers
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
