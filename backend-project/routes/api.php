<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\RoundController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\WordController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RecoveryController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Middleware\AdminMiddleware;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- RUTES PÚBLIQUES ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/forgot-password', [PasswordResetController::class, 'send']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

// Verificació d'email
Route::get('/email/verify/{id}/{hash}', [RecoveryController::class, 'verifyEmail'])
    ->middleware(['signed'])
    ->name('verification.verify');

// --- GESTIÓ DE LOCALE (IDIOMA) ---
// Nota: He eliminat els headers manuals. Configura el CORS a config/cors.php
Route::post('/set-locale', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'locale' => 'required|in:ca,es,en'
    ]);
    
    $cookie = cookie('app_locale', $request->locale, 60 * 24 * 30, '/', null, false, false);
    
    if ($user = $request->user()) {
        $user->language = $request->locale;
        $user->save();
    }
    
    return response()->json([
        'success' => true,
        'message' => 'Locale updated',
        'locale' => $request->locale
    ])->cookie($cookie);
});

Route::get('/current-locale', function (\Illuminate\Http\Request $request) {
    $locale = $request->cookie('app_locale') ?: 'ca';
    if (!in_array($locale, ['ca', 'es', 'en'])) $locale = 'ca';
    
    return response()->json([
        'locale' => $locale,
        'available' => ['ca', 'es', 'en'],
        'success' => true
    ]);
});

// --- RUTES PROTEGIDES (USUARI AUTENTICAT) ---
Route::middleware(['auth:sanctum'])->group(function () {
    
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/email/resend', [RecoveryController::class, 'resendVerification']);

    // Perfil d'usuari
    Route::get('/user', function () {
        $user = auth()->user();
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'language' => $user->language,
                'is_active' => $user->is_active,
                'created_at' => $user->created_at
            ]
        ]);
    });
    
    Route::put('/user', [UserController::class, 'updateProfile']);
    Route::post('/user/avatar', [UserController::class, 'uploadAvatar']);
    
    // Partides (Games)
    Route::apiResource('games', GameController::class);
    
    // Rondes
    Route::get('/games/{game}/rounds', [RoundController::class, 'index']);
    Route::post('/games/{game}/rounds', [RoundController::class, 'store']);
    Route::apiResource('rounds', RoundController::class)->except(['index', 'store']);
    
    // Categories i Paraules
    Route::apiResource('categories', CategoryController::class);
    Route::get('/categories/{category}/words-only', function ($categoryId) {
        $category = \App\Models\Category::with('words')->findOrFail($categoryId);
        return response()->json(['success' => true, 'data' => $category->words]);
    });

    Route::post('/categories/{category}/words', [WordController::class, 'store']);
    Route::delete('/words/{word}', [WordController::class, 'destroy']);
    Route::get('/words/random', [WordController::class, 'getRandomWord']);
});

// --- RUTES D'ADMINISTRADOR ---
Route::middleware(['auth:sanctum', AdminMiddleware::class])->prefix('admin')->group(function () {
    
    // Gestió d'usuaris
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::get('/users/{user}', [AdminController::class, 'showUser']);
    Route::put('/users/{user}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
    Route::put('/users/{user}/role', [AdminController::class, 'updateUserRole']);
    Route::put('/users/{user}/toggle-status', [AdminController::class, 'toggleUserStatus']);
    
    // Gestió de contingut
    Route::get('/categories', [AdminController::class, 'getAllCategories']);
    Route::post('/categories', [AdminController::class, 'createCategory']);
    Route::put('/categories/{category}', [AdminController::class, 'updateCategory']);
    Route::delete('/categories/{category}', [AdminController::class, 'deleteCategory']);
    Route::put('/categories/{category}/toggle-default', [AdminController::class, 'toggleDefaultCategory']);
    
    Route::get('/categories/{category}/words', [AdminController::class, 'getWordsByCategory']);
    Route::put('/words/{word}', [AdminController::class, 'updateWord']);
    Route::delete('/words/{word}', [AdminController::class, 'deleteWord']);
    Route::post('/words/bulk', [AdminController::class, 'bulkCreateWords']);
    
    // Estadístiques i manteniment
    Route::get('/stats', [AdminController::class, 'getStats']);
    Route::get('/reports/users-activity', [AdminController::class, 'getUsersActivityReport']);
    Route::get('/reports/games-stats', [AdminController::class, 'getGamesStatsReport']);
    Route::get('/export/data', [AdminController::class, 'exportData']);
    Route::post('/import/data', [AdminController::class, 'importData']);
    Route::get('/settings', [AdminController::class, 'getSettings']);
    Route::put('/settings', [AdminController::class, 'updateSettings']);
    Route::post('/backup', [AdminController::class, 'createBackup']);
    Route::post('/maintenance/cleanup', [AdminController::class, 'cleanupOldData']);
});

// --- RUTES DE DESENVOLUPAMENT / DOCUMENTACIÓ ---
if (config('app.env') !== 'production') {
    Route::get('/documentation', '\L5Swagger\Http\Controllers\SwaggerController@api');
    Route::get('/oauth2-callback', '\L5Swagger\Http\Controllers\SwaggerController@oauth2Callback');
    
    Route::get('/test-admin', function () {
        return response()->json([
            'message' => 'Admin test route',
            'user' => auth()->user(),
            'is_admin' => auth()->check() && auth()->user()->role === 'admin'
        ]);
    })->middleware(['auth:sanctum', AdminMiddleware::class]); // Unificat l'ús del middleware
}

// --- FALLBACK (404) ---
Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Ruta no trobada',
        'path' => request()->path()
    ], 404);
});