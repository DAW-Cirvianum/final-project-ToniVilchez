<?php

namespace App\Swagger;

/**
 * @OA\Schema(
 *     schema="SuccessResponse",
 *     type="object",
 *     description="Resposta d'èxit estàndard de l'API",
 *     @OA\Property(
 *         property="success",
 *         type="boolean",
 *         example=true,
 *         description="Indica si l'operació ha estat exitosa"
 *     ),
 *     @OA\Property(
 *         property="data",
 *         type="object",
 *         description="Dades retornades per l'operació"
 *     ),
 *     @OA\Property(
 *         property="message",
 *         type="string",
 *         example="Operació exitosa",
 *         description="Missatge descriptiu de l'operació"
 *     )
 * )
 * 
 * @OA\Schema(
 *     schema="ErrorResponse",
 *     type="object",
 *     description="Resposta d'error estàndard de l'API",
 *     @OA\Property(
 *         property="success",
 *         type="boolean",
 *         example=false,
 *         description="Indica si l'operació ha estat exitosa"
 *     ),
 *     @OA\Property(
 *         property="message",
 *         type="string",
 *         example="Error en l'operació",
 *         description="Missatge d'error descriptiu"
 *     ),
 *     @OA\Property(
 *         property="errors",
 *         type="object",
 *         description="Objecte amb errors de validació (si n'hi ha)",
 *         example={
 *             "email": {"El camp email és obligatori"},
 *             "password": {"El camp password ha de tenir almenys 6 caràcters"}
 *         }
 *     )
 * )
 */
class Schemas {}
