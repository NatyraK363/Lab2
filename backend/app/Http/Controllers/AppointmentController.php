<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index()
    {
        $user = auth('api')->user();

        if (!$user) {
            return response()->json([]);
        }

        $roles = $user->roles()->pluck('name')->toArray();

        $query = Appointment::with(['doctor', 'patient.user']);

        if (in_array('patient', $roles) && !in_array('admin', $roles)) {
            $patient = $user->patient;

            if (!$patient) {
                return response()->json([]);
            }

            $query->where('patient_id', $patient->id);
        }

        if (in_array('doctor', $roles) && !in_array('admin', $roles)) {
            $doctor = $user->doctor;

            if (!$doctor) {
                return response()->json([]);
            }

            $query->where('doctor_id', $doctor->id);
        }

        return response()->json(
            $query->latest()->get()
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'reason' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $patient = auth('api')->user()->patient;

        if (!$patient) {
            return response()->json([
                'message' => 'Patient profile not found for this user.'
            ], 404);
        }

        $data['patient_id'] = $patient->id;
        $data['status'] = 'pending';
        $data['created_by'] = auth('api')->id();

        $appointment = Appointment::create($data);

        return response()->json([
            'message' => 'Appointment created successfully',
            'appointment' => $appointment->load(['doctor', 'patient'])
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        $data = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'patient_id' => 'required|exists:patients,id',
            'appointment_date' => 'required|date',
            'appointment_time' => 'required',
            'status' => 'required|in:pending,confirmed,completed,cancelled',
            'reason' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $data['updated_by'] = auth('api')->id();

        $appointment->update($data);

        return response()->json([
            'message' => 'Appointment updated successfully',
            'appointment' => $appointment->load(['doctor', 'patient'])
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        $data = $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
        ]);

        $appointment->update([
            'status' => $data['status'],
            'updated_by' => auth('api')->id(),
        ]);

        return response()->json([
            'message' => 'Appointment status updated successfully',
            'appointment' => $appointment->load(['doctor', 'patient'])
        ]);
    }

    public function destroy($id)
    {
        Appointment::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Appointment deleted successfully'
        ]);
    }
}