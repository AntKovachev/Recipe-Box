<?php

namespace App\Repositories;

use App\Models\Recipe;
use App\Repositories\Contracts\RecipeRepositoryInterface;

class RecipeRepository implements RecipeRepositoryInterface
{
    public function create(array $data): Recipe
    {
        return Recipe::query()->create($data);
    }
}
