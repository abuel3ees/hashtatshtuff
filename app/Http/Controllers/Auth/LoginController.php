<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LoginController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'terminal_id' => ['required', 'string'],
            'access_key'  => ['required', 'string'],
            'callsign'    => ['nullable', 'string', 'max:20', 'regex:/^[a-zA-Z0-9_\- ]+$/'],
        ]);

        if (Auth::attempt(['name' => $credentials['terminal_id'], 'password' => $credentials['access_key']])) {
            $request->session()->regenerate();

            $user = Auth::user();

            if (! empty($credentials['callsign'])) {
                $user->update(['display_name' => strtoupper(trim($credentials['callsign']))]);
            }

            return $user->is_admin
                ? redirect()->route('admin.dashboard')
                : redirect()->route('dashboard');
        }

        return back()->withErrors(['terminal_id' => 'Invalid Terminal ID or Access Key.'])->onlyInput('terminal_id');
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }
}
