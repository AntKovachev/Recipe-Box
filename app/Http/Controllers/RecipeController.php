<?php

namespace App\Http\Controllers;

use App\Http\Requests\RecipeRequest;
use App\Http\Resources\RecipeResource;
use App\Jobs\ProcessRecipeJob;
use App\Models\Collection;
use App\Models\Recipe;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Cache;

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

        $filters = $request->only(['search', 'collection', 'page']);

        $userId = $user?->id ?? 'guest';

        $cacheKey = 'recipes.index.user.' . $userId . '.' . md5(
            http_build_query($filters)
        );

        $recipes = Cache::store('redis')
            ->tags(['recipes'])
            ->remember($cacheKey, now()->addMinutes(5), function () use ($request, $user) {
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
               
                return $recipes->toArray();
            });

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

        // ProcessRecipeJob::dispatch($recipe->id); This is for async
        ProcessRecipeJob::dispatch($recipe->id);

        return redirect()->route('recipes.index')
            ->with('success', 'Recipe created successfully');
    }

    public function apiIndex(): AnonymousResourceCollection
    {
        return RecipeResource::collection(
            Recipe::query()
                ->with('user:id,name')
                ->latest()
                ->paginate(10)
        );
    }
}
