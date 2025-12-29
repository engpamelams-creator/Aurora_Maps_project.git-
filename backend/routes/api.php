<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/ping', function () {
    return 'pong';
});

use App\Http\Controllers\MapController;
use App\Http\Controllers\PointController;

use App\Http\Controllers\HomeController; // Import HomeController

Route::get('home-summary', [HomeController::class, 'summary']); // Lightweight Home Endpoint
Route::apiResource('maps', MapController::class)->only(['index', 'store', 'show']);
Route::post('maps/{map}/points', [PointController::class, 'store']);
Route::put('points/{point}', [PointController::class, 'update']);
Route::delete('points/{point}', [PointController::class, 'destroy']);
Route::delete('maps/{map}/points', [PointController::class, 'destroyAll']);
Route::post('analytics/search', [MapController::class, 'analyticsSearch']);

// --- Auth Routes ---
use App\Http\Controllers\AuthController;

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

use App\Http\Controllers\UploadController;
use App\Http\Controllers\CapsuleController;


use App\Http\Controllers\PostController;

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/update', [AuthController::class, 'update']);
    Route::delete('/auth/delete', [AuthController::class, 'destroy']);

    // --- Social Graph Routes ---
    Route::get('/feed', [PostController::class, 'index']); // The Geo-Feed
    Route::post('/posts', [PostController::class, 'store']); // Create Post
    Route::post('/upload', [UploadController::class, 'store']);

    // Gamification Routes (Capsules)
    Route::get('/capsules', [CapsuleController::class, 'index']);
    Route::post('/capsules', [CapsuleController::class, 'store']);
    Route::post('/capsules/{capsule}/collect', [CapsuleController::class, 'collect']);
    Route::post('/posts/{id}/like', [PostController::class, 'toggleLike']); // Like/Unlike
});

// --- Location Module (Sênior Implementation) ---
use App\Http\Controllers\LocationController;

Route::middleware('auth:sanctum')->prefix('locations')->group(function () {
    Route::get('/nearby', [LocationController::class, 'nearby']);
    Route::get('/search', [LocationController::class, 'search']);
});
