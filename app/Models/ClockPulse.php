<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClockPulse extends Model
{
    protected $fillable = ['number', 'is_active', 'started_at', 'ends_at'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'started_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    public static function current(): ?self
    {
        return static::where('is_active', true)->latest()->first();
    }

    public function timeRemaining(): int
    {
        return max(0, (int) now()->diffInSeconds($this->ends_at, false));
    }
}
