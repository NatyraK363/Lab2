<?php

namespace App\Services;

use App\Repositories\DoctorRepository;

class DoctorService
{
    protected $doctorRepository;

    public function __construct(DoctorRepository $doctorRepository)
    {
        $this->doctorRepository = $doctorRepository;
    }

    public function getAllDoctors()
    {
        return $this->doctorRepository->getAll();
    }

    public function createDoctor(array $data)
    {
        return $this->doctorRepository->create($data);
    }

    public function updateDoctor($id, array $data)
    {
        $doctor = $this->doctorRepository->find($id);

        return $this->doctorRepository->update($doctor, $data);
    }

    public function deleteDoctor($id)
    {
        $doctor = $this->doctorRepository->find($id);

        return $this->doctorRepository->delete($doctor);
    }

    public function findDoctor($id)
    {
        return $this->doctorRepository->find($id);
    }
}