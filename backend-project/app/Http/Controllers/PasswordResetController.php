<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;

class PasswordResetController extends Controller
{
    public function send(Request $request)
{
    $request->validate([
        'email' => 'required|email|exists:users,email'
    ]);
    
    try {
        $user = User::where('email', $request->email)->first();
        
        $token = Str::random(60);
        
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => Hash::make($token),
                'created_at' => now()
            ]
        );
        
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $resetUrl = $frontendUrl . "/reset-password?token=" . $token . "&email=" . urlencode($user->email);
        
        \Log::info('Reset URL generated: ' . $resetUrl);
        
        \Mail::send([], [], function ($message) use ($user, $resetUrl) {
            $message->to($user->email)
                    ->subject('Password Reset - Impostor Game')
                    ->html("
                        <h3>Password Reset</h3>
                        <p>Click here to reset your password:</p>
                        <p><a href='$resetUrl' style='display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;'>Reset Password</a></p>
                        <p>Or copy this link:</p>
                        <p><code>$resetUrl</code></p>
                        <p>This link expires in 60 minutes.</p>
                    ");
        });
        
        return response()->json([
            'success' => true,
            'message' => 'Password reset link sent to your email.',
            'debug_url' => $resetUrl
        ], 200);
        
    } catch (\Exception $e) {
        \Log::error('Error sending password reset: ' . $e->getMessage());
        
        return response()->json([
            'success' => false,
            'message' => 'Error sending reset link. Please try again later.',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required|string',
            'email' => 'required|email|exists:users,email',
            'password' => 'required|confirmed|min:6',
        ]);
        
        try {
            $record = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->first();

            if (!$record) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired token.'
                ], 400);
            }

            if (!Hash::check($request->token, $record->token)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired token.'
                ], 400);
            }

            $expiredAt = now()->subMinutes(60);
            if ($record->created_at < $expiredAt) {
                DB::table('password_reset_tokens')->where('email', $request->email)->delete();
                
                return response()->json([
                    'success' => false,
                    'message' => 'Token has expired. Please request a new reset link.'
                ], 400);
            }

            $user = User::where('email', $request->email)->first();
            $user->password = Hash::make($request->password);
            $user->save();

            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            $user->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Password updated successfully.'
            ], 200);

        } catch (\Exception $e) {
            \Log::error('Error resetting password: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error resetting password.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}