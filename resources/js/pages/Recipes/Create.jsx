
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Create() {
    const {
        data,
        setData,
        post,
        processing,
        errors,
        transform,
        reset,
        progress,
    } = useForm({
        title: '',
        description: '',
        instructions: '',
        prepTime: 0,
        cookTime: 0,
        servings: 1,
        image: null,
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!data.image) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(data.image);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [data.image]);

    const submit = (e) => {
        e.preventDefault();

        transform((data) => {
            const { prepTime, cookTime, ...rest } = data;

            return {
                ...rest,
                prep_time: prepTime,
                cook_time: cookTime,
            };
        });

        post('/recipes', {
            forceFormData: true,
            onSuccess: () => reset(),
        });
    };

    const inputClasses =
        'w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600';

    const labelClasses =
        'mb-2 block text-sm font-medium text-gray-700';

    const errorClasses =
        'mt-1 text-sm text-red-600';

    return (
        <>
            <Head title="Create Recipe" />

            <div className="mx-auto max-w-3xl px-4 py-8">
                <div className="rounded-xl bg-white p-8 shadow-lg">
                    <h1 className="mb-8 text-3xl font-bold text-gray-900">
                        Create a Recipe
                    </h1>

                    <form onSubmit={submit} className="space-y-6">

                        {/* Title */}
                        <div>
                            <label
                                htmlFor="title"
                                className={labelClasses}
                            >
                                Title
                            </label>

                            <input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) =>
                                    setData('title', e.target.value)
                                }
                                className={inputClasses}
                                placeholder="Enter recipe title"
                            />

                            {errors.title && (
                                <p className={errorClasses}>
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className={labelClasses}
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                className={inputClasses}
                                rows={4}
                                placeholder="Describe your recipe"
                            />

                            {errors.description && (
                                <p className={errorClasses}>
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Instructions */}
                        <div>
                            <label
                                htmlFor="instructions"
                                className={labelClasses}
                            >
                                Instructions
                            </label>

                            <textarea
                                id="instructions"
                                value={data.instructions}
                                onChange={(e) =>
                                    setData('instructions', e.target.value)
                                }
                                className={inputClasses}
                                rows={6}
                                placeholder="Enter cooking instructions"
                            />

                            {errors.instructions && (
                                <p className={errorClasses}>
                                    {errors.instructions}
                                </p>
                            )}
                        </div>

                        {/* Cooking Times */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label
                                    htmlFor="prepTime"
                                    className={labelClasses}
                                >
                                    Preparation time (minutes)
                                </label>

                                <input
                                    id="prepTime"
                                    type="number"
                                    min="0"
                                    value={data.prepTime}
                                    onChange={(e) =>
                                        setData('prepTime', e.target.value)
                                    }
                                    className={inputClasses}
                                />

                                {errors.prep_time && (
                                    <p className={errorClasses}>
                                        {errors.prep_time}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="cookTime"
                                    className={labelClasses}
                                >
                                    Cooking time (minutes)
                                </label>

                                <input
                                    id="cookTime"
                                    type="number"
                                    min="0"
                                    value={data.cookTime}
                                    onChange={(e) =>
                                        setData('cookTime', e.target.value)
                                    }
                                    className={inputClasses}
                                />

                                {errors.cook_time && (
                                    <p className={errorClasses}>
                                        {errors.cook_time}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Servings */}
                        <div>
                            <label
                                htmlFor="servings"
                                className={labelClasses}
                            >
                                Servings
                            </label>

                            <input
                                id="servings"
                                type="number"
                                min="1"
                                value={data.servings}
                                onChange={(e) =>
                                    setData('servings', e.target.value)
                                }
                                className={inputClasses}
                            />

                            {errors.servings && (
                                <p className={errorClasses}>
                                    {errors.servings}
                                </p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label
                                htmlFor="image"
                                className={labelClasses}
                            >
                                Recipe image
                            </label>

                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        'image',
                                        e.target.files?.[0] ?? null
                                    )
                                }
                                className="block w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-700"
                            />

                            {errors.image && (
                                <p className={errorClasses}>
                                    {errors.image}
                                </p>
                            )}

                            {preview && (
                                <div className="mt-4">
                                    <img
                                        src={preview}
                                        alt="Recipe preview"
                                        className="h-48 w-auto rounded-lg object-cover"
                                    />
                                </div>
                            )}

                            {progress && (
                                <div className="mt-4">
                                    <p className="mb-2 text-sm text-gray-600">
                                        Uploading: {progress.percentage}%
                                    </p>

                                    <progress
                                        value={progress.percentage}
                                        max="100"
                                        className="h-3 w-full"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full cursor-pointer rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {processing
                                    ? 'Creating...'
                                    : 'Create Recipe'}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </>
    );
}
