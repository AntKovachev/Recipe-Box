<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecipeRequest;
use App\Http\Resources\RecipeResource;
use App\Models\Collection;
use App\Models\Recipe;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RecipeController extends Controller
{
    /**
     * Display all recipes.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        $collections = $user
            ? Collection::query()
                ->where('user_id', $user->id)
                ->get(['id', 'name'])
            : collect();

        $query = Recipe::query()
            ->with('user:id,name')
            ->latest();

        if ($request->filled('search')) {
            $query->search($request->input('search'));
        }

        if ($request->filled('collection') && $user) {
            $collectionId = $request->input('collection');

            $query->whereHas('collections', function (Builder $query) use ($collectionId, $user) {
                $query->where('collections.id', $collectionId)
                    ->where('collections.user_id', $user->id);
            });
        }

        $recipes = $query->paginate(10)->withQueryString();

        $recipes->through(
            fn ($recipe) => (new RecipeResource($recipe))->resolve()
        );

        return Inertia::render('Recipes/Index', [
            'recipes' => $recipes,
            'collections' => $collections,
            'selectedCollection' => $request->input('collection'),
            'search' => $request->input('search', ''),
        ]);
    }

    /**
     * Display a recipe.
     */
    public function show(Recipe $recipe): Response
    {
        $user = auth()->user();

        $recipe->load('user:id,name');

        $collections = $user
            ? Collection::query()
                ->where('user_id', $user->id)
                ->get(['id', 'name'])
            : collect();

        $recipeCollections = $user
            ? Collection::query()
                ->where('user_id', $user->id)
                ->whereHas('recipes', function (Builder $query) use ($recipe) {
                    $query->where('recipes.id', $recipe->id);
                })
                ->get(['id', 'name'])
            : collect();

        return Inertia::render('Recipes/Show', [
            'recipe' => new RecipeResource($recipe),
            'collections' => $collections,
            'recipeCollections' => $recipeCollections,
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

        $image = $validated['image'] ?? null;
        unset($validated['image']);
        
        $recipe = Recipe::query()->create([
            ...$validated,
            'user_id' => $request->user()->id,
            'slug' => Str::slug($validated['title']) . '-' . Str::random(6),
        ]);

        if ($image) {
            $recipe
                ->addMedia($image)
                ->toMediaCollection('recipe-images');
        }

        return redirect()->route('recipes.index')
            ->with('success', 'Recipe created successfully');
    }
}
