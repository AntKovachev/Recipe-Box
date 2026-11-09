<?php

namespace App\Services;

use App\Models\Recipe;

class RecipeStatsService
{
    public function totalRecipes(): int
    {
        return Recipe::query()->count();
    }
}
