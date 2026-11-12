<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;

class ExternalApiClient
{
    public function getPost(int $id): array
    {
        $response = Http::baseUrl(
            config('services.external_api.url')
        )
            ->acceptJson()
            ->timeout(config('services.external_api.timeout'))
            ->get("/posts/{$id}");

        $response->throw();

        return $response->json();
    }
}
