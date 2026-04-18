<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    protected $fillable = ['name', 'display_name', 'email', 'password', 'points', 'is_admin', 'last_pulse_id'];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }

    public function callsign(): string
    {
        return $this->display_name ?: 'T-' . $this->name;
    }

    public static function leaderboard(int $limit = 10): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('is_admin', false)
            ->orderByDesc('points')
            ->limit($limit)
            ->get(['id', 'name', 'display_name', 'points']);
    }
}
