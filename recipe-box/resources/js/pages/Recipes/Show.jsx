import { Head, Link } from '@inertiajs/react';

export default function Show({ recipe }) {
    return (
        <>
            <Head title={recipe.title} />

            <div>
                <Link href="/recipes">
                    &larr; Back to recipes
                </Link>

                <h1>{recipe.title}</h1>

                <p>
                    By {recipe.user.name}
                </p>

                {recipe.description && (
                    <p>{recipe.description}</p>
                )}

                <div>
                    <p>Preparation time: {recipe.prep_time} minutes</p>
                    <p>Cooking time: {recipe.cook_time} minutes</p>
                    <p>Servings: {recipe.servings}</p>
                </div>

                <section>
                    <h2>Instructions</h2>
                    <p>{recipe.instructions}</p>
                </section>
            </div>
        </>
    );
}