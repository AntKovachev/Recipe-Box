<?php

namespace App\Enums;

enum CollectionType: string
{
    case Breakfast = 'breakfast';
    case Lunch = 'lunch';
    case Dinner = 'dinner';
    case Dessert = 'dessert';
    case Snack = 'snack';
    case Drinks = 'drinks';

    public function label(): string
    {
        return match ($this) {
            self::Breakfast => 'Breakfast',
            self::Lunch => 'Lunch',
            self::Dinner => 'Dinner',
            self::Dessert => 'Dessert',
            self::Snack => 'Snack',
            self::Drinks => 'Drinks',
        };
    }
}
