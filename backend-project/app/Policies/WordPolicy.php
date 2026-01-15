<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Word;
use App\Models\Category;

class WordPolicy
{
    public function view(User $user, Word $word)
    {
        return $word->category->user_id === null || $word->category->user_id === $user->id;
    }

    public function create(User $user, Category $category)
    {
        return $category->user_id === $user->id;
    }

    public function update(User $user, Word $word)
    {
        return $word->category->user_id === $user->id;
    }

    public function delete(User $user, Word $word)
    {
        return $word->category->user_id === $user->id;
    }
}
