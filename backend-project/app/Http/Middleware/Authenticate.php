<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Auth\Middleware\Authenticate as BaseAuthenticate;

class Authenticate extends BaseAuthenticate
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     */
    protected function redirectTo(Request $request): ?string
    {
        // Para API, devolver null para que Laravel genere respuesta 401 JSON automáticamente
        if ($request->expectsJson()) {
            return null;
        }

        // Para web, intentar redirigir a login si existe
        // Si no existe, retornar null para generar 401
        try {
            return route('login', [], false);
        } catch (\Exception $e) {
            return null;
        }
    }
}
