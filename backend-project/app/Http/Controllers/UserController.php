<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'language' => 'sometimes|in:ca,es,en'

        ]);

        $user->update($request->only(['name', 'email', 'language']));

        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado correctamente',
            'data' => $user
        ]);
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|max:5120',
        ]);

        $user = Auth::user();
        
        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        
        $user->update([
            'avatar_path' => $path,
            'avatar_url' => Storage::url($path)
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Avatar actualizado correctamente',
            'data' => $user
        ]);
    }
}
