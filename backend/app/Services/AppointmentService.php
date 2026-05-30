<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\Setting;
use Carbon\Carbon;

class AppointmentService
{
    public function isDoctorAvailable($doctorId, $date, $time)
    {
        $duration = (int)(
            Setting::where('key', 'appointment_duration')
                ->value('value') ?? 30
        );

        $requestedTime = Carbon::parse($time);

        $startTime = $requestedTime
            ->copy()
            ->subMinutes($duration)
            ->format('H:i:s');

        $endTime = $requestedTime
            ->copy()
            ->addMinutes($duration)
            ->format('H:i:s');

        return !Appointment::where('doctor_id', $doctorId)
            ->where('appointment_date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->whereBetween('appointment_time', [$startTime, $endTime])
            ->exists();
    }
}