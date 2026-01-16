<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\RoundController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\WordController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PasswordResetController;

Route::match(['options'], '/{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', 'https://icy-pebble-09c50c703.4.azurestaticapps.net')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, X-CSRF-TOKEN')
        ->header('Access-Control-Allow-Credentials', 'true')
        ->header('Access-Control-Max-Age', '86400');
})->where('any', '.*');

Route::get('/test-cors', function () {
    return response()->json([
        'message' => 'CORS is working! 🎉',
        'timestamp' => now()->toDateTimeString(),
        'environment' => app()->environment(),
        'origin' => request()->header('Origin'),
        'cors_headers' => [
            'Access-Control-Allow-Origin' => 'https://icy-pebble-09c50c703.4.azurestaticapps.net',
            'Access-Control-Allow-Credentials' => 'true'
        ]
    ]);
});

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::post('/forgot-password', [PasswordResetController::class, 'send']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

Route::middleware(['auth:sanctum'])->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
    
    Route::get('/user', function () {
        return response()->json([
            'user' => auth()->user(),
            'roles' => auth()->user()->roles->pluck('name')
        ]);
    });
    
    Route::put('/user', [UserController::class, 'updateProfile']);
    Route::post('/user/avatar', [UserController::class, 'uploadAvatar']);
    
    Route::get('/games', [GameController::class, 'index']);
    Route::post('/games', [GameController::class, 'store']);
    Route::get('/games/{game}', [GameController::class, 'show']);
    
    Route::get('/games/{game}/rounds', [RoundController::class, 'index']);
    Route::post('/games/{game}/rounds', [RoundController::class, 'store']);
    
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    
    Route::post('/categories/{category}/words', [WordController::class, 'store']);
    Route::delete('/words/{word}', [WordController::class, 'destroy']);
    
    Route::get('/categories/{category}/words-only', function ($category) {
        $category = \App\Models\Category::with('words')->findOrFail($category);
        return response()->json($category->words);
    });
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'listUsers']);
    Route::get('/users/{user}', [AdminController::class, 'showUser']);
    Route::put('/users/{user}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
    Route::put('/users/{user}/role', [AdminController::class, 'updateRole']);
    Route::put('/users/{user}/toggle-active', [AdminController::class, 'toggleActive']);
});

if (config('app.env') !== 'production') {
    Route::get('/documentation', '\L5Swagger\Http\Controllers\SwaggerController@api');
    Route::get('/oauth2-callback', '\L5Swagger\Http\Controllers\SwaggerController@oauth2Callback');
}
