<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin1@smartcare.com'],
            [
                'name' => 'SmartCare Admin 1',
                'password' => Hash::make('123456'),
            ]
        );

        $adminRole = Role::where('name', 'admin')->first();

        if ($adminRole) {
            $admin->roles()->syncWithoutDetaching([
                $adminRole->id => [
                    'assigned_at' => now()
                ]
            ]);
        }
    }
}