
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ collection }) {
    const [removingRecipeId, setRemovingRecipeId] = useState(null);
    const [deletingCollection, setDeletingCollection] = useState(false);

    const recipes = collection.recipes ?? [];

    function removeRecipe(recipeId) {
        if (!window.confirm('Remove this recipe from the collection?')) {
            return;
        }

        setRemovingRecipeId(recipeId);

        router.delete(
            `/collections/${collection.id}/recipes/${recipeId}`,
            {
                preserveScroll: true,
                onFinish: () => setRemovingRecipeId(null),
            }
        );
    }

    function deleteCollection() {
        if (!window.confirm('Delete this collection?')) {
            return;
        }

        setDeletingCollection(true);

        router.delete(`/collections/${collection.id}`, {
            onFinish: () => setDeletingCollection(false),
        });
    }

    return (
        <>
            <Head title={collection.name} />

            <div className="mx-auto max-w-6xl px-4 py-8">

                {/* Back Navigation */}
                <div className="mb-8">
                    <Link
                        href="/collections"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        ← Back to collections
                    </Link>
                </div>

                {/* Collection Header */}
                <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="mb-3 text-3xl">
                                📚
                            </div>

                            <h1 className="text-3xl font-bold text-gray-900">
                                {collection.name}
                            </h1>

                            <p className="mt-3 text-gray-600">
                                {collection.description ||
                                    'No description provided.'}
                            </p>
                        </div>

                        <div className="flex-shrink-0">
                            <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                                {recipes.length}{' '}
                                {recipes.length === 1 ? 'recipe' : 'recipes'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Recipes Section */}
                <div className="mb-10">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Recipes
                        </h2>

                        <Link
                            href="/recipes"
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Browse Recipes →
                        </Link>
                    </div>

                    {recipes.length === 0 ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                            <div className="mb-4 text-4xl">
                                🍽️
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900">
                                No recipes in this collection
                            </h3>

                            <p className="mt-3 text-gray-500">
                                This collection doesn't have any recipes yet.
                            </p>

                            <Link
                                href="/recipes"
                                className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                            >
                                Browse Recipes
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {recipes.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
                                >
                                    <div>
                                        <div className="mb-4 text-3xl">
                                            🍳
                                        </div>

                                        <h3 className="mb-3 text-xl font-semibold text-gray-900">
                                            <Link
                                                href={`/recipes/${recipe.slug}`}
                                                className="hover:text-blue-600"
                                            >
                                                {recipe.title}
                                            </Link>
                                        </h3>

                                        <p className="mb-4 text-sm text-gray-500">
                                            By {recipe.user?.name ?? 'Unknown'}
                                        </p>
                                    </div>

                                    <div className="mt-6 border-t border-gray-100 pt-4">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <Link
                                                href={`/recipes/${recipe.slug}`}
                                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                                            >
                                                View Recipe →
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={() => removeRecipe(recipe.id)}
                                                disabled={removingRecipeId !== null}
                                                className="rounded-lg border border-red-500 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                {removingRecipeId === recipe.id
                                                    ? 'Removing...'
                                                    : 'Remove'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Danger Zone */}
                <div className="rounded-xl border border-red-500 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-red-600">
                                Danger Zone
                            </h2>

                            <p className="mt-2 text-sm text-gray-600">
                                Permanently delete this collection.
                                This action cannot be undone.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={deleteCollection}
                            disabled={deletingCollection}
                            className="rounded-lg bg-red-500 px-5 py-3 font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {deletingCollection
                                ? 'Deleting...'
                                : 'Delete Collection'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
