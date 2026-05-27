<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index()
    {
        return response()->json(
            Doctor::with(['user', 'department', 'specialty'])->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'nullable|exists:users,id',
            'department_id' => 'required|exists:departments,id',
            'specialty_id' => 'required|exists:specialties,id',
            'phone' => 'required|string|max:50',
            'license_number' => 'required|string|unique:doctors,license_number',
            'experience_years' => 'required|integer|min:0',
            'bio' => 'nullable|string',
        ]);

        $doctor = Doctor::create($data);

        return response()->json([
            'message' => 'Doctor created successfully',
            'doctor' => $doctor->load(['user', 'department', 'specialty'])
        ], 201);
    }

    public function destroy($id)
    {
        Doctor::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Doctor deleted successfully'
        ]);
    }
}