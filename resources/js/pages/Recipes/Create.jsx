
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        instructions: '',
        prep_time: 0,
        cook_time: 0,
        servings: 1,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/recipes');
    };

    return (
        <>
            <Head title="Create Recipe" />

            <div>
                <h1>Create a Recipe</h1>

                <Link href="/recipes">Back to recipes</Link>

                <form onSubmit={submit}>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            id="title"
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        {errors.title && <div>{errors.title}</div>}
                    </div>

                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description && <div>{errors.description}</div>}
                    </div>

                    <div>
                        <label htmlFor="instructions">Instructions</label>
                        <textarea
                            id="instructions"
                            value={data.instructions}
                            onChange={(e) => setData('instructions', e.target.value)}
                        />
                        {errors.instructions && <div>{errors.instructions}</div>}
                    </div>

                    <div>
                        <label htmlFor="prep_time">Preparation time (minutes)</label>
                        <input
                            id="prep_time"
                            type="number"
                            min="0"
                            value={data.prep_time}
                            onChange={(e) => setData('prep_time', e.target.value)}
                        />
                        {errors.prep_time && <div>{errors.prep_time}</div>}
                    </div>

                    <div>
                        <label htmlFor="cook_time">Cooking time (minutes)</label>
                        <input
                            id="cook_time"
                            type="number"
                            min="0"
                            value={data.cook_time}
                            onChange={(e) => setData('cook_time', e.target.value)}
                        />
                        {errors.cook_time && <div>{errors.cook_time}</div>}
                    </div>

                    <div>
                        <label htmlFor="servings">Servings</label>
                        <input
                            id="servings"
                            type="number"
                            min="1"
                            value={data.servings}
                            onChange={(e) => setData('servings', e.target.value)}
                        />
                        {errors.servings && <div>{errors.servings}</div>}
                    </div>

                    <button type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Create Recipe'}
                    </button>
                </form>
            </div>
        </>
    );
}
