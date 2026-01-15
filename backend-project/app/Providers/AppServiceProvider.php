<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Models\Category;
use App\Models\Game;
use App\Models\Word;
use App\Policies\CategoryPolicy;
use App\Policies\GamePolicy;
use App\Policies\WordPolicy;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Registrar totes les polítiques
        Gate::policy(Category::class, CategoryPolicy::class);
        Gate::policy(Game::class, GamePolicy::class);
        Gate::policy(Word::class, WordPolicy::class);

        // Definir Gate per al rol d'admin
        Gate::define('admin', function (User $user) {
            return $user->role === 'admin';
        });
    }
}
