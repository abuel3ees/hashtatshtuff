<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\GameController;
use App\Http\Middleware\EnsureAdmin;
use App\Models\ClockPulse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/presentation', fn () => Inertia::render('presentation', [
    'loginUrl' => url('/login'),
]))->name('presentation');

Route::middleware('guest')->group(function () {
    Route::get('/', fn () => redirect()->route('login'))->name('home');
    Route::get('/login', fn () => Inertia::render('landing'))->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    Route::prefix('admin')->name('admin.')->middleware(EnsureAdmin::class)->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('dashboard');
        Route::post('/users/bulk', [AdminController::class, 'bulkCreate'])->name('users.bulk');
        Route::post('/game/start', [AdminController::class, 'startGame'])->name('game.start');
        Route::post('/game/stop', [AdminController::class, 'stopGame'])->name('game.stop');
        Route::post('/game/reset', [AdminController::class, 'resetGame'])->name('game.reset');
        Route::post('/clock/interval', [AdminController::class, 'setInterval'])->name('clock.interval');
        Route::post('/scores/reset', [AdminController::class, 'resetScores'])->name('scores.reset');
        Route::delete('/users', [AdminController::class, 'removeAllUsers'])->name('users.remove-all');
    });

    Route::get('/dashboard', [GameController::class, 'dashboard'])->name('dashboard');
    Route::post('/game/submit', [GameController::class, 'submit'])->name('game.submit');
    Route::get('/game/pulse-id', fn () => response()->json([
        'id' => ClockPulse::where('is_active', true)->value('id') ?? 0,
    ]))->name('game.pulse-id');

    Route::post('/game/heartbeat', function () {
        $user = Auth::user();
        $online = Cache::get('online_users', []);
        $online[$user->id] = [
            'id' => $user->id,
            'callsign' => $user->callsign(),
            'terminal' => $user->name,
            'is_admin' => $user->is_admin,
            'ts' => now()->timestamp,
        ];
        Cache::put('online_users', $online, 60);
        return response()->json(['ok' => true]);
    })->name('game.heartbeat');

    Route::get('/admin/lobby', function () {
        $cutoff = now()->timestamp - 10;
        $online = collect(Cache::get('online_users', []))
            ->filter(fn ($u) => $u['ts'] >= $cutoff && ! $u['is_admin'])
            ->values();
        return response()->json(['users' => $online]);
    })->middleware(EnsureAdmin::class)->name('admin.lobby');
});

require __DIR__.'/settings.php';
