<?php

namespace App\Location\Infrastructure\Providers;

use App\Location\Domain\DTOs\StandardLocationDTO;
use App\Location\Domain\Interfaces\LocationProviderInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeoapifyProvider implements LocationProviderInterface
{
    private const BASE_URL = 'https://api.geoapify.com/v2/places';
    private string $apiKey;

    public function __construct()
    {
        $this->apiKey = env('GEOAPIFY_API_KEY', '');
    }

    public function search(string $query, float $latitude, float $longitude, int $limit = 10): array
    {
        // Geoapify doesn't have a direct "free text search" on the Places API in the same way,
        // but uses categories or bias. For text search, we often use the Geocoding/Autocomplete API.
        // However, for this example, we'll try to map it to their Place API features or return empty
        // if strictly Place Search is required. Alternatively, use 'name' filter if supported.

        // Simulating search by filtering names if the API allows specific name headers or using autocomplete
        return [];
    }

    public function nearby(string $category, float $latitude, float $longitude, int $radiusInMeters = 1000, int $limit = 20): array
    {
        if (empty($this->apiKey)) {
            return [];
        }

        // Map categories to Geoapify types
        $categories = match (strtolower($category)) {
            'hospital' => 'healthcare.hospital',
            'restaurant' => 'catering.restaurant',
            'school' => 'education.school',
            'park' => 'leisure.park',
            'hotel' => 'accommodation.hotel',
            'supermarket' => 'commercial.supermarket',
            default => 'commercial',
        };

        try {
            $response = Http::get(self::BASE_URL, [
                'categories' => $categories,
                'filter' => "circle:{$longitude},{$latitude},{$radiusInMeters}",
                'limit' => $limit,
                'apiKey' => $this->apiKey
            ]);

            if ($response->failed()) {
                Log::error("Geoapify API Failed: " . $response->body());
                return [];
            }

            return $this->mapToDTOs($response->json()['features'] ?? []);

        } catch (\Exception $e) {
            Log::error("Geoapify Exception: " . $e->getMessage());
            return [];
        }
    }

    public function getProviderName(): string
    {
        return 'geoapify';
    }

    private function mapToDTOs(array $features): array
    {
        $dtos = [];
        foreach ($features as $feature) {
            $props = $feature['properties'] ?? [];
            $coords = $feature['geometry']['coordinates'] ?? [0, 0]; // GeoJSON is [lon, lat]

            $dtos[] = new StandardLocationDTO(
                name: $props['name'] ?? $props['street'] ?? 'Unknown',
                latitude: (float) $coords[1],
                longitude: (float) $coords[0],
                address: $props['formatted'] ?? null,
                category: $props['categories'][0] ?? 'unknown',
                metadata: $props,
                providerSource: $this->getProviderName()
            );
        }
        return $dtos;
    }
}
