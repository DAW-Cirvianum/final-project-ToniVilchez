<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register', 'oauth2-callback', 'forgot-password', 'reset-password', 'test-cors', 'set-locale', 'current-locale'], // <-- Afegeix set-locale i current-locale
    
    'allowed_methods' => ['*'],
    
    'allowed_origins' => [
        'https://icy-pebble-09c50c703.4.azurestaticapps.net',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:5175',
        'http://localhost:8080',
        'http://localhost:5174',
        'http://localhost',
    ],
    
    'allowed_origins_patterns' => [],
    
    'allowed_headers' => ['*'],
    
    'exposed_headers' => [],
    
    'max_age' => 0,
    
    'supports_credentials' => true,
];
