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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Sanctum\PersonalAccessToken;
use App\Models\User;

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

        Auth::viaRequest('custom-api', function (Request $request) {
            $bearerToken = $request->bearerToken();

            if (! $bearerToken) {
                return null;
            }

            $accessToken = PersonalAccessToken::findToken($bearerToken);

            if (! $accessToken) {
                return null;
            }

            $expiration = config('sanctum.expiration');

            if (
                ($expiration !== null &&
                    $accessToken->created_at->lte(now()->subMinutes($expiration)))
                || $accessToken->expires_at?->isPast()
            ) {
                return null;
            }

            $user = $accessToken->tokenable;

            if (! $user instanceof \App\Models\User) {
                return null;
            }

            if (config('auth.providers.'.config('auth.guards.custom-api.provider').'.model') !== \App\Models\User::class) {
                return null;
            }

            return $user->withAccessToken($accessToken);
        });
    }
}
