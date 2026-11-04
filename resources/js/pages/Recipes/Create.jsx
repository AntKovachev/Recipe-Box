import { Head, Link, useForm } from '@inertiajs/react';

export default function Create() {
    const { data, setData, post, processing, errors, transform, reset } = useForm({
        title: '',
        description: '',
        instructions: '',
        prepTime: 0,
        cookTime: 0,
        servings: 1,
    });

    const submit = (e) => {
        e.preventDefault();

        transform((data) => {
            const { prepTime, cookTime, ...rest } = data;

            return {
                ...rest,
                prep_time: prepTime,
                cook_time: cookTime,
            };
        });

        post('/recipes', {
            onSuccess: () => reset()
        });
    };

    return (
        <>
            <Head title="Create Recipe" />

            <div>
                <h1>Create a Recipe</h1>

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
                        {errors.description && <div style={{color: 'red'}}>{errors.description}</div>}
                    </div>

                    <div>
                        <label htmlFor="instructions">Instructions</label>
                        <textarea
                            id="instructions"
                            value={data.instructions}
                            onChange={(e) => setData('instructions', e.target.value)}
                        />
                        {errors.instructions && <div style={{color: 'red'}}>{errors.instructions}</div>}
                    </div>

                    <div>
                        <label htmlFor="prepTime">Preparation time (minutes)</label>
                        <input
                            id="prepTime"
                            type="number"
                            min="0"
                            value={data.prepTime}
                            onChange={(e) => setData('prepTime', e.target.value)}
                        />
                        {errors.prep_time && <div style={{color: 'red'}}>{errors.prep_time}</div>}
                    </div>

                    <div>
                        <label htmlFor="cookTime">Cooking time (minutes)</label>
                        <input
                            id="cookTime"
                            type="number"
                            min="0"
                            value={data.cookTime}
                            onChange={(e) => setData('cookTime', e.target.value)}
                        />
                        {errors.cook_time && <div style={{color: 'red'}}>{errors.cook_time}</div>}
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
                        {errors.servings && <div style={{color: 'red'}}>{errors.servings}</div>}
                    </div>

                    <button type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Create Recipe'}
                    </button>
                </form>
            </div>
        </>
    );
}
