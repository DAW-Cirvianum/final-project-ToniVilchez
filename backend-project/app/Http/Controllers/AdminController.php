<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    
    public function getUsers()
{
    $users = User::select('id', 'name', 'email', 'role', 'language', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();
    
    return response()->json([
        'success' => true,
        'data' => $users
    ]);
}

    public function updateUserRole(Request $request, $userId)
    {
        $request->validate([
            'role' => 'required|in:user,admin'
        ]);

        $user = User::findOrFail($userId);
        
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes cambiar tu propio rol'
            ], 403);
        }

        $user->update(['role' => $request->role]);

        return response()->json([
            'success' => true,
            'message' => 'Rol actualizado correctamente',
            'data' => $user
        ]);
    }

    public function toggleUserStatus($userId)
    {
        $user = User::findOrFail($userId);
        
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes desactivarte a ti mismo'
            ], 403);
        }

        $user->update(['is_active' => !$user->is_active]);

        return response()->json([
            'success' => true,
            'message' => 'Estado actualizado correctamente',
            'data' => [
                'id' => $user->id,
                'is_active' => $user->is_active
            ]
        ]);
    }

    public function deleteUser($userId)
    {
        $user = User::findOrFail($userId);
        
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes eliminarte a ti mismo'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Usuario eliminado correctamente'
        ]);
    }

    
    public function createCategory(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name',
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50'
        ]);

        $category = Category::create([
            'name' => $request->name,
            'color' => $request->color ?? '#3B82F6',
            'icon' => $request->icon ?? 'fa-folder',
            'user_id' => auth()->id()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Categoría creada correctamente',
            'data' => $category
        ]);
    }

    public function updateCategory(Request $request, $categoryId)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $categoryId,
            'color' => 'nullable|string|max:7',
            'icon' => 'nullable|string|max:50'
        ]);

        $category = Category::findOrFail($categoryId);
        $category->update($request->only(['name', 'color', 'icon']));

        return response()->json([
            'success' => true,
            'message' => 'Categoría actualizada correctamente',
            'data' => $category
        ]);
    }

    public function deleteCategory($categoryId)
    {
        $category = Category::findOrFail($categoryId);
        
        if ($category->is_default) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar una categoría predeterminada'
            ], 400);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Categoría eliminada correctamente'
        ]);
    }

    public function toggleDefaultCategory($categoryId)
    {
        $category = Category::findOrFail($categoryId);
        
        if ($category->is_default) {
            $category->update(['is_default' => false]);
            $message = 'Categoría quitada como predeterminada';
        } else {
            Category::where('is_default', true)->update(['is_default' => false]);
            $category->update(['is_default' => true]);
            $message = 'Categoría marcada como predeterminada';
        }

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $category
        ]);
    }
}