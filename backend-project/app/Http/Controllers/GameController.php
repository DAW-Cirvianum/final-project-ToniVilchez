<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Game;
use App\Models\Player;
use Illuminate\Http\Request;

class GameController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/games",
     *     operationId="getGames",
     *     tags={"Games"},
     *     summary="Llistar partides",
     *     description="Retorna les partides de l'usuari",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Llistat de partides",
     *         @OA\JsonContent(ref="#/components/schemas/SuccessResponse")
     *     )
     * )
     */
    public function index()
    {
        $games = Game::where('user_id', auth()->id())->get();
        
        return response()->json([
            'success' => true,
            'data' => $games
        ]);
    }

    /**
     * @OA\Post(
     *     path="/api/games",
     *     operationId="createGame",
     *     tags={"Games"},
     *     summary="Crear partida",
     *     description="Crea una nova partida amb jugadors i assigna un impostor aleatori",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"category_id","players"},
     *             @OA\Property(property="category_id", type="integer", example=1),
     *             @OA\Property(
     *                 property="players", 
     *                 type="array",
     *                 @OA\Items(type="string", example="Anna")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Partida creada",
     *         @OA\JsonContent(ref="#/components/schemas/SuccessResponse")
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="No autoritzat per a la categoria"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Error de validació"
     *     )
     * )
     */
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

    /**
     * @OA\Get(
     *     path="/api/games/{id}",
     *     operationId="getGame",
     *     tags={"Games"},
     *     summary="Mostrar partida",
     *     description="Retorna una partida específica",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Partida trobada",
     *         @OA\JsonContent(ref="#/components/schemas/SuccessResponse")
     *     ),
     *     @OA\Response(
     *         response=403,
     *         description="No autoritzat"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Partida no trobada"
     *     )
     * )
     */
    public function show(Game $game)
    {
        $this->authorize('view', $game);

        return response()->json([
            'success' => true,
            'data' => $game->load('players')
        ]);
    }
}