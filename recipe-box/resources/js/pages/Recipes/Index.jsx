export default function Index({ recipes }) {
    console.log('Recipes received:', recipes);

    return (
        <div>
           {recipes.data.map(recipe => (
                <p key={recipe.id}>
                    {recipe.title} - Time to make: {recipe.prep_time} minute(s)
                </p>    
            ))}
        </div>
    );
}