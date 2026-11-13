<?php

namespace App\Managers;

use Closure;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

abstract class AbstractManager
{
    public function __construct(
        protected string $baseUrl,
    ) {}

    public static function make(): static
    {
        return new static(config('app.url'));
    }

    protected function get(string $endpoint): array
    {
        return Http::baseUrl($this->baseUrl)
            ->timeout(10)
            ->get($endpoint)
            ->throw()
            ->json();
    }

    protected function remember(
        string $key,
        Closure $callback
    ): array {
        return Cache::remember(
            $key,
            now()->addDay(),
            $callback
        );
    }
}
