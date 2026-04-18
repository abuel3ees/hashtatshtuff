<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Presence channel: tracks connected terminals in the lobby
Broadcast::channel('game.lobby', function ($user) {
    return [
        'id'       => $user->id,
        'callsign' => $user->display_name ?: 'T-' . $user->name,
        'terminal' => $user->name,
        'is_admin' => $user->is_admin,
    ];
});
