<?php

namespace App\Events;

use App\Models\ClockPulse;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ClockPulseGenerated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $number;
    public int $pulseId;
    public string $endsAt;

    public function __construct(ClockPulse $pulse)
    {
        $this->number = $pulse->number;
        $this->pulseId = $pulse->id;
        $this->endsAt = $pulse->ends_at->toISOString();
    }

    public function broadcastOn(): Channel
    {
        return new Channel('clock');
    }

    public function broadcastAs(): string
    {
        return 'pulse';
    }
}
