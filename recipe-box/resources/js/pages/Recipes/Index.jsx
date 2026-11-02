import { router } from '@inertiajs/react';

export default function Index({ recipes }) {
    return (
        <div>
            <h1>Recipes</h1>

            {recipes.data.map((recipe) => (
                <div key={recipe.id}>
                    <h2>{recipe.title}</h2>
                </div>
            ))}

            <button onClick={() => router.post('/logout')}>
                Logout
            </button>
        </div>
    );
}