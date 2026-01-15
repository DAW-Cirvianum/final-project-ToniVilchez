<?php

namespace App\Swagger;

/**
 * @OA\OpenApi(
 *     @OA\Info(
 *         description="API REST para el juego Impostor Game",
 *         version="1.0.0",
 *         title="Impostor Game API",
 *         termsOfService="http://swagger.io/terms/",
 *         contact=@OA\Contact(
 *             email="info@impostorgame.com"
 *         ),
 *         license=@OA\License(
 *             name="Apache 2.0",
 *             url="http://www.apache.org/licenses/LICENSE-2.0.html"
 *         )
 *     ),
 *     @OA\Server(
 *         url="http://localhost:8000/api",
 *         description="API Server"
 *     ),
 *     @OA\SecurityScheme(
 *         type="http",
 *         name="Authorization",
 *         in="header",
 *         scheme="bearer",
 *         bearerFormat="token",
 *         securityScheme="sanctum"
 *     )
 * )
 * 
 * @OA\Schema(
 *     schema="User",
 *     type="object",
 *     description="Modelo de Usuario",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="John Doe"),
 *     @OA\Property(property="email", type="string", format="email", example="john@example.com"),
 *     @OA\Property(property="role", type="string", enum={"user","admin"}, example="user"),
 *     @OA\Property(property="language", type="string", enum={"ca","es","en"}, example="ca"),
 *     @OA\Property(property="is_active", type="boolean", example=true),
 *     @OA\Property(property="email_verified_at", type="string", format="date-time", nullable=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Category",
 *     type="object",
 *     description="Modelo de Categoría",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Animales"),
 *     @OA\Property(property="description", type="string", example="Animales del mundo"),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time"),
 *     @OA\Property(property="words_count", type="integer", example=5)
 * )
 * 
 * @OA\Schema(
 *     schema="Word",
 *     type="object",
 *     description="Modelo de Palabra",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="word", type="string", example="Gat"),
 *     @OA\Property(property="category_id", type="integer", example=1),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Game",
 *     type="object",
 *     description="Modelo de Partida",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="user_id", type="integer", example=1),
 *     @OA\Property(property="category_id", type="integer", example=1),
 *     @OA\Property(property="status", type="string", enum={"pending","active","finished"}, example="active"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Round",
 *     type="object",
 *     description="Modelo de Ronda",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="game_id", type="integer", example=1),
 *     @OA\Property(property="word_id", type="integer", example=5),
 *     @OA\Property(property="impostor_player_id", type="integer", example=2),
 *     @OA\Property(property="voted_player_id", type="integer", nullable=true),
 *     @OA\Property(property="status", type="string", enum={"active","finished"}, example="finished"),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="Player",
 *     type="object",
 *     description="Modelo de Jugador",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Alice"),
 *     @OA\Property(property="game_id", type="integer", example=1),
 *     @OA\Property(property="is_impostor", type="boolean", example=false),
 *     @OA\Property(property="is_eliminated", type="boolean", example=false),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 * 
 * @OA\Schema(
 *     schema="SuccessResponse",
 *     type="object",
 *     description="Respuesta de éxito estándar",
 *     @OA\Property(property="success", type="boolean", example=true),
 *     @OA\Property(property="data", type="object", nullable=true),
 *     @OA\Property(property="message", type="string", example="Operación exitosa")
 * )
 * 
 * @OA\Schema(
 *     schema="ErrorResponse",
 *     type="object",
 *     description="Respuesta de error estándar",
 *     @OA\Property(property="success", type="boolean", example=false),
 *     @OA\Property(property="message", type="string", example="Error en la operación"),
 *     @OA\Property(property="errors", type="object", nullable=true)
 * )
 */
class ApiDocumentation
{
}
