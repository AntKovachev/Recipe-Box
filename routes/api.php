<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;

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
