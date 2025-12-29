<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Http;
use App\Models\Map;
use App\Models\Point;
use App\Models\User;

class AiMapSeeder extends Seeder
{
    public function run(): void
    {
        $topics = [
            "Melhores Cafeterias para Trabalhar",
            "Lugares Românticos Escondidos",
            "Arte Urbana e Graffiti",
            "Comida de Rua Imperdível",
            "Parques para Yoga e Relaxamento"
        ];

        $user = User::first() ?? User::factory()->create();

        foreach ($topics as $topic) {
            $this->command->info("🤖 Pedindo para a IA gerar: $topic...");

            try {
                // Call our local Python AI Microservice
                $response = Http::post('http://aurora-maps-ai:8000/rag/generate-map', [
                    'topic' => $topic
                ]);

                if ($response->successful()) {
                    $data = $response->json();

                    if (!isset($data['title'])) {
                        $this->command->error("IA retornou formato inválido. Chaves recebidas: " . implode(", ", array_keys($data)));
                        $this->command->line("Raw: " . substr(json_encode($data), 0, 200));
                        continue;
                    }

                    // Create Map
                    $map = Map::create([
                        'title' => $data['title'],
                        'description' => $data['description'],
                        'user_id' => $user->id,
                        'is_public' => true
                    ]);

                    // Create Points
                    foreach ($data['points'] as $point) {
                        Point::create([
                            'map_id' => $map->id,
                            'title' => $point['title'],
                            'description' => $point['description'],
                            'latitude' => $point['latitude'],
                            'longitude' => $point['longitude'],
                            'category' => $point['category'] ?? 'general'
                        ]);
                    }

                    $this->command->info("✅ Mapa '{$data['title']}' criado com " . count($data['points']) . " pontos!");
                } else {
                    $this->command->error("Falha na API: " . $response->body());
                }
            } catch (\Exception $e) {
                $this->command->error("Erro de conexão: " . $e->getMessage());
            }
        }
    }
}
