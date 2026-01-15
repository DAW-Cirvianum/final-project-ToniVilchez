<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Word;
use Illuminate\Http\Request;

class WordController extends Controller
{
    public function store(Request $request, Category $category)
    {
        $request->validate([
            'text' => 'required|string|max:255'
        ]);

        $word = $category->words()->create($request->only('text'));

        return response()->json([
            'success' => true,
            'message' => 'Palabra añadida correctamente',
            'data' => $word
        ], 201);
    }

    public function destroy(Word $word)
    {
        $word->delete();

        return response()->json([
            'success' => true,
            'message' => 'Palabra eliminada correctamente'
        ]);
    }
}
