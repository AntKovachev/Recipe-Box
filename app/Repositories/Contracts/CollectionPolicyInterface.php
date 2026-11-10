<?php

namespace App\Repositories\Contracts;

use App\Models\Collection;
use App\Models\User;
use App\Nova\Collection as NovaCollection;

interface CollectionPolicyInterface
{
    public function view(User $user, Collection $collection): bool;

    public function delete(User $user, Collection $collection): bool;

    public function add(User $user, Collection $collection): bool;

    public function remove(User $user, Collection $collection): bool;

    public function create(User $user): bool;
}
