<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;
use App\Models\Patient;
use App\Models\Department;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ExportController extends Controller
{
    public function export(Request $request, $type)
    {
        $format = $request->query('format', 'csv');

        if ($format !== 'csv') {
            return response()->json([
                'message' => 'Only CSV export is supported for now.'
            ], 422);
        }

        $cacheKey = 'export_' . $type . '_csv';

        $data = Cache::remember($cacheKey, now()->addMinutes(10), function () use ($type) {
            return $this->getExportData($type);
        });

        return $this->downloadCsv($data, $type . '_export.csv');
    }

    private function getExportData($type)
    {
        return match ($type) {
            'users' => User::with('roles')->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('name')->join(', '),
                    'created_at' => $user->created_at,
                ];
            })->toArray(),

            'doctors' => Doctor::with(['user', 'department', 'specialty'])->get()->map(function ($doctor) {
                return [
                    'id' => $doctor->id,
                    'name' => $doctor->first_name . ' ' . $doctor->last_name,
                    'email' => $doctor->user?->email,
                    'department' => $doctor->department?->name,
                    'specialty' => $doctor->specialty?->name,
                    'phone' => $doctor->phone,
                    'experience_years' => $doctor->experience_years,
                ];
            })->toArray(),

            'patients' => Patient::with('user')->get()->map(function ($patient) {
                return [
                    'id' => $patient->id,
                    'name' => $patient->user?->name,
                    'email' => $patient->user?->email,
                    'phone' => $patient->phone,
                    'gender' => $patient->gender,
                    'blood_type' => $patient->blood_type,
                ];
            })->toArray(),

            'departments' => Department::all()->map(function ($department) {
                return [
                    'id' => $department->id,
                    'name' => $department->name,
                    'description' => $department->description,
                    'created_at' => $department->created_at,
                ];
            })->toArray(),

            'appointments' => Appointment::with(['doctor', 'patient.user'])->get()->map(function ($appointment) {
                return [
                    'id' => $appointment->id,
                    'patient' => $appointment->patient?->user?->name,
                    'doctor' => $appointment->doctor?->first_name . ' ' . $appointment->doctor?->last_name,
                    'date' => $appointment->appointment_date,
                    'time' => $appointment->appointment_time,
                    'status' => $appointment->status,
                    'reason' => $appointment->reason,
                ];
            })->toArray(),

            default => abort(404, 'Export type not found.'),
        };
    }

    private function downloadCsv($rows, $filename)
    {
        if (empty($rows)) {
            return response()->json([
                'message' => 'No data available for export.'
            ], 404);
        }

        $headers = array_keys($rows[0]);

        return response()->streamDownload(function () use ($rows, $headers) {
            $file = fopen('php://output', 'w');

            fputcsv($file, $headers);

            foreach ($rows as $row) {
                fputcsv($file, $row);
            }

            fclose($file);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}