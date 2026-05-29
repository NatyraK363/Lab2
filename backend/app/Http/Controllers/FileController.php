<?php

namespace App\Http\Controllers;

use App\Models\File;
use Illuminate\Http\Request;

class FileController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:5120',
            'entity' => 'required|string',
            'entity_id' => 'required|integer',
        ]);

        $uploadedFile = $request->file('file');

        $path = $uploadedFile->store('uploads', 'public');

        $file = File::create([
            'entity' => $request->entity,
            'entity_id' => $request->entity_id,
            'filename' => $uploadedFile->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $uploadedFile->getSize(),
            'uploaded_by' => auth('api')->id(),
        ]);

        return response()->json([
            'message' => 'File uploaded successfully',
            'file' => $file
        ]);
    }

    public function index()
    {
        return response()->json(
            File::latest()->get()
        );
    }
}