<?php

namespace App\Services;

class OctaneStateTest
{
    public int $counter = 0;

    public function increment(): int
    {
        return ++$this->counter;
    }
}
