<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth('api')->user();

        $photo = File::where('entity', 'user')
            ->where('entity_id', $user->id)
            ->latest()
            ->first();

        return response()->json([
            'user' => $user,
            'photo' => $photo
                ? asset('storage/' . $photo->file_path)
                : null,
        ]);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:5120',
        ]);

        $user = auth('api')->user();

        $path = $request->file('photo')->store('uploads', 'public');

        File::create([
            'entity' => 'user',
            'entity_id' => $user->id,
            'filename' => $request->file('photo')->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $request->file('photo')->getSize(),
            'uploaded_by' => $user->id,
        ]);

        return response()->json([
            'message' => 'Profile photo uploaded successfully',
            'photo_url' => asset('storage/' . $path),
        ]);
    }

    public function update(Request $request)
{
    $user = auth('api')->user();

    $data = $request->validate([
        'name' => 'required|string|max:255',
        'photo' => 'nullable|image|max:5120',
    ]);

    $user->update([
        'name' => $data['name'],
    ]);

    $photoUrl = null;

    if ($request->hasFile('photo')) {
        $path = $request->file('photo')->store('uploads', 'public');

        $file = \App\Models\File::create([
            'entity' => 'user',
            'entity_id' => $user->id,
            'filename' => $request->file('photo')->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $request->file('photo')->getSize(),
            'uploaded_by' => $user->id,
        ]);

        $photoUrl = asset('storage/' . $file->file_path);
    }

    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => $user,
        'photo' => $photoUrl,
    ]);
}
}