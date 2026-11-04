import { Head, Link, useForm } from '@inertiajs/react';

export default function Show({ recipe, collections, recipeCollections }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        collectionId: '',
    });

    function addToCollection(e) {
        e.preventDefault();

        post(`/collections/${data.collectionId}/recipes/${recipe.id}`, {
            onSuccess: () => reset(),
        });
    }

    return (
        <>
            <Head title={recipe.title} />

            <div className="max-w-4xl mx-auto px-4 py-8">

                {/* Recipe image */}
                {recipe.image_url ? (
                    <div className="w-64 h-64 mb-6 mx-auto">
                        <img
                            src={recipe.image_url}
                            alt={recipe.title}
                            className="w-full h-full object-cover rounded-xl"
                        />
                    </div>
                ) : null}

                {/* Recipe information */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">
                        {recipe.title}
                    </h1>

                    <p className="text-gray-500 mb-4">
                        By {recipe.user.name}
                    </p>

                    <p className="text-gray-700 leading-relaxed">
                        {recipe.description}
                    </p>
                </div>

                {/* Recipe details */}
                <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-xl p-5 mb-8">
                    <div>
                        <p className="text-sm text-gray-500">Preparation</p>
                        <p className="font-semibold">
                            {recipe.prep_time} min
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Cooking</p>
                        <p className="font-semibold">
                            {recipe.cook_time} min
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Servings</p>
                        <p className="font-semibold">
                            {recipe.servings}
                        </p>
                    </div>
                </div>

                {/* Instructions */}
                <section className="mb-10">
                    <h2 className="text-2xl font-semibold mb-4">
                        Instructions
                    </h2>

                    <p className="text-gray-700 leading-7 whitespace-pre-line">
                        {recipe.instructions}
                    </p>
                </section>

                {/* Collections */}
                <section className="border-t pt-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Saved in your collections
                    </h2>

                    {recipeCollections.length === 0 ? (
                        <p className="text-gray-500">
                            This recipe hasn't been added to any of your
                            collections yet.
                        </p>
                    ) : (
                        <ul className="list-disc list-inside space-y-2">
                            {recipeCollections.map(collection => (
                                <li key={collection.id}>
                                    <Link
                                        href={`/collections/${collection.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {collection.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Add to collection */}
                <section className="border-t mt-8 pt-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Add to collection
                    </h2>

                    {collections.length === 0 ? (
                        <p className="text-gray-500">
                            You don't have any collections yet.{' '}
                            <Link
                                href="/collections"
                                className="text-blue-600 hover:underline"
                            >
                                Create a collection
                            </Link>
                        </p>
                    ) : (
                        <form onSubmit={addToCollection} className="flex flex-col sm:flex-row gap-3">
                            <select
                                value={data.collectionId}
                                onChange={e =>
                                    setData('collectionId', e.target.value)
                                }
                                className="border rounded-lg px-3 py-2 flex-1"
                            >
                                <option value="">Select a collection</option>

                                {collections.map(collection => (
                                    <option
                                        key={collection.id}
                                        value={collection.id}
                                    >
                                        {collection.name}
                                    </option>
                                ))}
                            </select>

                            {errors.collectionId ? (
                                <p className="text-red-600 text-sm">
                                    {errors.collectionId}
                                </p>
                            ): null}

                            <button
                                type="submit"
                                disabled={processing || !data.collectionId}
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {processing ? 'Adding...' : 'Add to collection'}
                            </button>
                        </form>
                    )}
                </section>

            </div>
        </>
    );
}
