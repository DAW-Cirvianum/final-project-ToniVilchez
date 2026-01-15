<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoryController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        if ($user->role === 'admin') {
            $categories = Category::withCount('words')
                ->with('user:id,name')
                ->get();
        } else {
            $categories = Category::withCount('words')
                ->with('user:id,name')
                ->where(function($query) use ($user) {
                    $query->where('user_id', $user->id)
                          ->orWhere('is_default', true);
                })
                ->get();
        }

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:3|max:255',
            'description' => 'nullable|string|max:500'
        ]);

        $category = Category::create([
            'name' => $request->name,
            'description' => $request->description,
            'user_id' => Auth::id(),
            'is_default' => false
        ]);

        return response()->json([
            'success' => true,
            'data' => $category->loadCount('words'),
            'message' => 'Categoría creada exitosamente'
        ], 201);
    }

    public function show(Category $category)
    {
        if ($category->user_id && $category->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes acceso a esta categoría'
            ], 403);
        }

        $category->load(['words', 'user:id,name']);

        return response()->json([
            'success' => true,
            'data' => $category
        ]);
    }

    public function update(Request $request, Category $category)
    {
        if ($category->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para editar esta categoría'
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|min:3|max:255',
            'description' => 'nullable|string|max:500'
        ]);

        $category->update([
            'name' => $request->name,
            'description' => $request->description
        ]);

        return response()->json([
            'success' => true,
            'data' => $category->loadCount('words'),
            'message' => 'Categoría actualizada exitosamente'
        ]);
    }

    public function destroy(Category $category)
    {
        if ($category->user_id !== Auth::id() && !Auth::user()->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para eliminar esta categoría'
            ], 403);
        }

        if ($category->is_default) {
            return response()->json([
                'success' => false,
                'message' => 'No se puede eliminar una categoría predeterminada'
            ], 403);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Categoría eliminada exitosamente'
        ]);
    }
}
