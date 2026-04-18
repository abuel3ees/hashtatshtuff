<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\GameController;
use App\Http\Middleware\EnsureAdmin;
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
});

require __DIR__.'/settings.php';
