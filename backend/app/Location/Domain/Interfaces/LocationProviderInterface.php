<?php

namespace App\Location\Domain\Interfaces;

use App\Location\Domain\DTOs\StandardLocationDTO;

interface LocationProviderInterface
{
    /**
     * Search for places based on a text query and location context.
     *
     * @param string $query
     * @param float $latitude
     * @param float $longitude
     * @param int $limit
     * @return StandardLocationDTO[]
     */
    public function search(string $query, float $latitude, float $longitude, int $limit = 10): array;

    /**
     * Find places nearby a specific location, filtering by category.
     *
     * @param string $category
     * @param float $latitude
     * @param float $longitude
     * @param int $radiusInMeters
     * @param int $limit
     * @return StandardLocationDTO[]
     */
    public function nearby(string $category, float $latitude, float $longitude, int $radiusInMeters = 1000, int $limit = 20): array;

    /**
     * Get the provider name (e.g., 'osm', 'here').
     *
     * @return string
     */
    public function getProviderName(): string;
}
