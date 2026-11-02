<?php

namespace App\Http\Controllers;

use App\Models\Recipe;
use Inertia\Inertia;
use Inertia\Response;

class RecipeController extends Controller
{
    /**
     * Display all public recipes.
     */
    public function index(): Response
    {
        $recipes = Recipe::with('user:id,name')
            ->latest()
            ->paginate(10);
        
        return Inertia::render('Recipes/Index', [
            'recipes' => $recipes,
        ]);
    }

    /**
     * Display a single recipe.
     */
    public function show(Recipe $recipe): Response
    {
        $recipe->load('user:id,name');

        return Inertia::render('Recipes/Show', [
            'recipe' => $recipe,
        ]);
    }
}