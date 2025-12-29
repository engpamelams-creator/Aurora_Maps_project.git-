<?php

namespace App\Location\Domain\ValueObjects;

use InvalidArgumentException;

class Coordinates
{
    public function __construct(
        public float $latitude,
        public float $longitude
    ) {
        $this->validate();
    }

    private function validate(): void
    {
        if ($this->latitude < -90 || $this->latitude > 90) {
            throw new InvalidArgumentException("Latitude must be between -90 and 90 degrees.");
        }
        if ($this->longitude < -180 || $this->longitude > 180) {
            throw new InvalidArgumentException("Longitude must be between -180 and 180 degrees.");
        }
    }

    public function __toString(): string
    {
        return "{$this->latitude},{$this->longitude}";
    }
}
