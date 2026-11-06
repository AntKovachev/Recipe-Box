<?php

namespace App\Repositories\Contracts;

use App\Models\Recipe;

interface RecipeRepositoryInterface
{
    public function create(array $data): Recipe;
}
