
import { Head, Link } from '@inertiajs/react';

export default function Index({ digests }) {
    return (
        <>
            <Head title="Weekly Digests" />

            <div className="mx-auto max-w-6xl px-4 py-8">

                {/* Back Navigation */}
                <div className="mb-8">
                    <Link
                        href="/recipes"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        ← Back to recipes
                    </Link>
                </div>

                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Weekly Digests
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Your weekly recipe activity.
                    </p>
                </div>

                {/* Empty State */}
                {digests.length === 0 ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900">
                            No weekly digests yet
                        </h2>

                        <p className="mt-3 text-gray-500">
                            Your weekly recipe activity will appear here
                            once digests become available.
                        </p>

                        <Link
                            href="/recipes"
                            className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                        >
                            Browse Recipes
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {digests.map((digest) => {
                            const content = digest.content ?? {};

                            const recentRecipes =
                                content.recent_recipes ?? [];

                            return (
                                <section
                                    key={digest.id}
                                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                                >
                                    {/* Digest Header */}
                                    <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Week of{' '}
                                            {new Date(
                                                digest.created_at
                                            ).toLocaleDateString()}
                                        </h2>

                                        <p className="mt-1 text-sm text-gray-500">
                                            Weekly activity summary
                                        </p>
                                    </div>

                                    <div className="p-6">

                                        {/* Statistics */}
                                        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">

                                            <div className="rounded-lg border border-blue-100 bg-blue-100 p-5">
                                                <p className="text-sm font-medium text-blue-700">
                                                    New Recipes
                                                </p>

                                                <p className="mt-2 text-3xl font-bold text-blue-800">
                                                    {content.new_recipes_count ?? 0}
                                                </p>
                                            </div>

                                            <div className="rounded-lg border border-gray-200 bg-gray-100 p-5">
                                                <p className="text-sm font-medium text-gray-600">
                                                    Collections
                                                </p>

                                                <p className="mt-2 text-3xl font-bold text-gray-900">
                                                    {content.collections_count ?? 0}
                                                </p>
                                            </div>

                                            <div className="rounded-lg border border-green-100 bg-green-100 p-5">
                                                <p className="text-sm font-medium text-green-700">
                                                    Total Recipes
                                                </p>

                                                <p className="mt-2 text-3xl font-bold text-green-800">
                                                    {content.total_recipes_count ?? 0}
                                                </p>
                                            </div>

                                        </div>

                                        {/* Recent Recipes */}
                                        <div>
                                            <h3 className="mb-4 text-lg font-semibold text-gray-900">
                                                Recently Added Recipes
                                            </h3>

                                            {recentRecipes.length === 0 ? (
                                                <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                                                    No recipes were added this week.
                                                </p>
                                            ) : (
                                                <div className="space-y-3">
                                                    {recentRecipes.map((recipe) => (
                                                        <div
                                                            key={recipe.id}
                                                            className="flex items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                                                        >
                                                            <Link
                                                                href={`/recipes/${recipe.slug}`}
                                                                className="font-medium text-gray-900 hover:text-blue-600"
                                                            >
                                                                {recipe.title}
                                                            </Link>

                                                            <Link
                                                                href={`/recipes/${recipe.slug}`}
                                                                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                                                            >
                                                                View Recipe →
                                                            </Link>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </>
    );
}
