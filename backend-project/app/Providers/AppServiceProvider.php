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

    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::policy(Category::class, CategoryPolicy::class);
        Gate::policy(Game::class, GamePolicy::class);
        Gate::policy(Word::class, WordPolicy::class);

        Gate::define('admin', function (User $user) {
            return $user->role === 'admin';
        });
    }
}
