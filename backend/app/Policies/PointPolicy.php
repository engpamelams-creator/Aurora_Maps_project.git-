<?php

namespace App\Policies;

use App\Models\Point;
use App\Models\User;

class PointPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Point $point): bool
    {
        return $user->id === $point->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Point $point): bool
    {
        return $user->id === $point->user_id;
    }
}
