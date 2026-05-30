<?php

namespace App\Services;

use App\Repositories\PatientRepository;

class PatientService
{
    protected $patientRepository;

    public function __construct(PatientRepository $patientRepository)
    {
        $this->patientRepository = $patientRepository;
    }

    public function getPatientsForUser($user)
    {
        $roles = $user->roles()->pluck('name')->toArray();

        if (in_array('admin', $roles) || in_array('receptionist', $roles)) {
            return $this->patientRepository->getAllWithAppointments();
        }

        if (in_array('doctor', $roles)) {
            $doctor = $user->doctor;

            if (!$doctor) {
                return [];
            }

            return $this->patientRepository->getPatientsByDoctor($doctor->id);
        }

        return [];
    }
}