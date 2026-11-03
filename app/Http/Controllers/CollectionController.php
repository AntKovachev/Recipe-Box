<?php

namespace App\Http\Controllers;

use App\Http\Requests\CollectionRequest;
use App\Models\Collection;
use App\Models\Recipe;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CollectionController extends Controller
{
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
            'collections' => $collections,
        ]);
    }

    /**
     * Display a collection and its recipes.
     */
    public function show(Collection $collection): Response
    {
        abort_unless($collection->user_id === auth()->id(), 403);

        $collection->load('recipes.user:id,name');

        return Inertia::render('Collections/Show', [
            'collection' => $collection,
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
        abort_unless($collection->user_id === auth()->id(), 403);

        $collection->delete();

        return redirect()->route('collections.index');
    }

    /**
     * Add a recipe to a collection.
     */
    public function addRecipe(Collection $collection, Recipe $recipe): RedirectResponse
    {
        abort_unless($collection->user_id === auth()->id(), 403);

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
        abort_unless($collection->user_id === auth()->id(), 403);

        DB::table('collection_recipe')
            ->where('collection_id', $collection->id)
            ->where('recipe_id', $recipe->id)
            ->delete();

        return back()->with('success', 'Recipe removed from collection.');
    }
}
