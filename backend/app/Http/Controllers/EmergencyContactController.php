<?php

namespace App\Http\Controllers;

use App\Models\EmergencyContact;
use App\Models\Patient;
use Illuminate\Http\Request;

class EmergencyContactController extends Controller
{
   public function index()
{
    $contacts = EmergencyContact::all();

    return response()->json([
        'data' => $contacts
    ]);
}

public function store(Request $request)
{
    $data = $request->validate([
        'phone' => 'required|string|max:30',
        'department' => 'required|string|max:255',
    ]);

    $contact = EmergencyContact::create([
        'phone' => $data['phone'],
        'department' => $data['department'],
    ]);

    return response()->json([
        'message' => 'Emergency contact created successfully',
        'data' => $contact
    ], 201);
}
    public function showMine(Request $request)
    {
        $user = $request->user();

        $patient = Patient::where('user_id', $user->id)->first();

        if (!$patient) {
            return response()->json([
                'message' => 'Patient profile not found'
            ], 404);
        }

        $contact = EmergencyContact::where('patient_id', $patient->id)->first();

        return response()->json([
            'data' => $contact
        ]);
    }

    public function saveMine(Request $request)
    {
        return response()->json([
            'message' => 'Patients cannot add or edit emergency contacts'
        ], 403);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();
        $role = strtolower($user->role);

        if (!in_array($role, ['admin', 'receptionist'])) {
            return response()->json([
                'message' => 'Unauthorized',
                'your_role' => $user->role
            ], 403);
        }

        $contact = EmergencyContact::findOrFail($id);
        $contact->delete();

        return response()->json([
            'message' => 'Emergency contact deleted successfully'
        ]);
    }
}