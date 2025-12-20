<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class RichContentSeeder extends Seeder
{
    public function run()
    {
        // Ensure we have a user
        $user = User::first() ?? User::factory()->create();

        $posts = [
            // Restaurante
            [
                'content' => 'Jantar incrível no Le Bistrot! A vista da torre é de tirar o fôlego e o vinho é perfeito. Recomendo para casais! 🍷🍽️ #Gastronomia #Rio',
                'location_name' => 'Le Bistrot, Santa Teresa',
                'latitude' => -22.9134,
                'longitude' => -43.1861,
                'media_url' => 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?auto=format&fit=crop&q=80',
                'likes_count' => 128,
            ],
            // Parque
            [
                'content' => 'Dia de piquenique no Parque Lage. A natureza aqui recarrega qualquer energia. Ótimo para ler um livro. 🌳🍃 #Natureza #Relax',
                'location_name' => 'Parque Lage, RJ',
                'latitude' => -22.9596,
                'longitude' => -43.2147,
                'media_url' => 'https://images.unsplash.com/photo-1596395819057-d37f374e2d36?auto=format&fit=crop&q=80',
                'likes_count' => 845,
            ],
            // Pet Friendly
            [
                'content' => 'Descobri um novo Café Pet Friendly em Copacabana! O Rex adorou os biscoitos de cortesia. 🐶☕ #PetFriendly #DogLovers',
                'location_name' => 'Copa Dogs Café',
                'latitude' => -22.9698,
                'longitude' => -43.1869,
                'media_url' => 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80',
                'likes_count' => 210,
            ],
            // Hospital/Saúde (Utility)
            [
                'content' => 'Atenção pessoal: O Hospital Copa Star está com atendimento de emergência super rápido hoje. Bom saber para quem precisa. 🏥🚑 #Saude #Utility',
                'location_name' => 'Hospital Copa Star',
                'latitude' => -22.9672,
                'longitude' => -43.1901,
                'media_url' => 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80',
                'likes_count' => 56,
            ],
            // Evento
            [
                'content' => 'Show de Jazz ao vivo começando agora na Lapa! A vibe está surreal. Venham! 🎷🎶 #Cultura #Lapa',
                'location_name' => 'Arcos da Lapa',
                'latitude' => -22.9129,
                'longitude' => -43.1796,
                'media_url' => 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80',
                'likes_count' => 432,
            ]
        ];

        foreach ($posts as $data) {
            Post::create([
                'user_id' => $user->id,
                'content' => $data['content'],
                'location_name' => $data['location_name'],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'media_url' => $data['media_url'],
                'likes_count' => $data['likes_count'],
                'media_type' => 'image',
                'created_at' => now()->subMinutes(rand(10, 1440)), // Random time in last 24h
            ]);
        }
    }
}
