<?php

namespace App\Providers;

use App\Repositories\Contracts\RecipeRepositoryInterface;
use App\Repositories\RecipeRepository;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;
use App\Services\OctaneStateTest;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            RecipeRepositoryInterface::class,
            RecipeRepository::class
        );

        $this->app->scoped(OctaneStateTest::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();
    }
}
