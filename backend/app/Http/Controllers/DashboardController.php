<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Doctor;
use App\Models\Department;
use App\Models\Appointment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    public function stats()
    {
        $stats = Cache::remember('admin_dashboard_stats', now()->addMinutes(5), function () {
            return [
                'total_users' => User::count(),
                'total_doctors' => Doctor::count(),
                'total_departments' => Department::count(),
                'total_appointments' => Appointment::count(),

                'recent_users' => User::with('roles')
                    ->latest()
                    ->take(5)
                    ->get(),

                'recent_appointments' => Appointment::with(['doctor', 'patient.user'])
                    ->latest()
                    ->take(5)
                    ->get(),

                'appointments_by_date' => Appointment::select(
                        'appointment_date',
                        DB::raw('COUNT(*) as total')
                    )
                    ->groupBy('appointment_date')
                    ->orderBy('appointment_date')
                    ->take(7)
                    ->get(),
            ];
        });

        return response()->json($stats);
    }

    public function doctorStats()
    {
        $user = auth('api')->user();
        $doctor = $user->doctor;

        if (!$doctor) {
            return response()->json([
                'total_appointments' => 0,
                'pending' => 0,
                'confirmed' => 0,
                'completed' => 0,
            ]);
        }

        $stats = Cache::remember(
            'doctor_dashboard_stats_' . $doctor->id,
            now()->addMinutes(5),
            function () use ($doctor) {
                return [
                    'total_appointments' => $doctor->appointments()->count(),
                    'pending' => $doctor->appointments()->where('status', 'pending')->count(),
                    'confirmed' => $doctor->appointments()->where('status', 'confirmed')->count(),
                    'completed' => $doctor->appointments()->where('status', 'completed')->count(),
                ];
            }
        );

        return response()->json($stats);
    }
}