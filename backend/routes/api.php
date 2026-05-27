<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\Admin\UserController;
use App\Models\Role;
use App\Http\Controllers\SpecialtyController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/departments', [DepartmentController::class, 'index']);

Route::middleware('auth:api')->group(function () {

    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/departments', [DepartmentController::class, 'store']);
    Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);

    Route::get('/roles', function () {
        return response()->json(Role::all());
    });

    Route::get('/admin/users', [UserController::class, 'index']);
    Route::post('/admin/users', [UserController::class, 'store']);
    Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);
    
    Route::get('/specialties', [SpecialtyController::class, 'index']);
    Route::post('/specialties', [SpecialtyController::class, 'store']);
    Route::delete('/specialties/{id}', [SpecialtyController::class, 'destroy']);
    
    Route::get('/doctors', [DoctorController::class, 'index']);
    Route::post('/doctors', [DoctorController::class, 'store']);
    Route::delete('/doctors/{id}', [DoctorController::class, 'destroy']);
});