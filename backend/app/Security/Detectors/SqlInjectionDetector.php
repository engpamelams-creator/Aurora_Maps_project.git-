<?php

namespace App\Security\Detectors;

class SqlInjectionDetector implements DetectorInterface
{
    /**
     * Regex patterns for common SQL Injection vectors.
     * Covers UNION-based, Error-based, and Boolean-based injections.
     */
    protected array $patterns = [
        '/(union\s+select)/i',
        '/(union\s+all\s+select)/i',
        '/(drop\s+table)/i',
        '/(delete\s+from)/i',
        '/(update.+set.+)/i',
        '/(insert\s+into)/i',
        '/(\s+or\s+1=1)/i',
        '/(\s+or\s+1\s*=\s*1)/i',
        '/(\';--)/i',
        '/(\'\s+or\s+)/i',
        '/(exec\(\s*char\()/i',
    ];

    public function check(string $input): bool
    {
        foreach ($this->patterns as $pattern) {
            if (preg_match($pattern, $input)) {
                return true;
            }
        }

        return false;
    }
}
