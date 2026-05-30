<?php

namespace App\Http\Controllers;

use App\Services\DoctorService;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    protected $doctorService;

    public function __construct(DoctorService $doctorService)
    {
        $this->doctorService = $doctorService;
    }

    public function index()
    {
        return response()->json(
            $this->doctorService->getAllDoctors()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id|unique:doctors,user_id',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'specialty_id' => 'required|exists:specialties,id',
            'phone' => ['required', 'regex:/^\+?[0-9]{8,15}$/'],
            'license_number' => 'required|string|unique:doctors,license_number',
            'experience_years' => 'required|integer|min:0',
            'bio' => 'nullable|string',
        ]);

        $doctor = $this->doctorService->createDoctor($data);

        return response()->json([
            'message' => 'Doctor created successfully',
            'doctor' => $doctor->load(['user', 'department', 'specialty'])
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $doctor = $this->doctorService->findDoctor($id);

        $data = $request->validate([
            'user_id' => 'required|exists:users,id|unique:doctors,user_id,' . $doctor->id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'specialty_id' => 'required|exists:specialties,id',
            'phone' => ['required', 'regex:/^\+?[0-9]{8,15}$/'],
            'license_number' => 'required|string|unique:doctors,license_number,' . $doctor->id,
            'experience_years' => 'required|integer|min:0',
            'bio' => 'nullable|string',
        ]);

        $doctor = $this->doctorService->updateDoctor($id, $data);

        return response()->json([
            'message' => 'Doctor updated successfully',
            'doctor' => $doctor->load(['user', 'department', 'specialty'])
        ]);
    }

    public function destroy($id)
    {
        $this->doctorService->deleteDoctor($id);

        return response()->json([
            'message' => 'Doctor deleted successfully'
        ]);
    }
}