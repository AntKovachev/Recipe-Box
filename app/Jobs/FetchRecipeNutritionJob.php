<?php

namespace App\Jobs;

use App\Models\Recipe;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class FetchRecipeNutritionJob implements ShouldQueue
{
    use Queueable;
    use Batchable;

    public function __construct(
        public int $recipeId
    ) {}

    public function handle(): void
    {
        $recipe = Recipe::findOrFail($this->recipeId);

        $response = Http::timeout(10)
            ->get(
                config('app.url') . "/api/mock/nutrition/{$recipe->id}"
            );

        $response->throw();

        Cache::put(
            "recipe:{$recipe->id}:nutrition",
            $response->json(),
            now()->addDay()
        );
    }
}
