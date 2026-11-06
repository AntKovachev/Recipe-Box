<?php

namespace App\Policies;

use App\Models\Collection;
use App\Models\User;
use App\Repositories\Contracts\CollectionPolicyInterface;

class CollectionPolicy implements CollectionPolicyInterface
{
    public function view(User $user, Collection $collection): bool
    {
        return $user->id === $collection->user_id;
    }

    public function delete(User $user, Collection $collection): bool
    {
        return $user->id === $collection->user_id;
    }

    public function add(User $user, Collection $collection): bool
    {
        return $user->id === $collection->user_id;
    }

    public function remove(User $user, Collection $collection): bool
    {
        return $user->id === $collection->user_id;
    }
}
