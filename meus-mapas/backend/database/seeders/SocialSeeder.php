<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Post;
use App\Models\Like;

class SocialSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have users
        $users = User::all();
        if ($users->count() < 3) {
            $users = User::factory(5)->create();
        }

        $mainUser = User::first(); // Assumes this is the logged-in user for demo

        // Create Posts for random users
        foreach ($users as $user) {
            if ($user->id === $mainUser->id)
                continue;

            // Make main user follow this user
            if (!$mainUser->following()->where('following_id', $user->id)->exists()) {
                $mainUser->following()->attach($user->id);
            }

            // Create 3 posts per user
            for ($i = 0; $i < 3; $i++) {
                $post = Post::create([
                    'user_id' => $user->id,
                    'content' => 'Exploring this amazing place! The Aurora views are stunning here. #' . fake()->city,
                    'media_url' => 'https://picsum.photos/seed/' . rand(1, 1000) . '/800/800',
                    'media_type' => 'image',
                    'latitude' => fake()->latitude,
                    'longitude' => fake()->longitude,
                    'location_name' => fake()->city . ', ' . fake()->country,
                    'likes_count' => rand(5, 50),
                    'comments_count' => rand(1, 10)
                ]);

                // Randomly like some posts
                if (rand(0, 1)) {
                    Like::create(['user_id' => $mainUser->id, 'post_id' => $post->id]);
                }
            }
        }
    }
}
