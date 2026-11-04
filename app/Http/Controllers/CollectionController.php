<?php

namespace App\Http\Controllers;

use App\Enums\CollectionType;
use App\Http\Requests\CollectionRequest;
use App\Models\Collection;
use App\Models\Recipe;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Resources\CollectionResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Routing\Controller as BaseController;

class CollectionController extends BaseController
{
        use AuthorizesRequests;

    /**
     * Display the user's collections.
     */
    public function index(): Response
    {
        $collections = Collection::query()
            ->where('user_id', auth()->id())
            ->withCount('recipes')
            ->latest()
            ->get();

        return Inertia::render('Collections/Index', [
            'collections' => CollectionResource::collection($collections),
            'collectionTypes' => collect(CollectionType::cases())
                ->map(fn (CollectionType $type) => [
                    'value' => $type->value,
                    'label' => $type->label(),
                ])
                ->values(),
        ]);
    }

    /**
     * Display a collection and its recipes.
     */
    public function show(Collection $collection): Response
    {
        $this->authorize('view', $collection);

        $collection->load('recipes.user:id,name');

        return Inertia::render('Collections/Show', [
            'collection' => new CollectionResource($collection),
        ]);
    }

    /**
     * Create a collection.
     */
    public function store(CollectionRequest $request): RedirectResponse
    {
        Collection::query()->create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('collections.index')
            ->with('success', 'Collection created successfully.');
    }

    /**
     * Delete a collection.
     */
    public function destroy(Collection $collection): RedirectResponse
    {
        $this->authorize('delete', $collection);

        $collection->delete();

        return redirect()->route('collections.index');
    }

    /**
     * Add a recipe to a collection.
     */
    public function addRecipe(Collection $collection, Recipe $recipe): RedirectResponse
    {
        $this->authorize('addRecipe', $collection);

        DB::table('collection_recipe')->insertOrIgnore([
            'collection_id' => $collection->id,
            'recipe_id' => $recipe->id,
        ]);

        return back()->with('success', 'Recipe added to collection.');
    }

    /**
     * Remove a recipe from a collection.
     */
    public function removeRecipe(Collection $collection, Recipe $recipe): RedirectResponse
    {
        $this->authorize('removeRecipe', $collection);

        DB::table('collection_recipe')
            ->where('collection_id', $collection->id)
            ->where('recipe_id', $recipe->id)
            ->delete();

        return back()->with('success', 'Recipe removed from collection.');
    }
}
