<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Patient;
use App\Models\RefreshToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    private function createRefreshToken($user)
    {
        $plainToken = Str::random(64);

        RefreshToken::create([
            'user_id' => $user->id,
            'token_hash' => hash('sha256', $plainToken),
            'expires_at' => now()->addDays(7),
        ]);

        return $plainToken;
    }

    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $patientRole = Role::where('name', 'patient')->first();

        if ($patientRole) {
            $user->roles()->attach($patientRole->id, [
                'assigned_at' => now()
            ]);
        }

        Patient::create([
            'user_id' => $user->id,
            'date_of_birth' => '2000-01-01',
            'gender' => 'unknown',
            'phone' => '00000000',
            'address' => null,
            'blood_type' => null,
        ]);

        $token = auth('api')->login($user);
        $refreshToken = $this->createRefreshToken($user);

        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user->load('roles'),
            'token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!$token = auth('api')->attempt($credentials)) {
            return response()->json([
                'message' => 'Invalid email or password'
            ], 401);
        }

        $user = auth('api')->user();
        $refreshToken = $this->createRefreshToken($user);

        return response()->json([
            'message' => 'Login successful',
            'user' => $user->load('roles'),
            'token' => $token,
            'refresh_token' => $refreshToken,
            'token_type' => 'bearer',
        ]);
    }

    public function refresh(Request $request)
    {
        $data = $request->validate([
            'refresh_token' => 'required|string',
        ]);

        $hashedToken = hash('sha256', $data['refresh_token']);

        $storedToken = RefreshToken::where('token_hash', $hashedToken)
            ->whereNull('revoked_at')
            ->where('expires_at', '>', now())
            ->first();

        if (!$storedToken) {
            return response()->json([
                'message' => 'Invalid or expired refresh token'
            ], 401);
        }

        $user = User::findOrFail($storedToken->user_id);

        $storedToken->update([
            'revoked_at' => now(),
        ]);

        $newAccessToken = auth('api')->login($user);
        $newRefreshToken = $this->createRefreshToken($user);

        return response()->json([
            'message' => 'Token refreshed successfully',
            'token' => $newAccessToken,
            'refresh_token' => $newRefreshToken,
            'token_type' => 'bearer',
        ]);
    }

    public function me()
    {
        return response()->json([
            'user' => auth('api')->user()->load('roles')
        ]);
    }

    public function logout(Request $request)
    {
        if ($request->refresh_token) {
            RefreshToken::where('token_hash', hash('sha256', $request->refresh_token))
                ->update([
                    'revoked_at' => now()
                ]);
        }

        auth('api')->logout();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }
}