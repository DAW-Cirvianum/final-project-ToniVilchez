<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Category;
use App\Models\Game;

class User extends Authenticatable implements MustVerifyEmail
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
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    protected $attributes = [
        'language' => 'ca',
        'role' => 'user',
        'is_active' => true,
    ];

    public function getEmailForVerification()
    {
        return $this->email;
    }

    public function categories()
    {
        return $this->hasMany(Category::class);
    }

    public function games()
    {
        return $this->hasMany(Game::class);
    }
    
    public function sendPasswordResetNotificationCustom($url)
    {
        $this->notify(new \App\Notifications\CustomResetPassword($url));
    }
}