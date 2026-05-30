<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class DepartmentController extends Controller
{
    public function index()
    {
        return response()->json(
            Cache::remember(
                'departments_list',
                now()->addMinutes(10),
                function () {
                    return Department::latest()->get();
                }
            )
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $department = Department::create($data);

        Cache::forget('departments_list');

        return response()->json($department, 201);
    }

    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $department->update($data);

        Cache::forget('departments_list');

        return response()->json($department);
    }

    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        Cache::forget('departments_list');

        return response()->json([
            'message' => 'Department deleted successfully'
        ]);
    }
}