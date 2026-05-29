<?php

namespace App\Http\Controllers;

use App\Models\Doctor;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    public function index()
    {
        return response()->json(
            Doctor::with(['user', 'department', 'specialty'])
                ->latest()
                ->get()
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
            'phone' => [ 'required', 'regex:/^\+?[0-9]{8,15}$/'],            
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

    public function update(Request $request, $id)
    {
        $doctor = Doctor::findOrFail($id);

        $data = $request->validate([
            'user_id' => 'required|exists:users,id|unique:doctors,user_id,' . $doctor->id,
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'qualification' => 'nullable|string|max:255',
            'department_id' => 'required|exists:departments,id',
            'specialty_id' => 'required|exists:specialties,id',
            'phone' => [ 'required','regex:/^\+?[0-9]{8,15}$/'],            
            'license_number' => 'required|string|unique:doctors,license_number,' . $doctor->id,
            'experience_years' => 'required|integer|min:0',
            'bio' => 'nullable|string',
        ]);

        $doctor->update($data);

        return response()->json([
            'message' => 'Doctor updated successfully',
            'doctor' => $doctor->load(['user', 'department', 'specialty'])
        ]);
    }

    public function destroy($id)
    {
        Doctor::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Doctor deleted successfully'
        ]);
    }
}