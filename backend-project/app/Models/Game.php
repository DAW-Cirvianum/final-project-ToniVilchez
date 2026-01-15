<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Category;
use App\Models\Player;
use App\Models\Round;

class Game extends Model
{
    protected $fillable = ['user_id', 'category_id'];

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function players(){
        return $this->hasMany(Player::class);
    }

    public function rounds(){
        return $this->hasMany(Round::class);
    }
}
