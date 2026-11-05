<?php

namespace App\Policies;

use App\Models\Collection;
use App\Models\User;

interface CollectionPolicyInterface
{
    public function view(User $user, Collection $collection): bool;

    public function delete(User $user, Collection $collection): bool;

    public function add(User $user, Collection $collection): bool;

    public function remove(User $user, Collection $collection): bool;
}
