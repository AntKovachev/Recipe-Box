<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecipeRequest;
use App\Models\Recipe;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;


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

    /**
     * Display the recipe creation form.
     */
    public function create(): Response
    {
        return Inertia::render('Recipes/Create');
    }

    /**
     * Store a newly created recipe.
     */
    public function store(RecipeRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $request->user()->recipes()->create([
            ...$validated,
            'slug' => Str::slug($validated['title']) . '-' . Str::random(6),
        ]);

        return redirect()->route('recipes.index');
    }
}
