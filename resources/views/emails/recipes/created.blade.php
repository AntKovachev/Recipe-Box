
<x-mail::message>
# Recipe Created Successfully!

Hello!

Your recipe **{{ $recipe->title }}** has been successfully added to Recipe Box.

Thanks for sharing your recipe with us!

<x-mail::button :url="url('/recipes/' . $recipe->slug)">
View Your Recipe
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
