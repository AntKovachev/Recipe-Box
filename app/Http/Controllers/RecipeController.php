<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecipeRequest;
use App\Models\Recipe;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Http\Request;



class RecipeController extends Controller
{
    
    public function index(Request $request): Response
    {
        $collections = auth()->check()
            ? auth()->user()->collections()->get(['id', 'name'])
            : collect();

        $query = Recipe::with('user:id,name')
            ->latest();

        if ($request->filled('search')) {
            $search = $request->input('search');

            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                ->orWhere('description', 'ilike', "%{$search}%");
            });
        }

        if ($request->filled('collection') && auth()->check()) {
            $collectionId = $request->input('collection');

            $query->whereHas('collections', function ($q) use ($collectionId) {
                $q->where('collections.id', $collectionId)
                ->where('collections.user_id', auth()->id());
            });
        }

        return Inertia::render('Recipes/Index', [
            'recipes' => $query->paginate(10)->withQueryString(),
            'collections' => $collections,
            'selectedCollection' => $request->input('collection'),
            'search' => $request->input('search', ''),
        ]);
    }

    
    public function show(Recipe $recipe): Response
    {
        $recipe->load('user:id,name');

        $collections = auth()->check()
            ? auth()->user()->collections()->get(['id', 'name'])
            : collect();

        $recipeCollections = auth()->check()
            ? $recipe->collections()
                ->where('collections.user_id', auth()->id())
                ->get(['collections.id', 'collections.name'])
            : collect();

        return Inertia::render('Recipes/Show', [
            'recipe' => $recipe,
            'collections' => $collections,
            'recipeCollections' => $recipeCollections,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Recipes/Create');
    }

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
