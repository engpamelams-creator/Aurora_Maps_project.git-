<?php

namespace App\Security\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Security\Services\SecurityService;

class WafMiddleware
{
    protected $securityService;

    public function __construct(SecurityService $securityService)
    {
        $this->securityService = $securityService;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Run WAF Scans
        if (!$this->securityService->validateRequest($request)) {
            // Threat Detected!
            // Return 403 Forbidden without sensitive info
            abort(403, 'Request blocked by Security Shield.');
        }

        return $next($request);
    }
}
