<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Category;
use App\Models\Round;

class Word extends Model
{
    protected $fillable = ['text', 'category_id'];

    public function category(){
        return $this->belongsTo(Category::class);
    }

    public function rounds(){
        return $this->hasMany(Round::class);
    }
}
