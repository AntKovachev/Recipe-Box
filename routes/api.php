<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;
use Illuminate\Http\Request;

Route::get('/recipes', [RecipeController::class, 'apiIndex'])
    ->name('api.recipes.index');

Route::get('/mock/nutrition/{recipe}', function (int $recipe) {
    return response()->json([
        'recipe_id' => $recipe,
        'calories' => rand(100, 800),
        'protein' => rand(10, 50),
        'carbs' => rand(20, 100),
        'fat' => rand(5, 30),
    ]);
});

Route::middleware('auth:custom-api')
    ->get('/auth-test', function (Request $request) {
        return response()->json([
            'message' => 'Custom API authentication works!',
            'user' => $request->user(),
        ]);
    });
