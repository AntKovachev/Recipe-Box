
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

    return (
        <>
            <Head title="Recipes" />

            <div>
                <h1>Recipes</h1>

                <form>
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </form>

                <div>
                    <label>Filter by collection:</label>

                    <select
                        value={selectedCollection || ''}
                        onChange={filterByCollection}
                    >
                        <option value="">All recipes</option>

                        {collections.map(collection => (
                            <option
                                key={collection.id}
                                value={collection.id}
                            >
                                {collection.name}
                            </option>
                        ))}
                    </select>
                </div>

                <hr />

                <h2>qs + SWR experiment</h2>

                <label>Array format:</label>

                <select
                    value={arrayFormat}
                    onChange={e => setArrayFormat(e.target.value)}
                >
                    <option value="indices">Indices</option>
                    <option value="brackets">Brackets</option>
                    <option value="repeat">Repeat</option>
                    <option value="comma">Comma</option>
                </select>

                <p>Query string: {queryString}</p>
                <p>Request URL: {apiUrl}</p>

                <button
                    type="button"
                    onClick={() => mutate()}
                >
                    Refresh API recipes
                </button>

                <h3>API recipes</h3>

                {isLoading ? (
                    <p>Loading recipes...</p>
                ) : error ? (
                    <p>Something went wrong: {error.message}</p>
                ) : (
                    data?.data?.map(recipe => (
                        <p key={recipe.id}>{recipe.title}</p>
                    ))
                )}

                <hr />

                <h2>Recipes</h2>

                {recipes?.data?.length === 0 ? (
                    <p>No recipes found.</p>
                ) : (
                    recipes.data.map(recipe => (
                        <div key={recipe.id}>
                            <h2>
                                <Link href={`/recipes/${recipe.slug}`}>
                                    {recipe.title}
                                </Link>
                            </h2>

                            <p>By {recipe.user.name}</p>
                            <p>{recipe.description}</p>
                        </div>
                    ))
                )}

                <Pagination links={recipes.links} />
            </div>
        </>
    );
}
