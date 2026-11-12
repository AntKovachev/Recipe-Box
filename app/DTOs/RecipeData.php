<?php

namespace App\DTOs;

class RecipeData
{
    public function __construct(
        public string $title,
        public int $servings,
        public int $prepTime,
    ) {}
}
