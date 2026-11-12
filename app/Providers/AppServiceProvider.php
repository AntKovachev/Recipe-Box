<?php

namespace App\Providers;

use App\Models\Recipe;
use App\Observers\RecipeObserver;
use App\Repositories\Contracts\RecipeRepositoryInterface;
use App\Repositories\RecipeRepository;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\ServiceProvider;
use App\Services\OctaneStateTest;
use App\Services\RecipeStatsService;
use Spatie\Health\Facades\Health;
use Spatie\Health\Checks\Checks\DatabaseCheck;
use Spatie\Health\Checks\Checks\CacheCheck;
use Spatie\Health\Checks\Checks\UsedDiskSpaceCheck;

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

        $this->app->singleton(
            RecipeStatsService::class,
            fn () => new RecipeStatsService()
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        JsonResource::withoutWrapping();

        Recipe::observe(RecipeObserver::class);

        Health::checks([
            DatabaseCheck::new(), //Can Laravel connect to DB
            CacheCheck::new(), //Can Laravel write/read to/from cache
            UsedDiskSpaceCheck::new() //Check how much disk space is used
        ]);
    }
}
