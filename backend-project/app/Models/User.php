<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use App\Models\Category;
use App\Models\Game;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

protected $fillable = [
        'name',
        'email',
        'password',
        'language',
        'avatar_path',
        'avatar_url',
        'role',
        'is_active', // AFEGEIX AIXÒ
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean', // AFEGEIX AIXÒ
    ];

    /**
     * Valors per defecte pels atributs
     *
     * @var array<string, mixed>
     */
    protected $attributes = [
        'language' => 'ca',
        'role' => 'user',
        'is_active' => true, // AFEGEIX AIXÒ (opcional)
    ];

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function games()
    {
        return $this->hasMany(Game::class);
    }
}
