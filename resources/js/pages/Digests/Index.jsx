
import { Head, Link } from '@inertiajs/react';

export default function Index({ digests }) {
    return (
        <>
            <Head title="Weekly Digests" />

            <div>
                <Link href="/recipes">← Back to recipes</Link>

                <h1>Weekly Digests</h1>
                <p>Your weekly recipe activity.</p>

                {digests.length === 0 ? (
                    <p>No weekly digests available yet.</p>
                ) : (
                    digests.map(digest => {
                        const content = digest.content;

                        return (
                            <section key={digest.id}>
                                <h2>
                                    Week of{' '}
                                    {new Date(
                                        digest.created_at
                                    ).toLocaleDateString()}
                                </h2>

                                <p>
                                    New recipes: {content.new_recipes_count}
                                </p>

                                <p>
                                    Collections: {content.collections_count}
                                </p>

                                <p>
                                    Total recipes: {content.total_recipes_count}
                                </p>

                                <h3>Recently added recipes</h3>

                                {content.recent_recipes.map(recipe => (
                                    <div key={recipe.id}>
                                        <Link href={`/recipes/${recipe.slug}`}>
                                            {recipe.title}
                                        </Link>
                                    </div>
                                ))}
                            </section>
                        );
                    })
                )}
            </div>
        </>
    );
}
