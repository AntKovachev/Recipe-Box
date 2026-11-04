
import { Head, Link, useForm, usePage } from '@inertiajs/react';

export default function Show({ recipe, collections, recipeCollections }) {
    const auth = usePage().props.auth;

    const { data, setData, post, processing, errors, reset } = useForm({
        collectionId: '',
    });

    function addToCollection(e) {
        e.preventDefault();
        console.log(data)
        post(
            `/collections/${data.collectionId}/recipes/${recipe.id}`,
            {
                onSuccess: () => reset(),
            }
        );
    }

    return (
        <>
            <Head title={recipe.title} />

            <div>

                <h1>{recipe.title}</h1>

                <p>By {recipe.user.name}</p>

                <p>{recipe.description}</p>

                <p>Preparation: {recipe.prep_time} minutes</p>
                <p>Cooking: {recipe.cook_time} minutes</p>
                <p>Servings: {recipe.servings}</p>

                <h2>Instructions</h2>
                <p>{recipe.instructions}</p>
                <section>
                    <h2>Saved in collections</h2>

                    {recipeCollections.length === 0 ? (
                        <p>This recipe hasn't been added to any of your collections.</p>
                    ) : (
                        <ul>
                            {recipeCollections.map(collection => (
                                <li key={collection.id}>
                                    <Link href={`/collections/${collection.id}`}>
                                        {collection.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
                <section>
                    <hr />

                    <h2>Add to collection</h2>

                    {collections.length === 0 ? (
                        <p>
                            You don't have any collections yet.
                            <Link href="/collections">
                                Create a collection
                            </Link>
                        </p>
                    ) : (
                        <form onSubmit={addToCollection}>
                            <select
                                value={data.collectionId}
                                onChange={e =>
                                    setData('collectionId', e.target.value)
                                }                                >
                                <option value="">
                                    Select a collection
                                </option>

                                {collections.map(collection => (
                                    <option
                                        key={collection.id}
                                        value={collection.id}
                                    >
                                        {collection.name}
                                    </option>
                                ))}
                            </select>

                            {errors.collectionId && (
                                <p>{errors.collectionId}</p>
                            )}

                            <button
                                type="submit"
                                disabled={processing || !data.collectionId}
                            >
                                Add to collection
                            </button>
                        </form>
                    )}
                </section>
            </div>
        </>
    );
}
