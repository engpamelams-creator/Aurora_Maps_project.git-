<?php

namespace App\Location\Infrastructure\Providers;

use App\Location\Domain\DTOs\StandardLocationDTO;
use App\Location\Domain\Interfaces\LocationProviderInterface;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OverpassProvider implements LocationProviderInterface
{
    private const BASE_URL = 'https://overpass-api.de/api/interpreter';

    public function search(string $query, float $latitude, float $longitude, int $limit = 10): array
    {
        // Overpass doesn't have a direct "text search" like Google Places.
        // We use a combination of 'name' regex around the location.
        // This is a simplified query; usually Overpass is better for categories.
        $radius = 5000; // 5km search for text
        $ql = "[out:json][timeout:25];
            (
              node[\"name\"~\"{$query}\",i](around:{$radius},{$latitude},{$longitude});
              way[\"name\"~\"{$query}\",i](around:{$radius},{$latitude},{$longitude});
              relation[\"name\"~\"{$query}\",i](around:{$radius},{$latitude},{$longitude});
            );
            out center {$limit};";

        return $this->executeQuery($ql);
    }

    public function nearby(string $category, float $latitude, float $longitude, int $radiusInMeters = 1000, int $limit = 20): array
    {
        // Map common categories to OSM tags
        $osmTag = match (strtolower($category)) {
            'hospital' => 'amenity=hospital',
            'restaurant' => 'amenity=restaurant',
            'school' => 'amenity=school',
            'pharmacy' => 'amenity=pharmacy',
            'park' => 'leisure=park',
            'hotel' => 'tourism=hotel',
            'museum' => 'tourism=museum',
            default => 'amenity', // Fallback
        };

        $ql = "[out:json][timeout:25];
            (
              node[{$osmTag}](around:{$radiusInMeters},{$latitude},{$longitude});
              way[{$osmTag}](around:{$radiusInMeters},{$latitude},{$longitude});
            );
            out center {$limit};";

        return $this->executeQuery($ql);
    }

    public function getProviderName(): string
    {
        return 'osm_overpass';
    }

    private function executeQuery(string $ql): array
    {
        try {
            $response = Http::asForm()->post(self::BASE_URL, [
                'data' => $ql
            ]);

            if ($response->failed()) {
                Log::error("Overpass API Failed: " . $response->body());
                return [];
            }

            $data = $response->json();
            return $this->mapToDTOs($data['elements'] ?? []);

        } catch (\Exception $e) {
            Log::error("Overpass Exception: " . $e->getMessage());
            return [];
        }
    }

    private function mapToDTOs(array $elements): array
    {
        $dtos = [];
        foreach ($elements as $element) {
            $lat = $element['lat'] ?? $element['center']['lat'] ?? null;
            $lon = $element['lon'] ?? $element['center']['lon'] ?? null;

            if (!$lat || !$lon)
                continue;

            $tags = $element['tags'] ?? [];
            $name = $tags['name'] ?? 'Unknown Place';

            // Try to deduce category/address
            $category = $tags['amenity'] ?? $tags['leisure'] ?? $tags['tourism'] ?? $tags['shop'] ?? 'unknown';

            // Construct basic address if available
            $addressParts = [];
            if (isset($tags['addr:street']))
                $addressParts[] = $tags['addr:street'];
            if (isset($tags['addr:housenumber']))
                $addressParts[] = $tags['addr:housenumber'];
            if (isset($tags['addr:city']))
                $addressParts[] = $tags['addr:city'];
            $address = implode(', ', $addressParts);

            $dtos[] = new StandardLocationDTO(
                name: $name,
                latitude: (float) $lat,
                longitude: (float) $lon,
                address: $address ?: null,
                category: $category,
                metadata: $tags,
                providerSource: $this->getProviderName()
            );
        }
        return $dtos;
    }
}
