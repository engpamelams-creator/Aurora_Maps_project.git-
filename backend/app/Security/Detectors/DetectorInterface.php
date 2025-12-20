<?php

namespace App\Security\Detectors;

interface DetectorInterface
{
    /**
     * Check if the input contains malicious patterns.
     * Returns true if a threat is detected.
     *
     * @param string $input
     * @return bool
     */
    public function check(string $input): bool;
}
