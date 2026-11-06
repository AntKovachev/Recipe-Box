<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use RuntimeException;


class ProcessRecipeJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 5;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $recipeId
    ) {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::info('Recipe job started', [
            'recipe_id' => $this->recipeId,
            'attempt' => $this->attempts(),
        ]);

        sleep(10);

        Log::info('Recipe job completed', [
            'recipe_id' => $this->recipeId,
        ]);
    }

}
