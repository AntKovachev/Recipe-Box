<?php

namespace App\Console\Commands;

use App\Jobs\FetchRecipeNutritionJob;
use App\Models\Recipe;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Bus;

class FetchRecipeNutrition extends Command
{
    protected $signature = 'recipes:fetch-nutrition';

    protected $description = 'Fetch nutrition data for recipes';

    public function handle(): int
    {
        Recipe::query()
            ->chunkById(10, function ($recipes) {
                $jobs = [];

                foreach ($recipes as $recipe) {
                    $jobs[] = new FetchRecipeNutritionJob(
                        $recipe->id
                    );
                }

                Bus::batch($jobs)
                    ->name('Fetch Recipe Nutrition')
                    ->dispatch();
            });

        return self::SUCCESS;
    }
}
