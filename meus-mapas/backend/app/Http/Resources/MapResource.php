<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\PointResource; // Assuming we might want this later

class MapResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Logic moved from Controller index transform
        $firstPoint = $this->points->first();

        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'is_curated' => $this->is_curated,
            'created_at' => $this->created_at,
            'authorization_token' => $this->authorization_token, // If needed public

            // Computed properties for frontend convenience
            'latitude' => $firstPoint ? $firstPoint->latitude : null,
            'longitude' => $firstPoint ? $firstPoint->longitude : null,

            // Relationships
            'points' => $this->whenLoaded('points'),
        ];
    }
}
