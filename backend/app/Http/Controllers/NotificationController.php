<?php

namespace App\Http\Controllers;

use App\Models\Notification;

class NotificationController extends Controller
{
    public function index()
    {
        return response()->json(
            Notification::where('user_id', auth('api')->id())
                ->latest()
                ->get()
        );
    }

    public function markAsRead($id)
    {
        $notification = Notification::where('user_id', auth('api')->id())
            ->findOrFail($id);

        $notification->update([
            'is_read' => true,
        ]);

        return response()->json([
            'message' => 'Notification marked as read'
        ]);
    }
}