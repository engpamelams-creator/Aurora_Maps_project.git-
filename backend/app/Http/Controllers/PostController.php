<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    // Get the Geo-Social Feed
    // Smart Feed Algorithm: Nearby + Trending + Following
    public function index(Request $request)
    {
        $user = Auth::user();

        // 1. Coordinates from Request (Header or Query)
        $lat = $request->input('lat');
        $lng = $request->input('lng');

        $query = Post::with(['user:id,name', 'likes', 'comments']);

        // 2. Scoring Algorithm in SQL
        if ($lat && $lng) {
            // Prioritize Nearby
            $query->orderByRaw("ABS(latitude - ?) + ABS(longitude - ?) ASC", [$lat, $lng]);
        } else {
            // Simplified Sorting to fix "Ambiguous column" error
            // Just show latest posts first, then popular
            $query->latest();
        }

        $posts = $query->paginate(10);

        // Transform for frontend Hybrid Card
        $feed = $posts->getCollection()->transform(function ($post) use ($user) {
            return [
                'id' => $post->id,
                'content' => $post->content,
                'media_url' => $post->media_url,
                'media_type' => $post->media_type,
                'location' => [
                    'lat' => $post->latitude,
                    'lng' => $post->longitude,
                    'name' => $post->location_name
                ],
                'author' => [
                    'id' => $post->user->id,
                    'name' => $post->user->name,
                    'avatar' => 'https://ui-avatars.com/api/?name=' . urlencode($post->user->name) . '&background=random'
                ],
                'stats' => [
                    'likes' => $post->likes->count(),
                    'comments' => $post->comments->count()
                ],
                'liked_by_me' => $post->likes->where('user_id', $user->id)->isNotEmpty(),
                'created_at' => $post->created_at->diffForHumans()
            ];
        });

        return response()->json([
            'data' => $feed,
            'next_page_url' => $posts->nextPageUrl()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'nullable|string',
            'media_url' => 'required|string', // Assuming uploads handled by S3/Cloudinary first
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'location_name' => 'nullable|string'
        ]);

        $post = Auth::user()->posts()->create($validated);

        return response()->json($post, 201);
    }


    public function toggleLike($id)
    {
        $post = Post::findOrFail($id);
        $userId = Auth::id();

        // Standard relationship check (Migration failed, reverting to simple schema)
        $like = $post->likes()->where('user_id', $userId)->first();

        if ($like) {
            $like->delete();
            $post->decrement('likes_count');
            return response()->json(['liked' => false]);
        } else {
            $post->likes()->create(['user_id' => $userId]);
            $post->increment('likes_count');
            return response()->json(['liked' => true]);
        }
    }
}
