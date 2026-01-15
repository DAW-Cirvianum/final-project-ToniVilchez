<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Game;
use App\Models\Round;

class Player extends Model
{
    protected $fillable = ['game_id', 'name', 'role'];

    public function game(){
        return $this->belongsTo(Game::class);
    }

    public function impostorRounds(){
        return $this->hasMany(Round::class, 'impostor_player_id');
    }
}
