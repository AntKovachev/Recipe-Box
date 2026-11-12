<?php

namespace App\Pipelines\Recipe;

use App\DTOs\RecipeData;
use Closure;

class TrimRecipeTitle
{
    public function handle(RecipeData $recipe, Closure $next): RecipeData
    {
        $recipe->title = trim($recipe->title);

        return $next($recipe);
    }
}
