<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;
use Spatie\Translatable\HasTranslations;

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
class Recipe extends Model implements HasMedia, Sortable
{
    use InteractsWithMedia;
    use SortableTrait;
    use HasTranslations;
   
    public $sortable = [
        'order_column_name' => 'sort_order',
        'sort_when_creating' => true,
    ];
    public $translatable = [
        'title',
        'description',
        'instructions',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function collections(): BelongsToMany
    {
        return $this->belongsToMany(Collection::class)
            ->withTimestamps();
    }

    #[Scope]
    protected function search(Builder $query, string $search): Builder
    {
        $locale = app()->getLocale();

        return $query->where(function (Builder $query) use ($search, $locale) {
            $query->whereRaw(
                "title->>? ILIKE ?",
                [$locale, "%{$search}%"]
            )->orWhereRaw(
                "description->>? ILIKE ?",
                [$locale, "%{$search}%"]
            );
        });
    }

    protected function casts(): array
    {
        return [
            'ingredients' => 'array'
        ];
    }
}
