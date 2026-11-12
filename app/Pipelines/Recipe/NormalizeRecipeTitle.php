<?php

namespace App\Pipelines\Recipe;

use App\DTOs\RecipeData;
use Closure;

class NormalizeRecipeTitle
{
    public function handle(RecipeData $recipe, Closure $next): RecipeData
    {
        $recipe->title = mb_convert_case(
            $recipe->title,
            MB_CASE_TITLE,
            'UTF-8'
        );

        return $next($recipe);
    }
}
