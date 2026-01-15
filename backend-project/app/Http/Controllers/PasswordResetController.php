<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash; // <-- AFEGEIX AQUESTA LINIA

class PasswordResetController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/forgot-password",
     *     operationId="forgotPassword",
     *     tags={"Autenticació"},
     *     summary="Sol·licitar reset de contrasenya",
     *     description="Envia un enllaç per a restablir la contrasenya",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Enllaç enviat",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Reset link sent")
     *         )
     *     )
     * )
     */
    public function send(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        
        $status = Password::sendResetLink(
            $request->only('email')
        );
        
        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }

    /**
     * @OA\Post(
     *     path="/api/reset-password",
     *     operationId="resetPassword",
     *     tags={"Autenticació"},
     *     summary="Restablir contrasenya",
     *     description="Restableix la contrasenya amb el token rebut per email",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","password","password_confirmation","token"},
     *             @OA\Property(property="email", type="string", format="email", example="user@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="newpassword123"),
     *             @OA\Property(property="password_confirmation", type="string", format="password", example="newpassword123"),
     *             @OA\Property(property="token", type="string", example="token_rebut_per_email")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contrasenya restablerta",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Password reset successfully")
     *         )
     *     )
     * )
     */
    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:6',
        ]);
        
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password) // <-- ARA FUNCIONARÀ
                ])->save();
            }
        );
        
        return $status === Password::PASSWORD_RESET
            ? response()->json(['message' => __($status)])
            : response()->json(['message' => __($status)], 400);
    }
}