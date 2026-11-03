<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\WeeklyDigest;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:generate-weekly-digests')]
#[Description('Generate weekly recipe digests for users')]
class GenerateWeeklyDigests extends Command
{
    public function handle(): int
    {
        User::with(['recipes', 'collections'])->each(function ($user) {
            $recentRecipes = $user->recipes()
                ->where('created_at', '>=', now()->subDays(7))
                ->latest()
                ->get(['id', 'title', 'slug', 'created_at']);

            $content = [
                'new_recipes_count' => $recentRecipes->count(),
                'collections_count' => $user->collections->count(),
                'total_recipes_count' => $user->recipes->count(),
                'recent_recipes' => $recentRecipes,
            ];

            WeeklyDigest::create([
                'user_id' => $user->id,
                'content' => $content,
            ]);
        });

        $this->info('Weekly digests generated successfully.');

        return self::SUCCESS;
    }
}
