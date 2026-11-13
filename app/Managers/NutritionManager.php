<?php

namespace App\Managers;

use App\Managers\AbstractManager;
use App\Managers\Contracts\NutritionManagerInterface;
use App\Models\Recipe;

class NutritionManager extends AbstractManager implements NutritionManagerInterface
{
    public function fetchAndCache(Recipe $recipe): void
    {
        $this->remember(
            "recipe:{$recipe->id}:nutrition",
            fn() => $this->get("/api/mock/nutrition/{$recipe->id}")
        );
    }
}
