<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['name' => 'admin'],
            [
                'email'    => 'admin@hashtat.local',
                'password' => bcrypt('admin'),
                'is_admin' => true,
                'points'   => 0,
            ]
        );
    }
}
