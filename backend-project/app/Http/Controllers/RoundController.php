<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Round;
use Illuminate\Http\Request;

class RoundController extends Controller
{
    public function index(Game $game)
    {
        $this->authorize('view', $game);

        return response()->json([
            'success' => true,
            'data' => $game->rounds()->with(['word', 'impostor'])->get()
        ]);
    }

    public function store(Request $request, Game $game)
    {
        $this->authorize('view', $game);

        $validated = $request->validate([
            'word_id' => 'required|exists:words,id',
            'impostor_player_id' => 'required|exists:players,id',
        ]);

        $round = Round::create([
            'game_id' => $game->id,
            'word_id' => $validated['word_id'],
            'impostor_player_id' => $validated['impostor_player_id'],
        ]);

        return response()->json([
            'success' => true,
            'data' => $round
        ], 201);
    }
}