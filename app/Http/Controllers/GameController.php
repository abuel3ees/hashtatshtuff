<?php

namespace App\Http\Controllers;

use App\Events\LeaderboardUpdated;
use App\Models\ClockPulse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    public function dashboard(): Response
    {
        $pulse = ClockPulse::current();
        /** @var User $user */
        $user = auth()->user();

        return Inertia::render('student/dashboard', [
            'user' => [
                'id'           => $user->id,
                'name'         => $user->name,
                'display_name' => $user->display_name,
                'callsign'     => $user->callsign(),
                'points'       => $user->points,
            ],
            'gameState'    => Cache::get('game_state', 'waiting'),
            'currentPulse' => $pulse ? [
                'id'      => $pulse->id,
                'number'  => $pulse->number,
                'ends_at' => $pulse->ends_at->toISOString(),
            ] : null,
        ]);
    }

    public function submit(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        if (Cache::get('game_state') !== 'active') {
            return response()->json(['error' => 'Game is not active.'], 422);
        }

        $pulse = ClockPulse::current();

        if (! $pulse) {
            return response()->json(['error' => 'No active pulse.'], 422);
        }

        if ($user->last_pulse_id === $pulse->id) {
            return response()->json(['error' => 'Already submitted for this pulse.'], 422);
        }

        $value = $request->validate(['value' => ['required', 'integer', 'min:0', 'max:255']])['value'];

        if ($value !== $pulse->number) {
            return response()->json(['correct' => false]);
        }

        $points = max(1, $pulse->timeRemaining());

        $user->increment('points', $points);
        $user->update(['last_pulse_id' => $pulse->id]);

        event(new LeaderboardUpdated(User::leaderboard()->toArray()));

        return response()->json([
            'correct'      => true,
            'points'       => $points,
            'total_points' => $user->fresh()->points,
        ]);
    }
}
