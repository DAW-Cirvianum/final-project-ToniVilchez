<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Round extends Model
{
    protected $fillable = ['game_id', 'word_id', 'impostor_player_id'];

    public function game(){
        return $this->belongsTo(Game::class);
    }

    public function word(){
        return $this->belongsTo(Word::class);
    }

    public function impostor(){
        return $this->belongsTo(Player::class, 'impostor_player_id');
    }
}
