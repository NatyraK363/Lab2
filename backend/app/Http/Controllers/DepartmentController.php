<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    public function index()
    {
        return response()->json(Department::latest()->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $department = Department::create($data);

        return response()->json($department, 201);
    }

    public function destroy($id)
    {
        Department::findOrFail($id)->delete();

        return response()->json([
            'message' => 'Department deleted successfully'
        ]);
    }
}