<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

#[Fillable([
    'title',
    'slug',
    'description',
    'image_path',
    'instructions',
    'prep_time',
    'cook_time',
    'servings',
    'user_id'
])]
class Recipe extends Model implements HasMedia
{
    use InteractsWithMedia;
   
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(Collection::class)
            ->withTimestamps();
    }
}
