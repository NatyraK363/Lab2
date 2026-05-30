<?php

namespace App\Repositories;

use App\Models\Appointment;

class AppointmentRepository
{
    public function getAll()
    {
        return Appointment::with(['doctor', 'patient.user'])
            ->latest()
            ->get();
    }

    public function find($id)
    {
        return Appointment::with(['doctor', 'patient.user'])
            ->findOrFail($id);
    }

    public function create(array $data)
    {
        return Appointment::create($data);
    }

    public function update($appointment, array $data)
    {
        $appointment->update($data);

        return $appointment;
    }

    public function delete($appointment)
    {
        return $appointment->delete();
    }
}