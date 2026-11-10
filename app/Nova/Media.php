<?php

namespace App\Nova;

use Illuminate\Http\Request;
use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\MorphTo;
use Laravel\Nova\Http\Requests\NovaRequest;

class Media extends Resource
{
    public static $model =
        \Spatie\MediaLibrary\MediaCollections\Models\Media::class;

    public static $title = 'file_name';

    public static $search = [
        'id',
        'file_name',
    ];

    public static $displayInNavigation = false;

    public function fields(NovaRequest $request): array
    {
        return [
            ID::make()->sortable(),

            Text::make('File Name', 'file_name')
                ->readonly(),

            Text::make('Collection Name', 'collection_name')
                ->readonly(),

            Text::make('Mime Type', 'mime_type')
                ->readonly(),

            MorphTo::make('Model', 'model')
                ->types([
                    Recipe::class,
                    Collection::class,
                ])
                ->exceptOnForms(),
        ];
    }

    public function authorizedToUpdate(Request $request)
    {
        return false;
    }

    public function authorizedToDelete(Request $request)
    {
        return false;
    }

    public function authorizedToReplicate(Request $request)
    {
        return false;
    }
}
