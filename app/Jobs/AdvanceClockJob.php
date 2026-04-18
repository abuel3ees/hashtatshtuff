<?php

namespace App\Jobs;

use App\Events\ClockPulseGenerated;
use App\Models\ClockPulse;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Cache;

class AdvanceClockJob implements ShouldQueue
{
    use Queueable;

    public function handle(): void
    {
        if (! Cache::get('clock_running', false)) {
            return;
        }

        ClockPulse::where('is_active', true)->update(['is_active' => false]);

        $seconds = (int) Cache::get('clock_interval', 20);
        $endsAt  = now()->addSeconds($seconds);

        $pulse = ClockPulse::create([
            'number'     => random_int(0, 255),
            'is_active'  => true,
            'started_at' => now(),
            'ends_at'    => $endsAt,
        ]);

        event(new ClockPulseGenerated($pulse));

        static::dispatch()->delay($endsAt);
    }
}
