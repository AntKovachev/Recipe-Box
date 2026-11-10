<?php

namespace App\Nova;

use App\Nova\Actions\UpdateCookTime;
use Laravel\Nova\Cards\Help;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\BelongsTo;
use Laravel\Nova\Fields\BelongsToMany;
use DmitryBubyakin\NovaMedialibraryField\Fields\Medialibrary;
use Laravel\Nova\Fields\MorphMany;
use App\Nova\Actions\UpdateRecipeServings;
use App\Nova\Filters\RecipeCookTime;
use App\Nova\Filters\RecipeServingSize;
use App\Nova\Metrics\TotalRecipes;
use App\Nova\Metrics\QuickRecipes;
use App\Nova\Metrics\RecipesCreatedOverTime;
class Recipe extends Resource
{

    /**
     * The model the resource corresponds to.
     *
     * @var class-string<\App\Models\Recipe>
     */
    public static $model = \App\Models\Recipe::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'title';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id',
        'title',
        'description'
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @return array<int, \Laravel\Nova\Fields\Field>
     */
    public function fields(NovaRequest $request): array
    {
        return [
            ID::make()->sortable(),

            Text::make('Title')
                ->sortable()
                ->rules('required', 'max:255'),

            Text::make('Slug')
                ->sortable()
                ->rules('required', 'max:255'),

            Textarea::make('Description')
                ->rules('nullable', 'string'),

            Textarea::make('Instructions')
                ->rules('nullable', 'string'),

            Number::make('Prep Time')
                ->rules('nullable', 'integer', 'min:0'),

            Number::make('Cook Time')
                ->rules('nullable', 'integer', 'min:0'),

            Number::make('Servings')
                ->rules('nullable', 'integer', 'min:1'),

            BelongsTo::make('User')
                ->searchable()
                ->rules('required'),

            BelongsToMany::make('Collections'),

            Medialibrary::make('Recipe image', 'recipe-images')
                ->accept('image/*')
                ->maxSizeInBytes(5 * 1024 * 1024)
                ->mediaOnIndex(1),

            MorphMany::make('Media', 'media', Media::class),   
        ];
    }

    /**
     * Get the cards available for the resource.
     *
     * @return array<int, \Laravel\Nova\Card>
     */
    public function cards(NovaRequest $request): array
    {
        return [
            new TotalRecipes(),
            new QuickRecipes(),
            new RecipesCreatedOverTime()
        ];
    }

    /**
     * Get the filters available for the resource.
     *
     * @return array<int, \Laravel\Nova\Filters\Filter>
     */
    public function filters(NovaRequest $request): array
    {
        return [
            new RecipeCookTime(),
            new RecipeServingSize()
        ];
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
        return [
            new UpdateRecipeServings(),
            new UpdateCookTime()
        ];
    }
}
