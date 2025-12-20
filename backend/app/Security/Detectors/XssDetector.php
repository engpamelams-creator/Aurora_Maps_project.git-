<?php

namespace App\Security\Detectors;

class XssDetector implements DetectorInterface
{
    /**
     * Regex patterns for common Cross-Site Scripting (XSS) attacks.
     */
    protected array $patterns = [
        '/(<script.*?>)/i',
        '/(<\/script>)/i',
        '/(javascript:)/i',
        '/(vbscript:)/i',
        '/(onload\s*=)/i',
        '/(onerror\s*=)/i',
        '/(onclick\s*=)/i',
        '/(onmouseover\s*=)/i',
        '/(expression\()/i',
        '/(alert\()/i',
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
