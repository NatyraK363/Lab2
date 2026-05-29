<?php

namespace App\Http\Controllers;

use App\Models\MedicalRecord;
use App\Models\Patient;
use Illuminate\Http\Request;

class MedicalRecordController extends Controller
{
    public function myPatients()
    {
        $doctor = auth('api')->user()->doctor;

        if (!$doctor) {
            return response()->json([]);
        }

        $patients = Patient::with([
            'user',
            'appointments' => function ($query) use ($doctor) {
                $query->where('doctor_id', $doctor->id)
                    ->with('medicalRecords')
                    ->latest();
            }
        ])
        ->whereHas('appointments', function ($query) use ($doctor) {
            $query->where('doctor_id', $doctor->id);
        })
        ->get();

        return response()->json($patients);
    }

    public function store(Request $request)
    {
        $doctor = auth('api')->user()->doctor;

        if (!$doctor) {
            return response()->json([
                'message' => 'Doctor profile not found.'
            ], 404);
        }

        $data = $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'appointment_id' => 'nullable|exists:appointments,id',
            'diagnosis' => 'required|string',
            'prescription' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $data['doctor_id'] = $doctor->id;

        $record = MedicalRecord::create($data);

        return response()->json([
            'message' => 'Medical record created successfully',
            'record' => $record
        ], 201);
    }
}