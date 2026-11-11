
import { Head, Link, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import Pagination from '@/Components/Pagination';
import useSWR from 'swr';
import qs from 'qs';
import { useDebouncedValue } from '@mantine/hooks';

export default function Index({
    recipes,
    collections,
    selectedCollection,
    search,
}) {
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [debouncedSearch] = useDebouncedValue(searchTerm, 300);
    const [arrayFormat, setArrayFormat] = useState('indices');

    const firstRender = useRef(true);

    // Parameters for the SWR API request.
    const params = {
        search: debouncedSearch,
        collections: selectedCollection ? [selectedCollection] : [],
    };

    // Serialize parameters using qs.
    const queryString = qs.stringify(params, {
        arrayFormat,
    });

    const apiUrl = `/api/recipes?${queryString}`;

    // Fetch recipes from the API using SWR.
    const { data, error, isLoading, mutate } = useSWR(apiUrl);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        router.get('/recipes', {
            search: debouncedSearch,
            collection: selectedCollection || '',
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['recipes'],
        });
    }, [debouncedSearch]);

    function filterByCollection(e) {
        router.get('/recipes', {
            search: searchTerm,
            collection: e.target.value,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['recipes', 'selectedCollection'],
        });
    }

    const inputClasses =
        'w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600';

    return (
        <>
            <Head title="Recipes" />

            <div className="mx-auto max-w-6xl px-4 py-8">

                {/* Page Header */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Recipes
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Discover and explore delicious recipes.
                        </p>
                    </div>

                    <Link
                        href="/recipes/create"
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
                    >
                        + Create Recipe
                    </Link>
                </div>

                {/* Search and Filters */}
                <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

                        <div className="md:col-span-2">
                            <label
                                htmlFor="search"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Search recipes
                            </label>

                            <input
                                id="search"
                                type="text"
                                placeholder="Search recipes..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                                className={inputClasses}
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="collection"
                                className="mb-2 block text-sm font-medium text-gray-700"
                            >
                                Filter by collection
                            </label>

                            <select
                                id="collection"
                                value={selectedCollection || ''}
                                onChange={filterByCollection}
                                className={inputClasses}
                            >
                                <option value="">All recipes</option>

                                {collections.map((collection) => (
                                    <option
                                        key={collection.id}
                                        value={collection.id}
                                    >
                                        {collection.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Main Recipe List */}
                <div className="mb-10">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            All Recipes
                        </h2>

                        <span className="text-sm text-gray-500">
                            {recipes?.total ?? recipes?.data?.length ?? 0} recipes
                        </span>
                    </div>

                    {recipes?.data?.length === 0 ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
                            <p className="text-lg font-medium text-gray-700">
                                No recipes found.
                            </p>
                            <p className="mt-2 text-sm text-gray-500">
                                Try changing your search or collection filter.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {(recipes?.data ?? []).map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-lg"
                                >
                                    <div className="p-6">
                                        <h3 className="mb-3 text-xl font-semibold text-gray-900">
                                            <Link
                                                href={`/recipes/${recipe.slug}`}
                                                className="hover:text-blue-600"
                                            >
                                                {recipe.title}
                                            </Link>
                                        </h3>

                                        <p className="mb-3 text-sm text-gray-500">
                                            By {recipe.user?.name ?? 'Unknown'}
                                        </p>

                                        <p className="text-sm leading-relaxed text-gray-600">
                                            {recipe.description || 'No description available.'}
                                        </p>

                                        <Link
                                            href={`/recipes/${recipe.slug}`}
                                            className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
                                        >
                                            View Recipe →
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    <div className="mt-8">
                        {recipes?.links && (
                            <Pagination links={recipes.links} />
                        )}
                    </div>
                </div>

                {/* SWR + qs Experiment */}
                <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-900">
                            SWR + qs Experiment
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Test API requests and query string serialization.
                        </p>
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="arrayFormat"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Array format
                        </label>

                        <select
                            id="arrayFormat"
                            value={arrayFormat}
                            onChange={(e) =>
                                setArrayFormat(e.target.value)
                            }
                            className={inputClasses}
                        >
                            <option value="indices">Indices</option>
                            <option value="brackets">Brackets</option>
                            <option value="repeat">Repeat</option>
                            <option value="comma">Comma</option>
                        </select>
                    </div>

                    <div className="mb-5 space-y-3">
                        <div>
                            <p className="mb-1 text-sm font-medium text-gray-700">
                                Query string
                            </p>
                            <code className="block break-all rounded-lg bg-gray-200 p-3 text-sm text-gray-800">
                                {queryString || '(empty)'}
                            </code>
                        </div>

                        <div>
                            <p className="mb-1 text-sm font-medium text-gray-700">
                                Request URL
                            </p>
                            <code className="block break-all rounded-lg bg-gray-200 p-3 text-sm text-gray-800">
                                {apiUrl}
                            </code>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => mutate()}
                        className="mb-6 rounded-lg bg-gray-800 px-5 py-3 font-medium text-white transition-colors hover:bg-gray-900"
                    >
                        Refresh API Recipes
                    </button>

                    <h3 className="mb-3 text-lg font-semibold text-gray-900">
                        API Recipes
                    </h3>

                    {isLoading ? (
                        <p className="text-gray-500">
                            Loading recipes...
                        </p>
                    ) : error ? (
                        <p className="text-red-600">
                            Something went wrong: {error.message}
                        </p>
                    ) : data?.data?.length ? (
                        <div className="space-y-2">
                            {data.data.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className="rounded-lg border border-gray-200 bg-white p-3 text-gray-700"
                                >
                                    {recipe.title}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">
                            No API recipes found.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
