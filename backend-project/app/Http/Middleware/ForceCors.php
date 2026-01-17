<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ForceCors
{
    public function handle(Request $request, Closure $next)
    {
        $allowedOrigins = [
            'https://icy-pebble-09c50c703.4.azurestaticapps.net',
            'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:5175',
            'http://localhost:8080',
            'http://localhost:5174',
            'http://localhost',  
        ];

        $origin = $request->header('Origin');
        $isAllowedOrigin = in_array($origin, $allowedOrigins) || empty($origin);

        if ($request->getMethod() === "OPTIONS") {
            return response('', 200)
                ->header('Access-Control-Allow-Origin', $isAllowedOrigin ? $origin : $allowedOrigins[0])
                ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
                ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-TOKEN')
                ->header('Access-Control-Allow-Credentials', 'true')
                ->header('Access-Control-Max-Age', '86400');
        }

        $response = $next($request);
        
        $response->headers->set('Access-Control-Allow-Origin', $isAllowedOrigin ? $origin : $allowedOrigins[0]);
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-TOKEN');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');
        
        return $response;
    }
}