<?php

namespace App\Location\Domain\DTOs;

class StandardLocationDTO
{
    public function __construct(
        public string $name,
        public float $latitude,
        public float $longitude,
        public ?string $address = null,
        public ?string $category = null,
        public array $metadata = [], // Stores raw provider data or extra info like phone, url
        public string $providerSource = 'unknown'
    ) {
    }

    public function toArray(): array
    {
        return [
            'name' => $this->name,
            'location' => [
                'lat' => $this->latitude,
                'lng' => $this->longitude,
            ],
            'address' => $this->address,
            'category' => $this->category,
            'metadata' => $this->metadata,
            'source' => $this->providerSource,
        ];
    }
}
