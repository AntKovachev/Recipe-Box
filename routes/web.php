<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CollectionController;
use App\Http\Controllers\WeeklyDigestController;

Route::get('/', function () {
    return redirect()->route('recipes.index');
});

Route::get('/recipes', [RecipeController::class, 'index'])
    ->name('recipes.index');


Route::middleware('auth')->group(function () {
    Route::get('/recipes/create', [RecipeController::class, 'create'])
        ->name('recipes.create');

    Route::post('/recipes', [RecipeController::class, 'store'])
        ->name('recipes.store');

        Route::get('/collections', [CollectionController::class, 'index'])
            ->name('collections.index');

        Route::post('/collections', [CollectionController::class, 'store'])
            ->name('collections.store');

        Route::get('/collections/{collection}', [CollectionController::class, 'show'])
            ->name('collections.show');

        Route::delete('/collections/{collection}', [CollectionController::class, 'destroy'])
            ->name('collections.destroy');

        Route::post('/collections/{collection}/recipes/{recipe}', [
            CollectionController::class,
            'addRecipe',
        ])->name('collections.recipes.store');

        Route::delete('/collections/{collection}/recipes/{recipe}', [
            CollectionController::class,
            'removeRecipe',
        ])->name('collections.recipes.destroy');
        Route::get('/digests', [WeeklyDigestController::class, 'index'])
            ->name('digests.index');
});

Route::get('/recipes/{recipe:slug}', [RecipeController::class, 'show'])
    ->name('recipes.show');

Route::middleware('guest')->group(function () {
    Route::get('/register', [AuthController::class, 'showRegister'])
        ->name('register');

    Route::post('/register', [AuthController::class, 'register']);

    Route::get('/login', [AuthController::class, 'showLogin'])
        ->name('login');

    Route::post('/login', [AuthController::class, 'login']);
});

Route::post('/logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');
