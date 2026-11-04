import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors, transform, reset, progress } = useForm({
        title: '',
        description: '',
        instructions: '',
        prepTime: 0,
        cookTime: 0,
        servings: 1,
        image: null
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
            forceFormData: true,
            onSuccess: () => reset()
        });
    };

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        if (!data.image) {
            setPreview(null);
            return;
        }

        const objectUrl = URL.createObjectURL(data.image);
        setPreview(objectUrl);

        return () => URL.revokeObjectURL(objectUrl)
    }, [data.image])

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
                        {errors.title ? <div>{errors.title}</div> : null}
                    </div>

                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                        />
                        {errors.description ? <div style={{color: 'red'}}>{errors.description}</div>:null}
                    </div>

                    <div>
                        <label htmlFor="instructions">Instructions</label>
                        <textarea
                            id="instructions"
                            value={data.instructions}
                            onChange={(e) => setData('instructions', e.target.value)}
                        />
                        {errors.instructions ? <div style={{color: 'red'}}>{errors.instructions}</div>:null}
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
                        {errors.prep_time ? <div style={{color: 'red'}}>{errors.prep_time}</div>:null}
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
                        {errors.cook_time ? <div style={{color: 'red'}}>{errors.cook_time}</div>:null}
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
                        {errors.servings ? <div style={{color: 'red'}}>{errors.servings}</div>:null}
                    </div>

                    <div>
                        <label>Recipe image</label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => setData('image', e.target.files[0])}
                        />

                        {errors.image ? <p>{errors.image}</p>:null}

                        {preview ? (
                            <img
                                src={preview}
                                alt="Recipe preview"
                                width="200"
                            />
                        ): null}

                        {progress ? (
                            <div>
                                <p>Uploading: {progress.percentage}%</p>

                                <progress
                                    value={progress.percentage}
                                    max="100"
                                />
                            </div>
                        ): null}
                    </div>

                    <button type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Create Recipe'}
                    </button>
                </form>
            </div>
        </>
    );
}
