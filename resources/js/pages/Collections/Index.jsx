
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ collections }) {
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

    return (
        <>
            <Head title="My Collections" />

            <div>
                <Link href="/recipes">Back to recipes</Link>

                <h1>My Collections</h1>

                <h2>Create a collection</h2>

                <form onSubmit={submit}>
                    <div>
                        <label>Name</label>
                        <input
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            placeholder="e.g. Italian Food"
                        />
                        {errors.name && <p>{errors.name}</p>}
                    </div>

                    <div>
                        <label>Description</label>
                        <textarea
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            placeholder="Optional description"
                        />
                        {errors.description && <p>{errors.description}</p>}
                    </div>

                    <button type="submit" disabled={processing}>
                        Create collection
                    </button>
                </form>

                <hr />

                <h2>Your collections</h2>

                {collections.length === 0 ? (
                    <p>You haven't created any collections yet.</p>
                ) : (
                    collections.map(collection => (
                        <div key={collection.id}>
                            <h3>
                                <Link href={`/collections/${collection.id}`}>
                                    {collection.name}
                                </Link>
                            </h3>

                            <p>{collection.description}</p>
                            <p>{collection.recipes_count} recipes</p>
                        </div>
                    ))
                )}
            </div>
        </>
    );
}
