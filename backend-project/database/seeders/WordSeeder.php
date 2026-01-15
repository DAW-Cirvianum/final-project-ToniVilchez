<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Word;
use App\Models\Category;

class WordSeeder extends Seeder
{
    public function run(): void
    {
        $category = Category::first();

        Word::create([
            'text' => 'Taula',
            'category_id' => 1,
        ]);


        Word::create([
            'text' => 'Cadira',
            'category_id' => $category->id,
        ]);

        Word::create([
            'text' => 'Sofà',
            'category_id' => $category->id,
        ]);
    }
}
