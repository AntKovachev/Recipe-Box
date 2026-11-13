<?php

namespace App\Managers\Contracts;

use App\Models\Recipe;

interface NutritionManagerInterface
{
    public function fetchAndCache(Recipe $recipe): void;
}
