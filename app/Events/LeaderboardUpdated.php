<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeaderboardUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $leaderboard;

    public function __construct(array $leaderboard)
    {
        $this->leaderboard = $leaderboard;
    }

    public function broadcastOn(): Channel
    {
        return new Channel('leaderboard');
    }

    public function broadcastAs(): string
    {
        return 'updated';
    }
}
