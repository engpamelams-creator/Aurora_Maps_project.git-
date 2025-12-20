<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\SecureFileService;

class UploadController extends Controller
{
    protected $fileService;

    public function __construct(SecureFileService $fileService)
    {
        $this->fileService = $fileService;
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:5120', // Max 5MB
        ]);

        try {
            $path = $this->fileService->uploadImage($request->file('file'), 'posts');

            return response()->json([
                'url' => asset('storage/' . $path),
                'path' => $path
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }
}
