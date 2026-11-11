
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ collections, collectionTypes }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
    });

    function submit(e) {
        e.preventDefault();

        post('/collections', {
            onSuccess: () => reset(),
        });
    }

    const inputClasses =
        'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600';

    return (
        <>
            <Head title="My Collections" />

            <div className="mx-auto max-w-6xl px-4 py-8">

                {/* Page Header */}
                <div className="mb-8">
                    <Link
                        href="/recipes"
                        className="mb-5 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                        ← Back to recipes
                    </Link>

                    <h1 className="text-3xl font-bold text-gray-900">
                        My Collections
                    </h1>

                    <p className="mt-2 text-gray-600">
                        Organize your favorite recipes into collections.
                    </p>
                </div>

                {/* Create Collection Form */}
                <div className="mb-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Create a Collection
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Choose a collection type and add an optional description.
                        </p>
                    </div>

                    <form onSubmit={submit} className="space-y-6">

                        {/* Collection Type */}
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Collection Type
                            </label>

                            <select
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className={inputClasses}
                            >
                                <option value="">
                                    Select a collection
                                </option>

                                {collectionTypes.map((type) => (
                                    <option
                                        key={type.value}
                                        value={type.value}
                                    >
                                        {type.label}
                                    </option>
                                ))}
                            </select>

                            {errors.name && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label
                                htmlFor="description"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Description
                                <span className="ml-2 font-normal text-gray-400">
                                    (Optional)
                                </span>
                            </label>

                            <textarea
                                id="description"
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="What kind of recipes will this collection contain?"
                                rows={4}
                                className={inputClasses}
                            />

                            {errors.description && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={processing || !data.name}
                                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                {processing
                                    ? 'Creating...'
                                    : '+ Create Collection'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Collections List */}
                <div>
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Your Collections
                        </h2>

                        <span className="text-sm text-gray-500">
                            {collections.length} collections
                        </span>
                    </div>

                    {collections.length === 0 ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm">
                            <div className="mb-4 text-4xl">
                                📚
                            </div>

                            <h3 className="text-xl font-semibold text-gray-900">
                                No collections yet
                            </h3>

                            <p className="mt-3 text-gray-500">
                                Create your first collection to start
                                organizing your recipes.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {collections.map((collection) => (
                                <div
                                    key={collection.id}
                                    className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg"
                                >
                                    <div>
                                        <div className="mb-4 flex items-center justify-between">
                                            <span className="text-2xl">
                                                📖
                                            </span>

                                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                                                {collection.recipes_count ?? 0} recipes
                                            </span>
                                        </div>

                                        <h3 className="mb-3 text-xl font-semibold text-gray-900">
                                            <Link
                                                href={`/collections/${collection.id}`}
                                                className="hover:text-blue-600"
                                            >
                                                {collection.name}
                                            </Link>
                                        </h3>

                                        <p className="text-sm leading-relaxed text-gray-600">
                                            {collection.description ||
                                                'No description provided.'}
                                        </p>
                                    </div>

                                    <div className="mt-6 border-t border-gray-100 pt-4">
                                        <Link
                                            href={`/collections/${collection.id}`}
                                            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                                        >
                                            View Collection →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
