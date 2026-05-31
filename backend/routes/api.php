<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\SpecialtyController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\PatientController;
use App\Models\Role;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::post('/refresh-token', [AuthController::class, 'refresh']);
Route::post('/logout', [AuthController::class, 'logout']);

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

Route::get('/departments', [DepartmentController::class, 'index']);
Route::get('/specialties', [SpecialtyController::class, 'index']);
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/exports/{type}', [ExportController::class, 'export']);
Route::post('/imports/{type}', [ExportController::class, 'import']);

/*
|--------------------------------------------------------------------------
| Protected routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/departments', [DepartmentController::class, 'store']);
    Route::put('/departments/{id}', [DepartmentController::class, 'update']);
    Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);

    Route::get('/roles', function () {
        return response()->json(Role::all());
    });

    Route::get('/admin/users', [UserController::class, 'index']);
    Route::post('/admin/users', [UserController::class, 'store']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);

    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::get('/appointments', [AppointmentController::class, 'index']);
    Route::put('/appointments/{id}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);

    Route::post('/doctors', [DoctorController::class, 'store']);
    Route::put('/doctors/{id}', [DoctorController::class, 'update']);
    Route::delete('/doctors/{id}', [DoctorController::class, 'destroy']);

    Route::post('/specialties', [SpecialtyController::class, 'store']);
    Route::delete('/specialties/{id}', [SpecialtyController::class, 'destroy']);

    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    Route::patch('/appointments/{id}/status', [AppointmentController::class, 'updateStatus']);

    Route::get('/doctor/dashboard/stats', [DashboardController::class, 'doctorStats']);

    Route::get('/patients', [PatientController::class, 'index']);

    Route::get('/files', [FileController::class, 'index']);
    Route::post('/files/upload', [FileController::class, 'upload']);

    Route::get('/medical-records', [MedicalRecordController::class, 'myPatients']);
    Route::get('/doctor/my-patients', [MedicalRecordController::class, 'myPatients']);
    Route::post('/medical-records', [MedicalRecordController::class, 'store']);
    Route::put('/medical-records/{id}', [MedicalRecordController::class, 'update']);
    Route::delete('/medical-records/{id}', [MedicalRecordController::class, 'destroy']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::patch('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

});