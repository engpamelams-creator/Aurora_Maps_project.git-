<?php

namespace App\Security\Services;

use App\Models\SecurityLog;
use App\Security\Detectors\SqlInjectionDetector;
use App\Security\Detectors\XssDetector;
use Illuminate\Http\Request;

class SecurityService
{
    protected array $detectors = [];

    public function __construct()
    {
        // Register Detectors
        $this->detectors = [
            'sqli' => new SqlInjectionDetector(),
            'xss' => new XssDetector(),
        ];
    }

    /**
     * Scan the request for threats.
     * Returns true if request is SAFE.
     * Returns false if threat DETECTED.
     */
    public function validateRequest(Request $request): bool
    {
        // 1. Gather all inputs (Query, Body, Headers)
        $inputs = $request->all(); // Recursively gets all inputs

        // 2. Scan recursively
        foreach ($inputs as $key => $value) {
            if ($this->scanValue($value, $request)) {
                return false; // Threat Found!
            }
        }

        return true; // All clear
    }

    protected function scanValue($value, Request $request): bool
    {
        // Handle Arrays Recursively
        if (is_array($value)) {
            foreach ($value as $item) {
                if ($this->scanValue($item, $request)) {
                    return true;
                }
            }
            return false;
        }

        // Only scan strings
        if (!is_string($value)) {
            return false;
        }

        // Run through each detector
        foreach ($this->detectors as $type => $detector) {
            if ($detector->check($value)) {
                $this->logIncident($request, $type, $value);
                return true; // Detected!
            }
        }

        return false;
    }

    protected function logIncident(Request $request, string $type, string $payload)
    {
        SecurityLog::create([
            'ip_address' => $request->ip(),
            'user_agent' => $request->header('User-Agent'),
            'endpoint' => $request->fullUrl(),
            'payload' => ['malicious_input' => $payload],
            'detector_type' => $type,
        ]);
    }
}
