<?php

namespace App\Http\Controllers;

use App\Models\Specialty;
use Illuminate\Http\Request;

class SpecialtyController extends Controller
{
    public function index()
    {
        return response()->json(Specialty::latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $specialty = Specialty::create($data);

        return response()->json($specialty, 201);
    }

    public function destroy($id)
    {
        Specialty::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Specialty deleted successfully'
        ]);
    }
}