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
        $attempt = $this->attempts();

        Log::info('Processing recipe', [
            'recipe_id' => $this->recipeId,
            'attempt' => $attempt,
        ]);

        //This should be commented out because it will fail the job immediately on sync
        // if ($attempt < 3) {
        //     throw new RuntimeException(
        //         "Intentional failure on attempt {$attempt}"
        //     );
        // }

        Log::info('Recipe processed successfully', [
            'recipe_id' => $this->recipeId,
        ]);
    }

}
