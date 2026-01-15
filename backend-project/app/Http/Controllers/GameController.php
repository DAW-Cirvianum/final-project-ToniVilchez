<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Game;
use App\Models\Player;
use Illuminate\Http\Request;

class GameController extends Controller
{
    public function index()
    {
        $games = Game::where('user_id', auth()->id())->get();
        
        return response()->json([
            'success' => true,
            'data' => $games
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'players' => 'required|array|min:3',
            'players.*' => 'required|string|max:255',
        ]);

        $category = Category::findOrFail($validated['category_id']);

        $this->authorize('view', $category);

        $game = Game::create([
            'user_id' => auth()->id(),
            'category_id' => $category->id,
        ]);

        $impostorIndex = array_rand($validated['players']);

        foreach ($validated['players'] as $index => $name) {
            Player::create([
                'game_id' => $game->id,
                'name' => $name,
                'role' => $index === $impostorIndex ? 'impostor' : 'normal',
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => $game->load('players')
        ], 201);
    }

    public function show(Game $game)
    {
        $this->authorize('view', $game);

        return response()->json([
            'success' => true,
            'data' => $game->load('players')
        ]);
    }
}