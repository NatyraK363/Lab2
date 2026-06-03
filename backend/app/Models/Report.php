<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    protected $fillable = [
        'created_by',
        'title',
        'type',
        'from_date',
        'to_date',
        'filters',
        'data',
    ];

    protected $casts = [
        'filters' => 'array',
        'data' => 'array',
    ];
}