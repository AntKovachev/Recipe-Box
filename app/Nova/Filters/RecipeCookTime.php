<?php

namespace App\Nova\Filters;

use Illuminate\Contracts\Database\Eloquent\Builder;
use Laravel\Nova\Filters\Filter;
use Laravel\Nova\Http\Requests\NovaRequest;

class RecipeCookTime extends Filter
{
    public $name = 'How much time are you willing to spend cooking';

    /**
     * Apply the filter to the given query.
     */
    public function apply(NovaRequest $request, Builder $query, mixed $value): Builder
    {
        return match ($value) {
            'quick' => $query->where('cook_time', '<=', 30),
            'medium' => $query->where('cook_time', [31, 60]),
            'long' => $query->where('cook_time', '>', 60),

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
            '30 minutes or less' => 'quick',
            '31-60 minutes' => 'medium',
            'More than 60 minutes' => 'long'
        ];
    }
}
