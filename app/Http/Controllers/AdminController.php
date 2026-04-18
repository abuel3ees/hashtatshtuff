<?php

namespace App\Http\Controllers;

use App\Events\GameStateChanged;
use App\Events\LeaderboardUpdated;
use App\Jobs\AdvanceClockJob;
use App\Models\ClockPulse;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function index(): Response
    {
        $pulse = ClockPulse::current();

        return Inertia::render('admin/dashboard', [
            'leaderboard'  => User::leaderboard(),
            'gameState'    => Cache::get('game_state', 'waiting'),
            'currentPulse' => $pulse ? [
                'id'      => $pulse->id,
                'number'  => $pulse->number,
                'ends_at' => $pulse->ends_at->toISOString(),
            ] : null,
            'userCount'      => User::where('is_admin', false)->count(),
            'clockInterval'  => (int) Cache::get('clock_interval', 20),
        ]);
    }

    public function bulkCreate(Request $request): RedirectResponse
    {
        $validated = $request->validate(['count' => ['required', 'integer', 'min:1', 'max:500']]);

        $highest = (int) User::where('is_admin', false)->max('name');
        $start   = $highest + 1;
        $end     = $start + $validated['count'] - 1;

        $rows = [];
        $now  = now();
        foreach (range($start, $end) as $n) {
            $rows[] = [
                'name'       => (string) $n,
                'email'      => "{$n}@hashtat.local",
                'password'   => bcrypt((string) $n),
                'points'     => 0,
                'is_admin'   => false,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        User::insert($rows);

        return back()->with('success', "Created terminals {$start}–{$end}.");
    }

    public function startGame(): RedirectResponse
    {
        if (Cache::get('game_state') === 'active') {
            return back()->with('info', 'Game already active.');
        }

        Cache::put('game_state', 'active', now()->addHours(4));
        Cache::put('clock_running', true, now()->addHours(4));

        AdvanceClockJob::dispatch();
        event(new GameStateChanged('active'));

        return back()->with('success', 'Game started.');
    }

    public function stopGame(): RedirectResponse
    {
        Cache::put('game_state', 'waiting', now()->addHours(4));
        Cache::forget('clock_running');
        ClockPulse::where('is_active', true)->update(['is_active' => false]);

        event(new GameStateChanged('waiting'));

        return back()->with('success', 'Game stopped.');
    }

    public function resetGame(): RedirectResponse
    {
        Cache::put('game_state', 'waiting', now()->addHours(4));
        Cache::forget('clock_running');
        ClockPulse::where('is_active', true)->update(['is_active' => false]);
        User::where('is_admin', false)->update(['points' => 0, 'last_pulse_id' => null]);

        event(new GameStateChanged('waiting'));
        event(new LeaderboardUpdated([]));

        return back()->with('success', 'Game reset — all scores cleared.');
    }

    public function setInterval(Request $request): RedirectResponse
    {
        $seconds = $request->validate(['seconds' => ['required', 'integer', 'in:5,10,15,20']])['seconds'];
        Cache::put('clock_interval', $seconds, now()->addHours(4));

        return back()->with('success', "Pulse interval set to {$seconds}s.");
    }

    public function resetScores(): RedirectResponse
    {
        User::where('is_admin', false)->update(['points' => 0, 'last_pulse_id' => null]);
        event(new LeaderboardUpdated(User::leaderboard()->toArray()));

        return back()->with('success', 'All scores reset.');
    }

    public function removeAllUsers(): RedirectResponse
    {
        // Stop the game first
        Cache::put('game_state', 'waiting', now()->addHours(4));
        Cache::forget('clock_running');
        ClockPulse::where('is_active', true)->update(['is_active' => false]);

        User::where('is_admin', false)->delete();

        event(new GameStateChanged('waiting'));
        event(new LeaderboardUpdated([]));

        return back()->with('success', 'All terminals removed.');
    }
}
