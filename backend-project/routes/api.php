<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\WordController;
use App\Http\Controllers\GameController;
use App\Http\Controllers\RoundController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\UserController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);


Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', fn (Request $request) => $request->user());
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/forgot-password', [PasswordResetController::class, 'send']);
    Route::post('/reset-password', [PasswordResetController::class, 'reset']);

    Route::put('/user', [UserController::class, 'updateProfile']);
    Route::post('/user/avatar', [UserController::class, 'uploadAvatar']);

    Route::get('/categories', [CategoryController::class, 'index']);
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::get('/categories/{category}', [CategoryController::class, 'show']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    Route::post('/categories/{category}/words', [WordController::class, 'store']);
    Route::delete('/words/{word}', [WordController::class, 'destroy']);

    Route::get('/games', [GameController::class, 'index']);
    Route::post('/games', [GameController::class, 'store']);
    Route::get('/games/{game}', [GameController::class, 'show']);

    Route::get('/games/{game}/rounds', [RoundController::class, 'index']);
    Route::post('/games/{game}/rounds', [RoundController::class, 'store']);
});

Route::get('/categories/{category}/words-only', function ($categoryId) {
    $category = \App\Models\Category::findOrFail($categoryId);
    
    if ($category->user_id && $category->user_id !== auth()->id()) {
        return response()->json([
            'success' => false,
            'message' => 'No tienes acceso a esta categoría'
        ], 403);
    }
    
    $words = $category->words()->get();
    
    return response()->json([
        'success' => true,
        'data' => $words
    ]);
});
