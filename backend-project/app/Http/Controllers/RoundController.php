<?php

namespace App\Http\Controllers;

use App\Models\Game;
use App\Models\Round;
use Illuminate\Http\Request;

class RoundController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/games/{game_id}/rounds",
     *     operationId="getGameRounds",
     *     tags={"Rounds"},
     *     summary="Llistar rounds d'una partida",
     *     description="Retorna tots els rounds d'una partida",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="game_id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Llistat de rounds",
     *         @OA\JsonContent(ref="#/components/schemas/SuccessResponse")
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="No autoritzat"
     *     )
     * )
     */
    public function index(Game $game)
    {
        $this->authorize('view', $game);

        return response()->json([
            'success' => true,
            'data' => $game->rounds()->with(['word', 'impostor'])->get()
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/games/{game_id}/rounds",
     *     operationId="createRound",
     *     tags={"Rounds"},
     *     summary="Crear round",
     *     description="Crea un nou round per a una partida",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="game_id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"word_id","impostor_player_id"},
     *             @OA\Property(property="word_id", type="integer", example=1),
     *             @OA\Property(property="impostor_player_id", type="integer", example=2)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Round creat",
     *         @OA\JsonContent(ref="#/components/schemas/SuccessResponse")
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="No autoritzat"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validació"
     *     )
     * )
     */
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