<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

// Rutas públicas
Route::get('/', function () {
    return view('welcome');
});


// Rutas administrativas (protegidas con middleware)
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Admin Dashboard
    Route::get('/admin', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    
    // Gestión de usuarios
    Route::get('/admin/users', [AdminController::class, 'listUsers'])->name('admin.users.index');
    Route::get('/admin/users/{user}', [AdminController::class, 'showUser'])->name('admin.users.show');
    Route::put('/admin/users/{user}', [AdminController::class, 'updateUser'])->name('admin.users.update');
    Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser'])->name('admin.users.destroy');
    Route::put('/admin/users/{user}/role', [AdminController::class, 'updateRole'])->name('admin.users.update-role');
    Route::put('/admin/users/{user}/toggle-active', [AdminController::class, 'toggleActive'])->name('admin.users.toggle-active');
});


// Dummy login route (used for Laravel redirect on unauthenticated web requests)
Route::get('/login', function () {
    return redirect('http://localhost:5175/login');
})->name('login');
