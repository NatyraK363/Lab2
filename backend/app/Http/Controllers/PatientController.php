<?php

namespace App\Http\Controllers;

use App\Services\PatientService;

class PatientController extends Controller
{
    protected $patientService;

    public function __construct(PatientService $patientService)
    {
        $this->patientService = $patientService;
    }

    public function index()
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([]);
        }

        return response()->json(
            $this->patientService->getPatientsForUser($user)
        );
    }
}