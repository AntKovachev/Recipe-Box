<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TicketUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            [
                'email' => 'tickets@example.com',
            ],
            [
                'name' => 'Ticket User',
                'password' => Hash::make('password'),
            ]
        );
    }
}
