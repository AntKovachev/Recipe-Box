<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecipeController;
use App\Http\Controllers\AuthController;

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