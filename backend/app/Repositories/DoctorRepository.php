<?php

namespace App\Repositories;

use App\Models\Doctor;

class DoctorRepository
{
    public function getAll()
    {
        return Doctor::with(['user', 'department', 'specialty'])
            ->latest()
            ->get();
    }

    public function find($id)
    {
        return Doctor::findOrFail($id);
    }

    public function create(array $data)
    {
        return Doctor::create($data);
    }

    public function update(Doctor $doctor, array $data)
    {
        $doctor->update($data);

        return $doctor;
    }

    public function delete(Doctor $doctor)
    {
        return $doctor->delete();
    }
}