<?php

namespace App\Nova\Filters;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Laravel\Nova\Filters\Filter;
use Laravel\Nova\Http\Requests\NovaRequest;

class RecipeServingSize extends Filter
{
    public $name = 'How hungry are you';

    /**
     * Apply the filter to the given query.
     */
    public function apply(NovaRequest $request, Builder $query, mixed $value): Builder
    {
        return match ($value) {
            'a little' => $query->where('servings', '<=', 2),
            'medium' => $query->where('servings', [3, 5]),
            'a lot' => $query->where('servings', '>', 5),

            default => $query,
        };
    }

    /**
     * Get the filter's available options.
     *
     * @return array<string, string>
     */
    public function options(NovaRequest $request): array
    {
        return [
            'not so much' => 'a little',
            'pretty hungry' => 'medium',
            'I WILL EAT A HORSE' => 'a lot'
        ];
    }
}
