<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ReportController extends Controller
{
    public function index()
    {
        return response()->json(
            Report::latest()->get()
        );
    }

    public function generate(Request $request)
{
    $request->validate([
        'type' => 'required|in:appointments,patients,doctors',
        'from_date' => 'nullable|date',
        'to_date' => 'nullable|date',
    ]);

    $cacheKey = 'report_' . $request->type . '_' . ($request->from_date ?? 'all') . '_' . ($request->to_date ?? 'all');

    $data = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($request) {
        if ($request->type === 'appointments') {
            return Appointment::with(['doctor', 'patient.user'])
                ->when($request->from_date, function ($query) use ($request) {
                    $query->whereDate('appointment_date', '>=', $request->from_date);
                })
                ->when($request->to_date, function ($query) use ($request) {
                    $query->whereDate('appointment_date', '<=', $request->to_date);
                })
                ->get()
                ->map(function ($appointment) {
                    return [
                        'id' => $appointment->id,
                        'patient' => $appointment->patient?->user?->name,
                        'doctor' => $appointment->doctor?->first_name . ' ' . $appointment->doctor?->last_name,
                        'date' => $appointment->appointment_date,
                        'time' => $appointment->appointment_time,
                        'status' => $appointment->status,
                        'reason' => $appointment->reason,
                    ];
                })
                ->toArray();
        }

        if ($request->type === 'patients') {
            return Patient::with('user')
                ->get()
                ->map(function ($patient) {
                    return [
                        'id' => $patient->id,
                        'name' => $patient->user?->name,
                        'email' => $patient->user?->email,
                        'phone' => $patient->phone,
                        'gender' => $patient->gender,
                        'blood_type' => $patient->blood_type,
                    ];
                })
                ->toArray();
        }

        if ($request->type === 'doctors') {
            return Doctor::with(['user', 'department', 'specialty'])
                ->get()
                ->map(function ($doctor) {
                    return [
                        'id' => $doctor->id,
                        'name' => $doctor->first_name . ' ' . $doctor->last_name,
                        'email' => $doctor->user?->email,
                        'department' => $doctor->department?->name,
                        'specialty' => $doctor->specialty?->name,
                        'phone' => $doctor->phone,
                        'experience_years' => $doctor->experience_years,
                    ];
                })
                ->toArray();
        }

        return [];
    });

    $report = Report::create([
        'created_by' => auth('api')->id(),
        'title' => ucfirst($request->type) . ' Report',
        'type' => $request->type,
        'from_date' => $request->from_date,
        'to_date' => $request->to_date,
        'filters' => [
            'from_date' => $request->from_date,
            'to_date' => $request->to_date,
        ],
        'data' => $data,
    ]);

    return response()->json([
        'message' => 'Report generated successfully',
        'report' => $report,
        'results' => $data,
    ]);
}
    public function show($id)
    {
        return response()->json(
            Report::findOrFail($id)
        );
    }

    public function destroy($id)
    {
        $report = Report::findOrFail($id);

        $report->delete();

        return response()->json([
            'message' => 'Report deleted successfully'
        ]);
    }
}