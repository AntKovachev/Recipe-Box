<?php

namespace App\Services;

use App\Jobs\ProcessRecipeJob;
use App\Mail\RecipeCreated;
use App\Models\Recipe;
use App\Models\User;
use App\Repositories\Contracts\RecipeRepositoryInterface;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class RecipeService
{
    public function __construct(
        private RecipeRepositoryInterface $recipeRepository
    ) {}

    public function create(array $data, User $user): Recipe
    {
        $image = $data['image'] ?? null;
        unset($data['image']);

        $recipe = $this->recipeRepository->create([
            ...$data,
            'user_id' => $user->id,
            'slug' => Str::slug($data['title'] . '-' . Str::random(6))
        ]);

        if ($image) {
            $recipe
                ->addMedia($image)
                ->toMediaCollection('recipe-images');
        }

        ProcessRecipeJob::dispatch($recipe->id);

        Mail::to($user->email)->send(
            new RecipeCreated($recipe)
        );

        return $recipe;
    }
}
