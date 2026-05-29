<?php

namespace App\Http\Controllers;

use App\Models\Patient;

class PatientController extends Controller
{
    public function index()
    {
        $user = auth('api')->user();
        $roles = $user->roles()->pluck('name')->toArray();

        if (in_array('admin', $roles) || in_array('receptionist', $roles)) {
            return response()->json(
                Patient::with(['user', 'appointments.doctor'])
                    ->latest()
                    ->get()
            );
        }

        if (in_array('doctor', $roles)) {
            $doctor = $user->doctor;

            if (!$doctor) {
                return response()->json([]);
            }

            return response()->json(
                Patient::with(['user', 'appointments.doctor'])
                    ->whereHas('appointments', function ($query) use ($doctor) {
                        $query->where('doctor_id', $doctor->id);
                    })
                    ->latest()
                    ->get()
            );
        }

        return response()->json([]);
    }
}