<?php

namespace App\Facades;

use App\Services\RecipeStatsService;
use Illuminate\Support\Facades\Facade;

class RecipeStats extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return RecipeStatsService::class;
    }
}
