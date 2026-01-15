<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 *     title="Joc de l'Impostor API",
 *     version="1.0.0",
 *     description="API per al joc de l'impostor. Permet gestionar categories, paraules, partides i rondes.",
 *     @OA\Contact(
 *         email="admin@example.com"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="http://localhost:8000/api",
 *     description="Servidor local de l'API"
 * )
 * 
 * @OA\Tag(
 *     name="Autenticació",
 *     description="Endpoints relacionats amb autenticació i gestió d'usuaris"
 * )
 * 
 * @OA\Tag(
 *     name="Categories",
 *     description="Gestió de categories de paraules"
 * )
 * 
 * @OA\Tag(
 *     name="Words",
 *     description="Gestió de paraules dins de categories"
 * )
 * 
 * @OA\Tag(
 *     name="Games",
 *     description="Gestió de partides del joc"
 * )
 * 
 * @OA\Tag(
 *     name="Rounds",
 *     description="Gestió de rondes dins de partides"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     scheme="bearer",
 *     bearerFormat="JWT",
 *     description="Autenticació mitjançant Bearer Token (Laravel Sanctum)"
 * )
 */
abstract class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}