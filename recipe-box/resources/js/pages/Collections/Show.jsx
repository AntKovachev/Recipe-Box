
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ collection }) {
    function removeRecipe(recipeId) {
        if (!confirm('Remove this recipe from the collection?')) {
            return;
        }

        router.delete(
            `/collections/${collection.id}/recipes/${recipeId}`
        );
    }

    return (
        <>
            <Head title={collection.name} />

            <div>
                <Link href="/collections">Back to collections</Link>

                <h1>{collection.name}</h1>

                <p>{collection.description}</p>

                <h2>Recipes</h2>

                {collection.recipes.length === 0 ? (
                    <p>This collection doesn't have any recipes yet.</p>
                ) : (
                    collection.recipes.map(recipe => (
                        <div key={recipe.id}>
                            <h3>
                                <Link href={`/recipes/${recipe.slug}`}>
                                    {recipe.title}
                                </Link>
                            </h3>

                            <p>By {recipe.user.name}</p>

                            <button
                                onClick={() => removeRecipe(recipe.id)}
                            >
                                Remove from collection
                            </button>
                        </div>
                    ))
                )}

                <hr />

                <button
                    onClick={() => {
                        if (confirm('Delete this collection?')) {
                            router.delete(`/collections/${collection.id}`);
                        }
                    }}
                >
                    Delete collection
                </button>
            </div>
        </>
    );
}
