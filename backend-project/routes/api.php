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

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::post('/forgot-password', [PasswordResetController::class, 'send']);
Route::post('/reset-password', [PasswordResetController::class, 'reset']);

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrf_token' => csrf_token()]);
});

Route::match(['options', 'post'], '/set-locale', function (\Illuminate\Http\Request $request) {
    if ($request->isMethod('options')) {
        return response('', 200)
            ->header('Access-Control-Allow-Origin', $request->header('Origin') ?? 'http://localhost:5174')
            ->header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
            ->header('Access-Control-Allow-Credentials', 'true');
    }
    
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
    ])->cookie($cookie)
      ->header('Access-Control-Allow-Origin', $request->header('Origin') ?? 'http://localhost:5174')
      ->header('Access-Control-Allow-Credentials', 'true');
});

Route::match(['options', 'get'], '/current-locale', function (\Illuminate\Http\Request $request) {
    if ($request->isMethod('options')) {
        return response('', 200)
            ->header('Access-Control-Allow-Origin', $request->header('Origin') ?? 'http://localhost:5174')
            ->header('Access-Control-Allow-Methods', 'GET, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
            ->header('Access-Control-Allow-Credentials', 'true');
    }
    
    $locale = $request->cookie('app_locale') ?? 
              ($request->user() ? $request->user()->language : null) ?? 
              config('app.locale');
    
    return response()->json([
        'locale' => $locale,
        'available' => ['ca', 'es', 'en']
    ])->header('Access-Control-Allow-Origin', $request->header('Origin') ?? 'http://localhost:5174')
      ->header('Access-Control-Allow-Credentials', 'true');
});

Route::get('/current-locale', function (\Illuminate\Http\Request $request) {
    $cookieLocale = $request->cookie('app_locale');
    
    $userLocale = $request->user() ? $request->user()->language : null;
    
    $browserLocale = $request->getPreferredLanguage(['ca', 'es', 'en']);
    
    $locale = $cookieLocale ?? $userLocale ?? $browserLocale ?? config('app.locale');
    
    return response()->json([
        'locale' => $locale,
        'source' => $cookieLocale ? 'cookie' : ($userLocale ? 'user' : ($browserLocale ? 'browser' : 'config')),
        'available' => ['ca', 'es', 'en']
    ]);
});

Route::middleware(['auth:sanctum'])->group(function () {
    
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
    
    Route::get('/games', [GameController::class, 'index']);
    Route::post('/games', [GameController::class, 'store']);
    Route::get('/games/{game}', [GameController::class, 'show']);
    Route::delete('/games/{game}', [GameController::class, 'destroy']);
    Route::put('/games/{game}', [GameController::class, 'update']);
    
    Route::get('/games/{game}/rounds', [RoundController::class, 'index']);
    Route::post('/games/{game}/rounds', [RoundController::class, 'store']);
    Route::get('/rounds/{round}', [RoundController::class, 'show']);
    Route::put('/rounds/{round}', [RoundController::class, 'update']);
    Route::delete('/rounds/{round}', [RoundController::class, 'destroy']);
    
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);
    
    Route::post('/categories/{category}/words', [WordController::class, 'store']);
    Route::delete('/words/{word}', [WordController::class, 'destroy']);
    Route::get('/words/random', [WordController::class, 'getRandomWord']);
    
    Route::get('/categories/{category}/words-only', function ($categoryId) {
        $category = \App\Models\Category::with('words')->findOrFail($categoryId);
        return response()->json([
            'success' => true,
            'data' => $category->words
        ]);
    });
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    
    Route::get('/users', [AdminController::class, 'getUsers']);
    Route::get('/users/{user}', [AdminController::class, 'showUser']);
    Route::put('/users/{user}', [AdminController::class, 'updateUser']);
    Route::delete('/users/{user}', [AdminController::class, 'deleteUser']);
    Route::put('/users/{user}/role', [AdminController::class, 'updateUserRole']);
    Route::put('/users/{user}/toggle-status', [AdminController::class, 'toggleUserStatus']);
    
    Route::get('/categories', [AdminController::class, 'getAllCategories']);
    Route::post('/categories', [AdminController::class, 'createCategory']);
    Route::put('/categories/{category}', [AdminController::class, 'updateCategory']);
    Route::delete('/categories/{category}', [AdminController::class, 'deleteCategory']);
    Route::put('/categories/{category}/toggle-default', [AdminController::class, 'toggleDefaultCategory']);
    
    Route::get('/categories/{category}/words', [AdminController::class, 'getWordsByCategory']);
    Route::put('/words/{word}', [AdminController::class, 'updateWord']);
    Route::delete('/words/{word}', [AdminController::class, 'deleteWord']);
    Route::post('/words/bulk', [AdminController::class, 'bulkCreateWords']);
    
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

if (config('app.env') !== 'production') {
    Route::get('/documentation', '\L5Swagger\Http\Controllers\SwaggerController@api');
    Route::get('/oauth2-callback', '\L5Swagger\Http\Controllers\SwaggerController@oauth2Callback');
    
    Route::get('/test-admin', function () {
        return response()->json([
            'message' => 'Admin test route',
            'user' => auth()->user(),
            'is_admin' => auth()->check() && auth()->user()->role === 'admin'
        ]);
    })->middleware(['auth:sanctum', 'admin']);
}

Route::fallback(function () {
    return response()->json([
        'success' => false,
        'message' => 'Ruta no encontrada',
        'path' => request()->path()
    ], 404);
});