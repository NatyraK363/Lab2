<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = [
        'entity',
        'entity_id',
        'filename',
        'file_path',
        'file_size',
        'uploaded_by',
    ];
}