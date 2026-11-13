<?php

namespace App\Jobs;

use App\Managers\NutritionManager;
use App\Models\Recipe;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class FetchRecipeNutritionJob implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        $manager = NutritionManager::make();

        $recipes = Recipe::cursor();

        foreach ($recipes as $recipe) {
            $manager->fetchAndCache($recipe);
        }
    }
}
