<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\Heading;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Http\Requests\NovaRequest;

class WeeklyDigest extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\WeeklyDigest>
     */
    public static $model = \App\Models\WeeklyDigest::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'id';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id',
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @return array<int, \Laravel\Nova\Fields\Field>
     */
    public function fields(NovaRequest $request): array
    {
        return [
            Heading::make('Woohooo'),

            Number::make('New Recipes', function() {
                return $this->content['new_recipes_count'] ?? 0;
            }),

            Number::make('Collections', function() {
                return $this->content['collections_count'] ?? 0;
            }),

            Number::make('Total Recipes', function() {
                return $this->content['total_recipes_count'] ?? 0;
            }),

            Heading::make('Recent Recipes')
                ->onlyOnDetail(),

            Text::make('Recent Recipes', function () {
                $recipes = $this->content['recent_recipes'] ?? [];

                if (empty($recipes)) {
                    return 'No recent recipes.';
                }

                $rows = collect($recipes)->map(function ($recipe) {
                    $title = e($recipe['title'] ?? 'Untitled');

                    $date = isset($recipe['created_at'])
                        ? \Carbon\Carbon::parse($recipe['created_at'])
                            ->format('M d, Y H:i')
                        : 'N/A';

                    return "
                        <tr>
                            <td class='px-4 py-3 border-b'>{$title}</td>
                            <td class='px-4 py-3 border-b'>{$date}</td>
                        </tr>
                    ";
                })->implode('');

                return "
                    <table class='w-full text-left border-collapse'>
                        <thead>
                            <tr>
                                <th class='px-4 py-3 border-b'>Recipe</th>
                                <th class='px-4 py-3 border-b'>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {$rows}
                        </tbody>
                    </table>
                ";
            })
                ->asHtml()
                ->onlyOnDetail(),
        ];
    }

    /**
     * Get the cards available for the resource.
     *
     * @return array<int, \Laravel\Nova\Card>
     */
    public function cards(NovaRequest $request): array
    {
        return [];
    }

    /**
     * Get the filters available for the resource.
     *
     * @return array<int, \Laravel\Nova\Filters\Filter>
     */
    public function filters(NovaRequest $request): array
    {
        return [];
    }

    /**
     * Get the lenses available for the resource.
     *
     * @return array<int, \Laravel\Nova\Lenses\Lens>
     */
    public function lenses(NovaRequest $request): array
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @return array<int, \Laravel\Nova\Actions\Action>
     */
    public function actions(NovaRequest $request): array
    {
        return [];
    }

    public static function authorizedToCreate(Request $request): bool
    {
        return false;
    }

    public function authorizedToUpdate(Request $request): bool
    {
        return false;
    }

    public function authorizedToDelete(Request $request): bool
    {
        return false;
    }

    public function authorizedToReplicate(Request $request): bool
    {
        return false;
    }
}
