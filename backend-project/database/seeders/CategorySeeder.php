<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\User;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        
        if (!$admin) {
            $admin = User::create([
                'name' => 'Admin',
                'email' => 'admin@example.com',
                'password' => bcrypt('password'),
                'role' => 'admin'
            ]);
        }

        $defaultCategories = [
            [
                'name' => 'Animales',
                'description' => 'Animales de todo tipo',
                'is_default' => true,
                'user_id' => $admin->id
            ],
            [
                'name' => 'Países',
                'description' => 'Países del mundo',
                'is_default' => true,
                'user_id' => $admin->id
            ],
            [
                'name' => 'Películas',
                'description' => 'Películas famosas',
                'is_default' => true,
                'user_id' => $admin->id
            ],
            [
                'name' => 'Comida',
                'description' => 'Platos y alimentos',
                'is_default' => true,
                'user_id' => $admin->id
            ],
            [
                'name' => 'Deportes',
                'description' => 'Deportes y actividades',
                'is_default' => true,
                'user_id' => $admin->id
            ],
        ];

        foreach ($defaultCategories as $category) {
            Category::create($category);
        }

        $animals = Category::where('name', 'Animales')->first();
        if ($animals) {
            $animals->words()->createMany([
                ['text' => 'León'],
                ['text' => 'Elefante'],
                ['text' => 'Tigre'],
                ['text' => 'Jirafa'],
                ['text' => 'Mono'],
            ]);
        }

        $countries = Category::where('name', 'Países')->first();
        if ($countries) {
            $countries->words()->createMany([
                ['text' => 'España'],
                ['text' => 'Francia'],
                ['text' => 'Italia'],
                ['text' => 'Alemania'],
                ['text' => 'Portugal'],
            ]);
        }
    }
}
