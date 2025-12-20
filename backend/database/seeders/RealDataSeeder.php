<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RealDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Praias & Litoral
        $map = \App\Models\Map::create([
            'name' => 'Praias Imperdíveis do Brasil 🏖️',
            'is_curated' => true,
            'is_public' => true,
            'category' => 'Praias',
            'views' => 1250,
        ]);

        $map->points()->createMany([
            ['name' => 'Copacabana (RJ)', 'latitude' => -22.9711, 'longitude' => -43.1822],
            ['name' => 'Praia do Forte (BA)', 'latitude' => -12.5794, 'longitude' => -38.0031],
            ['name' => 'Praia dos Carneiros (PE)', 'latitude' => -8.7067, 'longitude' => -35.0742],
            ['name' => 'Jericoacoara (CE)', 'latitude' => -2.7963, 'longitude' => -40.5140],
            ['name' => 'Praia de Pipa (RN)', 'latitude' => -6.2238, 'longitude' => -35.0456],
        ]);

        // 2. Rios & Cachoeiras (Aventura)
        $map2 = \App\Models\Map::create([
            'name' => 'Rios e Cachoeiras para Aventura 💦',
            'is_curated' => true,
            'is_public' => true,
            'category' => 'Aventura',
            'views' => 890,
        ]);

        $map2->points()->createMany([
            ['name' => 'Cachoeira da Fumaça (Chapada)', 'latitude' => -12.6026, 'longitude' => -41.4552],
            ['name' => 'Rio Formoso (Bonito)', 'latitude' => -21.1565, 'longitude' => -56.4950],
            ['name' => 'Cachoeira do Tabuleiro (MG)', 'latitude' => -19.0664, 'longitude' => -43.5133],
            ['name' => 'Cachoeira Santa Bárbara (GO)', 'latitude' => -13.5857, 'longitude' => -47.4566],
        ]);

        // 3. Mercados & Feiras
        $map3 = \App\Models\Map::create([
            'name' => 'Melhores Mercados e Feiras 🛒',
            'is_curated' => true,
            'is_public' => true,
            'category' => 'Compras',
            'views' => 3100,
        ]);

        $map3->points()->createMany([
            ['name' => 'Mercadão de SP', 'latitude' => -23.5422, 'longitude' => -46.6292],
            ['name' => 'Feira da Liberdade', 'latitude' => -23.5592, 'longitude' => -46.6341],
            ['name' => 'Mercado Modelo (Salvador)', 'latitude' => -12.9730, 'longitude' => -38.5133],
            ['name' => 'Ver-o-Peso (Belém)', 'latitude' => -1.4536, 'longitude' => -48.5064],
        ]);

        // 4. Gastronomia Italiana SP
        $map4 = \App\Models\Map::create([
            'name' => 'Gastronomia Italiana em SP 🍝',
            'is_curated' => true,
            'is_public' => true,
            'category' => 'Gastronomia',
            'views' => 540,
        ]);

        $map4->points()->createMany([
            ['name' => 'Famiglia Mancini', 'latitude' => -23.5539, 'longitude' => -46.6508],
            ['name' => 'Eataly SP', 'latitude' => -23.5866, 'longitude' => -46.6817],
            ['name' => 'Jardim de Napoli', 'latitude' => -23.5398, 'longitude' => -46.6542],
        ]);

        // 5. Pontos Turísticos
        $map5 = \App\Models\Map::create([
            'name' => 'Pontos Turísticos Clássicos 🌆',
            'is_curated' => true,
            'is_public' => true,
            'category' => 'Turismo',
            'views' => 2000,
        ]);

        $map5->points()->createMany([
            ['name' => 'Avenida Paulista', 'latitude' => -23.5632, 'longitude' => -46.6543],
            ['name' => 'Cristo Redentor', 'latitude' => -22.9519, 'longitude' => -43.2105],
            ['name' => 'MASP', 'latitude' => -23.5614, 'longitude' => -46.6559],
        ]);
    }
}
