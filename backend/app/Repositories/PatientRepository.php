<?php

namespace App\Repositories;

use App\Models\Patient;

class PatientRepository
{
    public function getAllWithAppointments()
    {
        return Patient::with(['user', 'appointments.doctor'])
            ->latest()
            ->get();
    }

    public function getPatientsByDoctor($doctorId)
    {
        return Patient::with(['user', 'appointments.doctor'])
            ->whereHas('appointments', function ($query) use ($doctorId) {
                $query->where('doctor_id', $doctorId);
            })
            ->latest()
            ->get();
    }
}