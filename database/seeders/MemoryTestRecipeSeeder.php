<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MemoryTestRecipeSeeder extends Seeder
{
    public function run(): void
    {
        $prefix = 'memory-test-20261113-';
        $userId = DB::table('users')->value('id');

        if (! $userId) {
            throw new \RuntimeException('No user found.');
        }

        $payload = str_repeat('Long recipe instructions. ', 120);

        for ($batch = 0; $batch < 10; $batch++) {
            $rows = [];

            for ($i = 0; $i < 500; $i++) {
                $number = $batch * 500 + $i;

                $rows[] = [
                    'user_id' => $userId,
                    'title' => json_encode([
                        'en' => "Memory Test Recipe {$number}",
                        'bg' => "Тестова рецепта {$number}",
                    ]),
                    'slug' => $prefix . $number,
                    'description' => json_encode([
                        'en' => $payload,
                        'bg' => $payload,
                    ]),
                    'instructions' => json_encode([
                        'en' => "<p>{$payload}</p>",
                        'bg' => "<p>{$payload}</p>",
                    ]),
                    'ingredients' => json_encode([
                        ['name' => 'Flour', 'quantity' => '200g'],
                        ['name' => 'Water', 'quantity' => '100ml'],
                    ]),
                    'prep_time' => 10,
                    'cook_time' => 20,
                    'servings' => 4,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            DB::table('recipes')->insert($rows);

            $this->command->info(
                'Inserted ' . (($batch + 1) * 500) . ' recipes'
            );
        }
    }
}
