import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');`;

const GRID_BG: React.CSSProperties = {
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
};

const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

export default function Landing() {
    const { data, setData, post, processing, errors } = useForm({
        terminal_id: '',
        access_key: '',
        callsign: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Binary Clock Workshop" />
            <style>{FONTS}</style>

            <div
                className="min-h-screen bg-zinc-950 flex items-center justify-center px-4"
                style={GRID_BG}
            >
                <div className="w-full max-w-90">

                    {/* Logo mark */}
                    <div className="flex flex-col items-center mb-10 gap-3">
                        <div
                            className="flex items-center justify-center w-14 h-14 rounded-2xl border border-zinc-800 bg-zinc-900"
                            style={{ boxShadow: '0 0 24px rgba(16,185,129,0.15)' }}
                        >
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                <rect x="2" y="2" width="6" height="6" rx="1" fill="#10b981" />
                                <rect x="11" y="2" width="6" height="6" rx="1" fill="#10b981" fillOpacity=".4" />
                                <rect x="20" y="2" width="6" height="6" rx="1" fill="#10b981" />
                                <rect x="2" y="11" width="6" height="6" rx="1" fill="#10b981" fillOpacity=".2" />
                                <rect x="11" y="11" width="6" height="6" rx="1" fill="#10b981" />
                                <rect x="20" y="11" width="6" height="6" rx="1" fill="#10b981" fillOpacity=".4" />
                                <rect x="2" y="20" width="6" height="6" rx="1" fill="#10b981" />
                                <rect x="11" y="20" width="6" height="6" rx="1" fill="#10b981" fillOpacity=".2" />
                                <rect x="20" y="20" width="6" height="6" rx="1" fill="#10b981" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <h1 className="text-white text-xl font-bold tracking-tight" style={mono}>
                                BINARY<span className="text-emerald-500">.</span>CLOCK
                            </h1>
                            <p className="text-zinc-600 text-xs mt-0.5 tracking-widest" style={mono}>
                                HASHTAT WORKSHOP
                            </p>
                        </div>
                    </div>

                    {/* Form card */}
                    <form
                        onSubmit={submit}
                        className="rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur p-7 space-y-4"
                        style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.5)' }}
                    >
                        <p className="text-zinc-500 text-xs tracking-widest uppercase mb-5" style={mono}>
                            Authenticate Terminal
                        </p>

                        {/* Terminal ID */}
                        <Field
                            label="Terminal ID"
                            id="terminal_id"
                            type="text"
                            inputMode="numeric"
                            autoFocus
                            placeholder="01"
                            value={data.terminal_id}
                            onChange={(v) => setData('terminal_id', v)}
                            error={errors.terminal_id}
                        />

                        {/* Access Key */}
                        <Field
                            label="Access Key"
                            id="access_key"
                            type="password"
                            placeholder="••••"
                            value={data.access_key}
                            onChange={(v) => setData('access_key', v)}
                        />

                        {/* Callsign divider */}
                        <div className="flex items-center gap-3 py-1">
                            <div className="flex-1 h-px bg-zinc-800" />
                            <span className="text-zinc-700 text-xs" style={mono}>optional</span>
                            <div className="flex-1 h-px bg-zinc-800" />
                        </div>

                        {/* Callsign */}
                        <Field
                            label="Callsign"
                            id="callsign"
                            type="text"
                            placeholder="e.g. NOVA, STRIKER…"
                            value={data.callsign}
                            onChange={(v) => setData('callsign', v)}
                            hint="Your name on the leaderboard"
                        />

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full mt-2 py-3 rounded-xl font-semibold text-sm tracking-widest uppercase transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                                ...mono,
                                background: processing ? 'transparent' : 'rgba(16,185,129,0.12)',
                                border: '1.5px solid #10b981',
                                color: '#10b981',
                                boxShadow: processing ? 'none' : '0 0 16px rgba(16,185,129,0.1)',
                            }}
                        >
                            {processing ? 'Syncing…' : 'Sync to System'}
                        </button>
                    </form>

                    <p className="text-center text-xs text-zinc-800 mt-6" style={mono}>
                        v2.0 · HASHTAT
                    </p>
                </div>
            </div>
        </>
    );
}

function Field({
    label,
    id,
    hint,
    error,
    onChange,
    ...inputProps
}: {
    label: string;
    id: string;
    hint?: string;
    error?: string;
    onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    return (
        <div>
            <label className="block text-xs text-zinc-500 mb-1.5 tracking-widest uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }} htmlFor={id}>
                {label}
            </label>
            <input
                id={id}
                autoComplete="off"
                {...inputProps}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-zinc-950 border rounded-lg px-4 py-2.5 text-white text-base focus:outline-none transition-colors"
                style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    borderColor: error ? '#ef4444' : 'rgba(255,255,255,0.08)',
                    // @ts-expect-error CSS var
                    '--tw-ring-color': '#10b981',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#10b981'; }}
                onBlur={(e) => { e.target.style.borderColor = error ? '#ef4444' : 'rgba(255,255,255,0.08)'; }}
            />
            {hint && !error && (
                <p className="text-zinc-700 text-xs mt-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{hint}</p>
            )}
            {error && (
                <p className="text-red-400 text-xs mt-1" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                    ✗ {error}
                </p>
            )}
        </div>
    );
}
