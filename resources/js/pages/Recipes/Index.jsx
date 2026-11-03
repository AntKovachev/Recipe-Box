
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({
    recipes,
    collections,
    selectedCollection,
    search,
}) {
    const [searchTerm, setSearchTerm] = useState(search || '');

    function searchRecipes(e) {
        e.preventDefault();

        router.get('/recipes', {
            search: searchTerm,
            collection: selectedCollection || '',
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function filterByCollection(e) {
        router.get('/recipes', {
            search: searchTerm,
            collection: e.target.value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title="Recipes" />

            <div>
                <h1>Recipes</h1>
                <Link href="/digests">
                    Weekly Digests
                </Link>

                <form onSubmit={searchRecipes}>
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />

                    <button type="submit">Search</button>
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

                <div>
                    {recipes.links.map((link, index) => (
                        <button
                            key={index}
                            disabled={!link.url}
                            onClick={() => router.visit(link.url)}
                            dangerouslySetInnerHTML={{
                                __html: link.label,
                            }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
