<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Map;
use App\Models\Point;

class MegaSeeder extends Seeder
{
    public function run(): void
    {
        $datas = [
            [
                'name' => 'Rolê no ABC Paulista',
                'description' => 'Os melhores lugares de SBC, Santo André e Diadema com foco em inclusão.',
                'is_curated' => true,
                'category' => 'Lazer',
                'points' => [
                    [
                        'name' => 'Shopping Metrópole',
                        'latitude' => -23.6917,
                        'longitude' => -46.5511,
                        'category' => 'Compras',
                        'description' => 'Tradicional shopping com banheiros adaptados e corredores largos.',
                        'has_ramp' => true,
                        'is_pet_friendly' => true,
                        'wifi_free' => true
                    ],
                    [
                        'name' => 'Parque da Juventude',
                        'latitude' => -23.7122,
                        'longitude' => -46.5478,
                        'category' => 'Lazer',
                        'description' => 'Pista de skate famosa e áreas de convivência.',
                        'has_ramp' => true,
                        'wifi_free' => true
                    ],
                    [
                        'name' => 'Grand Plaza Shopping',
                        'latitude' => -23.6554,
                        'longitude' => -46.5332,
                        'category' => 'Compras',
                        'description' => 'Shopping amplo e plano, ideal para cadeirantes.',
                        'has_ramp' => true,
                        'is_pet_friendly' => true,
                        'wifi_free' => true
                    ],
                    [
                        'name' => 'Parque Celso Daniel',
                        'latitude' => -23.6548,
                        'longitude' => -46.5397,
                        'category' => 'Lazer',
                        'description' => 'Parque arborizado com trilhas acessíveis.',
                        'has_ramp' => true,
                        'is_pet_friendly' => true,
                        'is_sensory_friendly' => true
                    ],
                    [
                        'name' => 'Shopping Praça da Moça',
                        'latitude' => -23.6915,
                        'longitude' => -46.6233,
                        'category' => 'Compras',
                        'description' => 'Shopping moderno em Diadema.',
                        'has_ramp' => true,
                        'wifi_free' => true
                    ]
                ]
            ],
            [
                'name' => 'Cultura Inclusiva SP',
                'description' => 'Locais culturais preparados para receber todos.',
                'is_curated' => true,
                'category' => 'Cultura',
                'points' => [
                    [
                        'name' => 'Biblioteca Monteiro Lobato',
                        'latitude' => -23.5418, // Adjust lat/lon if needed, aiming for SP center approx
                        'longitude' => -46.6293,
                        'category' => 'Cultura',
                        'description' => 'Acervo em Braille e ambiente silencioso.',
                        'has_ramp' => true,
                        'has_braille' => true,
                        'is_sensory_friendly' => true,
                        'wifi_free' => true
                    ],
                    [
                        'name' => 'Pinacoteca de SP',
                        'latitude' => -23.5348,
                        'longitude' => -46.6340,
                        'category' => 'Cultura',
                        'description' => 'Referência em acessibilidade museológica.',
                        'has_ramp' => true,
                        'has_braille' => true,
                        'is_sensory_friendly' => true
                    ]
                ]
            ],
            [
                'name' => 'Rio de Janeiro Turístico',
                'description' => 'Cartões postais com acessibilidade.',
                'is_curated' => true,
                'category' => 'Turismo',
                'points' => [
                    [
                        'name' => 'Cristo Redentor',
                        'latitude' => -22.9519,
                        'longitude' => -43.2105,
                        'category' => 'Turismo',
                        'description' => 'Acesso via elevadores e escadas rolantes.',
                        'has_ramp' => true,
                        'wifi_free' => true
                    ],
                    [
                        'name' => 'Praia de Copacabana (Posto 4)',
                        'latitude' => -22.9711,
                        'longitude' => -43.1822,
                        'category' => 'Praia',
                        'description' => 'Calçadão plano e acessível.',
                        'has_ramp' => true,
                        'is_pet_friendly' => true
                    ],
                    [
                        'name' => 'Museu do Amanhã',
                        'latitude' => -22.8944,
                        'longitude' => -43.1793,
                        'category' => 'Cultura',
                        'description' => 'Totalmente acessível e interativo.',
                        'has_ramp' => true,
                        'has_braille' => true,
                        'is_sensory_friendly' => true,
                        'wifi_free' => true
                    ]
                ]
            ]
        ];

        foreach ($datas as $data) {
            $map = Map::firstOrCreate(
                ['name' => $data['name']],
                [
                    'description' => $data['description'],
                    'is_curated' => $data['is_curated'],
                    'category' => $data['category'],
                    'views' => rand(100, 5000)
                ]
            );

            // Update description if it exists but is different/empty (optional logic, but good for seed updates)
            if ($map->description !== $data['description']) {
                $map->update(['description' => $data['description']]);
            }

            foreach ($data['points'] as $pointData) {
                Point::updateOrCreate(
                    [
                        'map_id' => $map->id,
                        'name' => $pointData['name']
                    ],
                    [
                        'latitude' => $pointData['latitude'],
                        'longitude' => $pointData['longitude'],
                        'category' => $pointData['category'],
                        'description' => $pointData['description'] ?? null,
                        'has_ramp' => $pointData['has_ramp'] ?? false,
                        'is_pet_friendly' => $pointData['is_pet_friendly'] ?? false,
                        'has_braille' => $pointData['has_braille'] ?? false,
                        'is_sensory_friendly' => $pointData['is_sensory_friendly'] ?? false,
                        'wifi_free' => $pointData['wifi_free'] ?? false,
                    ]
                );
            }
        }
    }
}
