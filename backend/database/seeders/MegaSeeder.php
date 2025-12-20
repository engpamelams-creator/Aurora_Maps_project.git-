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
            // --- ABC PAULISTA ---
            [
                'name' => 'Rolê no ABC Paulista',
                'description' => 'Os melhores lugares de SBC, Santo André e Diadema com foco em inclusão.',
                'is_curated' => true,
                'category' => 'Lazer',
                'points' => [
                    [
                        'name' => 'Shopping Metrópole (SBC)',
                        'latitude' => -23.6917,
                        'longitude' => -46.5511,
                        'category' => 'Compras',
                        'description' => 'Tradicional shopping com banheiros adaptados e corredores largos.',
                        'has_ramp' => true,
                        'is_pet_friendly' => true,
                        'wifi_free' => true
                    ],
                    [
                        'name' => 'Parque da Juventude (SBC)',
                        'latitude' => -23.7122,
                        'longitude' => -46.5478,
                        'category' => 'Lazer',
                        'description' => 'Pista de skate famosa e áreas de convivência.',
                        'has_ramp' => true,
                        'wifi_free' => true
                    ],
                    [
                        'name' => 'Grand Plaza Shopping (Santo André)',
                        'latitude' => -23.6554,
                        'longitude' => -46.5332,
                        'category' => 'Compras',
                        'description' => 'Shopping amplo e plano, ideal para cadeirantes.',
                        'has_ramp' => true,
                        'is_pet_friendly' => true,
                        'wifi_free' => true
                    ],
                    [
                        'name' => 'Parque Celso Daniel (Santo André)',
                        'latitude' => -23.6548,
                        'longitude' => -46.5397,
                        'category' => 'Lazer',
                        'description' => 'Parque arborizado com trilhas acessíveis.',
                        'has_ramp' => true,
                        'is_pet_friendly' => true,
                        'is_sensory_friendly' => true
                    ],
                    [
                        'name' => 'Shopping Praça da Moça (Diadema)',
                        'latitude' => -23.6915,
                        'longitude' => -46.6233,
                        'category' => 'Compras',
                        'description' => 'Shopping moderno em Diadema.',
                        'has_ramp' => true,
                        'wifi_free' => true
                    ]
                ]
            ],

            // --- SAÚDE & BEM-ESTAR ---
            [
                'name' => 'Saúde Acessível SP',
                'description' => 'Principais hospitais e centros de referência em São Paulo e Região.',
                'is_curated' => true,
                'category' => 'Saúde',
                'points' => [
                    [
                        'name' => 'Hospital Israelita Albert Einstein',
                        'latitude' => -23.5999,
                        'longitude' => -46.7153,
                        'category' => 'Saúde',
                        'description' => 'Referência mundial, totalmente acessível.',
                        'has_ramp' => true,
                        'has_braille' => true,
                        'wifi_free' => true
                    ],
                    [
                        'name' => 'Hospital Sírio-Libanês',
                        'latitude' => -23.5574,
                        'longitude' => -46.6545,
                        'category' => 'Saúde',
                        'description' => 'Excelência em atendimento e acessibilidade.',
                        'has_ramp' => true,
                        'is_sensory_friendly' => true
                    ],
                    [
                        'name' => 'Hospital Brasil (Santo André)',
                        'latitude' => -23.6582,
                        'longitude' => -46.5350,
                        'category' => 'Saúde',
                        'description' => 'Grande estrutura no ABC.',
                        'has_ramp' => true
                    ]
                ]
            ],

            // --- LITORAL ---
            [
                'name' => 'Litoral Acessível (Santos e PG)',
                'description' => 'Praias e lazer na baixada santista para todos.',
                'is_curated' => true,
                'category' => 'Turismo',
                'points' => [
                    [
                        'name' => 'Aquário de Santos',
                        'latitude' => -23.9878,
                        'longitude' => -46.3120,
                        'category' => 'Lazer',
                        'description' => 'O mais antigo do Brasil, acessível e educativo.',
                        'has_ramp' => true,
                        'is_sensory_friendly' => true,
                        'wifi_free' => true
                    ],
                    [
                        'name' => 'Jardim da Orla (Santos)',
                        'latitude' => -23.9745,
                        'longitude' => -46.3213,
                        'category' => 'Lazer',
                        'description' => 'Maior jardim de orla do mundo, plano e lindo.',
                        'has_ramp' => true,
                        'is_pet_friendly' => true
                    ],
                    [
                        'name' => 'Litoral Plaza Shopping (Praia Grande)',
                        'latitude' => -23.9934,
                        'longitude' => -46.4182,
                        'category' => 'Compras',
                        'description' => 'Shopping térreo gigante, perfeito para mobilidade.',
                        'has_ramp' => true,
                        'is_pet_friendly' => true,
                        'wifi_free' => true
                    ]
                ]
            ],

            // --- CRIANÇAS E PETS ---
            [
                'name' => 'Diversão Kids e Pets',
                'description' => 'Lugares para levar a família toda, inclusive os de 4 patas.',
                'is_curated' => true,
                'category' => 'Lazer',
                'points' => [
                    [
                        'name' => 'Cidade da Criança (SBC)',
                        'latitude' => -23.6934,
                        'longitude' => -46.5567,
                        'category' => 'Lazer',
                        'description' => 'Parque temático clássico, nostalgia pura.',
                        'has_ramp' => true,
                        'is_sensory_friendly' => false
                    ],
                    [
                        'name' => 'Parque Villa-Lobos (SP)',
                        'latitude' => -23.5475,
                        'longitude' => -46.7226,
                        'category' => 'Lazer',
                        'description' => 'Plano, com aluguel de bikes adaptadas e área pet gigante.',
                        'has_ramp' => true,
                        'is_pet_friendly' => true,
                        'wifi_free' => true
                    ],
                    [
                        'name' => 'Catavento Cultural (SP)',
                        'latitude' => -23.5441,
                        'longitude' => -46.6277,
                        'category' => 'Cultura',
                        'description' => 'Museu de ciências interativo incrível para crianças.',
                        'has_ramp' => true,
                        'has_braille' => true
                    ]
                ]
            ],

            // --- MERCADOS E COMPRAS ---
            [
                'name' => 'Mercados e Sabores',
                'description' => 'Gastronomia e compras tradicionais.',
                'is_curated' => true,
                'category' => 'Gastronomia',
                'points' => [
                    [
                        'name' => 'Mercado Municipal de SP (Mercadão)',
                        'latitude' => -23.5419,
                        'longitude' => -46.6295,
                        'category' => 'Gastronomia',
                        'description' => 'O famoso sanduíche de mortadela. Possui elevadores.',
                        'has_ramp' => true,
                        'wifi_free' => true
                    ],
                    [
                        'name' => 'Mercado Municipal de Santos',
                        'latitude' => -23.9366,
                        'longitude' => -46.3268,
                        'category' => 'Gastronomia',
                        'description' => 'Recentemente revitalizado, muito charmoso.',
                        'has_ramp' => true
                    ],
                    [
                        'name' => 'Eataly SP',
                        'latitude' => -23.5866,
                        'longitude' => -46.6818,
                        'category' => 'Gastronomia',
                        'description' => 'Mercado italiano de luxo, acessibilidade total.',
                        'has_ramp' => true,
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

            // Update description/category if needed
            $map->update([
                'description' => $data['description'],
                'category' => $data['category']
            ]);

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
