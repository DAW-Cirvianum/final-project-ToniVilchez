<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'description', 'is_default', 'user_id'];

    // Atributs addicionals que volem incloure
    protected $appends = ['words_count'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function words()
    {
        return $this->hasMany(Word::class);
    }

    public function image()
    {
        return $this->hasOne(Image::class);
    }

    public function games()
    {
        return $this->hasMany(Game::class);
    }

    // Accessor per al recompte de paraules
    public function getWordsCountAttribute()
    {
        return $this->words()->count();
    }
}
