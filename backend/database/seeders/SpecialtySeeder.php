<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Specialty;

class SpecialtySeeder extends Seeder
{
    public function run(): void
    {
        $specialties = [
            'Cardiology',
            'Psychology',
            'Neurology',
            'Pediatrics',
            'Orthopedics',
            'Dermatology',
            'General Medicine',
        ];

        foreach ($specialties as $name) {
            Specialty::firstOrCreate([
                'name' => $name
            ]);
        }
    }
}