<?php

namespace App\Observers;

use App\Models\Recipe;
use Illuminate\Contracts\Events\ShouldHandleEventsAfterCommit;
use Illuminate\Support\Facades\Mail;
use App\Mail\RecipeCreated;



class RecipeObserver implements ShouldHandleEventsAfterCommit
{
    /**
     * Handle the Recipe "created" event.
     */
    public function created(Recipe $recipe): void
    {
        $recipe->loadMissing('user');

        if (! $recipe->user?->email) {
            return;
        }

        Mail::to($recipe->user->email)
            ->queue(new RecipeCreated($recipe));
    }
}
