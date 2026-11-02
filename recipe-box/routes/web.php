<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;

Route::get('/', function () {
    return redirect()->route('recipes.index');
});

Route::get('/recipes', [RecipeController::class, 'index'])
    ->name('recipes.index');

Route::get('/recipes/{recipe:slug}', [RecipeController::class, 'show'])
    ->name('recipes.show');