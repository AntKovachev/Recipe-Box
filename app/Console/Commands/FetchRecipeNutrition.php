<?php

namespace App\Console\Commands;

use App\Jobs\FetchRecipeNutritionJob;
use Illuminate\Console\Command;

class FetchRecipeNutrition extends Command
{
    protected $signature = 'recipes:fetch-nutrition';

    protected $description = 'Fetch nutrition data for recipes';

    public function handle(): int
    {
        FetchRecipeNutritionJob::dispatch();

        return self::SUCCESS;
    }
}
