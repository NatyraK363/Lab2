<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AuditLog;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

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

        if (in_array('admin', $roles) || in_array('receptionist', $roles)) {
            return response()->json($query->latest()->get());
        }

        if (in_array('patient', $roles)) {
            $patient = $user->patient;

            if (!$patient) {
                return response()->json([]);
            }

            $query->where('patient_id', $patient->id);
        }

        if (in_array('doctor', $roles)) {
            $doctor = $user->doctor;

            if (!$doctor) {
                return response()->json([]);
            }

            $query->where('doctor_id', $doctor->id);
        }

        return response()->json($query->latest()->get());
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

        $duration = (int) (
            Setting::where('key', 'appointment_duration')->value('value') ?? 30
        );

        $requestedTime = Carbon::parse($data['appointment_time']);

        $startTime = $requestedTime->copy()->subMinutes($duration)->format('H:i:s');
        $endTime = $requestedTime->copy()->addMinutes($duration)->format('H:i:s');

        $exists = Appointment::where('doctor_id', $data['doctor_id'])
            ->where('appointment_date', $data['appointment_date'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->whereBetween('appointment_time', [$startTime, $endTime])
            ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'This doctor is not available at this time. Please choose another time.'
            ], 422);
        }

        $data['patient_id'] = $patient->id;
        $data['status'] = 'pending';
        $data['created_by'] = auth('api')->id();

        $appointment = Appointment::create($data);

        return response()->json([
            'message' => 'Appointment created successfully',
            'appointment' => $appointment->load(['doctor', 'patient.user'])
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

        $appointment->update([
            ...$data,
            'updated_by' => auth('api')->id(),
        ]);

        return response()->json([
            'message' => 'Appointment updated successfully',
            'appointment' => $appointment->load(['doctor', 'patient.user'])
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $appointment = Appointment::with(['doctor', 'patient.user'])->findOrFail($id);

        $oldStatus = $appointment->status;

        $data = $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
        ]);

        $appointment->update([
            'status' => $data['status'],
            'updated_by' => auth('api')->id(),
        ]);

        $appointment->load(['doctor', 'patient.user']);

        AuditLog::create([
            'user_id' => auth('api')->id(),
            'action' => 'appointment_status_updated',
            'entity' => 'appointments',
            'entity_id' => $appointment->id,
            'old_value' => [
                'status' => $oldStatus,
            ],
            'new_value' => [
                'status' => $data['status'],
            ],
            'ip_address' => $request->ip(),
        ]);

        if ($data['status'] === 'confirmed' && $appointment->patient?->user?->email) {
            Mail::raw(
                'Your appointment has been confirmed.',
                function ($message) use ($appointment) {
                    $message->to($appointment->patient->user->email)
                        ->subject('Appointment Confirmed');
                }
            );
        }

        return response()->json([
            'message' => 'Appointment status updated successfully',
            'appointment' => $appointment
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