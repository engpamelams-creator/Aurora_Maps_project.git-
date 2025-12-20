<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class SecureFileService
{
    /**
     * Upload an image securely.
     *
     * @param UploadedFile $file
     * @param string $path
     * @return string
     * @throws \Exception
     */
    public function uploadImage(UploadedFile $file, string $path = 'uploads'): string
    {
        // 1. MIME Type Validation (Strict)
        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($file->getMimeType(), $allowedMimes)) {
            throw new \Exception('Invalid file type. Only JPG, PNG, and WebP are allowed.');
        }

        // 2. Extension Validation (Double-check)
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];
        $extension = strtolower($file->getClientOriginalExtension());
        if (!in_array($extension, $allowedExtensions)) {
            throw new \Exception('Invalid file extension.');
        }

        // 3. Prevent "PHP in disguise" (Double Extensions)
        // e.g., image.php.jpg or image.jpg.php
        $filename = $file->getClientOriginalName();
        if (preg_match('/\.(php|php[0-9]|phtml|exe|sh|cgi)\./i', $filename)) {
            throw new \Exception('Potential malicious file detected (Double Extension).');
        }

        // 4. Sanitize and Rename (Random Hash)
        $newFilename = Str::random(40) . '.' . $extension;

        // 5. Store File (Public Disk)
        $storedPath = $file->storeAs($path, $newFilename, 'public');

        if (!$storedPath) {
            throw new \Exception('Failed to store file.');
        }

        // Returns relative path, e.g., uploads/xyz.jpg
        // Use verify asset() helper in controller
        return $storedPath;
    }
}
