import { Head, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getEcho } from '@/hooks/use-echo';

interface Props {
    user: { id: number; name: string; display_name: string | null; callsign: string; points: number };
    gameState: 'waiting' | 'active';
    currentPulse: { id: number; number: number; ends_at: string } | null;
}

const BIT_VALUES = [128, 64, 32, 16, 8, 4, 2, 1] as const;
const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');`;
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

/* ── DIP Switch ─────────────────────────────────────── */
function DipSwitch({ value, isOn, onToggle, disabled }: { value: number; isOn: boolean; onToggle: () => void; disabled: boolean }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <button
                type="button"
                onClick={onToggle}
                disabled={disabled}
                aria-label={`Bit ${value}`}
                style={{
                    width: 38, height: 76,
                    background: isOn ? 'rgba(5,46,22,0.8)' : 'rgba(24,24,27,0.9)',
                    border: `2px solid ${isOn ? '#10b981' : 'rgba(63,63,70,0.8)'}`,
                    borderRadius: 10,
                    position: 'relative',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'border-color 0.08s, background 0.08s',
                    boxShadow: isOn ? '0 0 12px rgba(16,185,129,0.25)' : 'none',
                    opacity: disabled ? 0.4 : 1,
                }}
            >
                {/* Centre line */}
                <div style={{ position: 'absolute', left: 6, right: 6, top: '50%', height: 1, background: 'rgba(255,255,255,0.06)' }} />
                {/* Knob */}
                <div style={{
                    position: 'absolute',
                    left: 5, right: 5, height: 28,
                    top: isOn ? 4 : undefined,
                    bottom: isOn ? undefined : 4,
                    background: isOn ? '#10b981' : '#3f3f46',
                    borderRadius: 6,
                    transition: 'top 0.08s ease, bottom 0.08s ease, background 0.08s',
                    boxShadow: isOn ? '0 0 10px rgba(16,185,129,0.5)' : 'none',
                }} />
            </button>
            <span style={{ ...mono, fontSize: 10, color: isOn ? '#10b981' : '#52525b', transition: 'color 0.1s' }}>
                {value}
            </span>
        </div>
    );
}

/* ── Main Component ──────────────────────────────────── */
export default function StudentDashboard({ user, gameState: initState, currentPulse }: Props) {
    const [switches, setSwitches]     = useState<boolean[]>(Array(8).fill(false));
    const [target, setTarget]         = useState<number | null>(currentPulse?.number ?? null);
    const [endsAt, setEndsAt]         = useState<number | null>(currentPulse ? new Date(currentPulse.ends_at).getTime() : null);
    const [timeLeft, setTimeLeft]     = useState(0);
    const [totalPoints, setTotal]     = useState(user.points);
    const [gameState, setGameState]   = useState<'waiting' | 'active'>(initState);
    const [submitted, setSubmitted]   = useState(false);
    const [feedback, setFeedback]     = useState<{ pts: number; key: number } | null>(null);
    const [lobbyCount, setLobbyCount] = useState(0);
    const feedbackTimer               = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pulseDuration               = useRef(currentPulse ? Math.round((new Date(currentPulse.ends_at).getTime() - Date.now()) / 1000) : 20);

    const sum     = switches.reduce((acc, on, i) => acc + (on ? BIT_VALUES[i] : 0), 0);
    const isMatch = target !== null && sum === target && gameState === 'active';

    /* Countdown */
    useEffect(() => {
        if (!endsAt) { setTimeLeft(0); return; }
        const id = setInterval(() => setTimeLeft(Math.max(0, Math.ceil((endsAt - Date.now()) / 1000))), 200);
        return () => clearInterval(id);
    }, [endsAt]);

    /* Echo */
    useEffect(() => {
        const echo = getEcho();

        echo.channel('clock').listen('.pulse', () => {
            window.location.reload();
        });

        echo.channel('game').listen('.state', (e: { state: 'waiting' | 'active' }) => {
            setGameState(e.state);
            if (e.state === 'waiting') { setSwitches(Array(8).fill(false)); setSubmitted(false); }
        });

        echo.join('game.lobby')
            .here((users: { id: number; is_admin: boolean }[]) => setLobbyCount(users.filter(u => !u.is_admin).length))
            .joining((u: { is_admin: boolean }) => { if (!u.is_admin) setLobbyCount(c => c + 1); })
            .leaving((u: { is_admin: boolean }) => { if (!u.is_admin) setLobbyCount(c => Math.max(0, c - 1)); });

        return () => { echo.leave('clock'); echo.leave('game'); echo.leave('game.lobby'); };
    }, []);

    /* Auto-submit on match */
    useEffect(() => {
        if (!isMatch || submitted) return;
        setSubmitted(true);

        const xsrf = decodeURIComponent(document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] ?? '');
        fetch('/game/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', 'X-XSRF-TOKEN': xsrf },
            body: JSON.stringify({ value: sum }),
        })
            .then(r => r.json())
            .then((d: { correct?: boolean; points?: number; total_points?: number }) => {
                if (d.correct && d.points !== undefined) {
                    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
                    setFeedback({ pts: d.points, key: Date.now() });
                    setTotal(d.total_points ?? totalPoints + d.points);
                    feedbackTimer.current = setTimeout(() => setFeedback(null), 2500);
                }
            })
            .catch(() => setSubmitted(false));
    }, [isMatch, submitted]);

    const progressPct = endsAt ? (timeLeft / (pulseDuration.current || 20)) * 100 : 0;

    return (
        <>
            <Head title="Processing Unit" />
            <style>{FONTS}{`
                @keyframes matchPulse {
                    0%,100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
                    50%     { box-shadow: 0 0 0 12px rgba(16,185,129,0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; } to { opacity: 1; }
                }
                .match-ring { animation: matchPulse 0.8s ease-out infinite; }
                .slide-up   { animation: slideUp 0.4s ease-out; }
                .fade-in    { animation: fadeIn 0.5s ease-out; }
            `}</style>

            <div className="min-h-screen bg-zinc-950 text-white" style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
            }}>
                {/* ── STANDBY overlay ── */}
                {gameState === 'waiting' && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-8 px-6 fade-in"
                        style={{ background: 'rgba(9,9,11,0.97)' }}>

                        {/* Logo */}
                        <div style={{ opacity: 0.4, textAlign: 'center', ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#52525b' }}>
                            BINARY<span style={{ color: '#10b981' }}>.</span>CLOCK · HASHTAT
                        </div>

                        {/* Identity card */}
                        <div className="rounded-2xl p-8 text-center space-y-4 w-full max-w-xs"
                            style={{ background: 'rgba(24,24,27,0.9)', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 0 40px rgba(0,0,0,0.5)' }}>
                            <p className="text-xs text-zinc-600 tracking-widest uppercase" style={mono}>TERMINAL AUTHENTICATED</p>
                            <div>
                                <p className="text-4xl font-bold text-white" style={mono}>{user.callsign}</p>
                                <p className="text-zinc-600 text-sm mt-1" style={mono}>T-{user.name}</p>
                            </div>
                            <div className="flex items-center justify-center gap-2 pt-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ boxShadow: '0 0 8px #10b981' }} />
                                <span className="text-emerald-400 text-sm" style={mono}>CONNECTED</span>
                            </div>
                            {lobbyCount > 0 && (
                                <p className="text-zinc-700 text-xs" style={mono}>{lobbyCount} terminal{lobbyCount !== 1 ? 's' : ''} online</p>
                            )}
                        </div>

                        {/* Waiting pulse */}
                        <div className="text-center space-y-2">
                            <p className="text-zinc-600 text-sm" style={mono}>Waiting for Game Master to initiate…</p>
                            <div className="flex justify-center gap-1.5">
                                {[0, 1, 2].map(i => (
                                    <div key={i} className="w-1 h-1 rounded-full bg-zinc-700 animate-pulse"
                                        style={{ animationDelay: `${i * 0.2}s` }} />
                                ))}
                            </div>
                        </div>

                        {/* Score carry-over */}
                        {totalPoints > 0 && (
                            <p className="text-zinc-700 text-xs" style={mono}>Session score: {totalPoints} pts</p>
                        )}
                    </div>
                )}

                {/* ── GAME UI ── */}
                <div className={`flex flex-col min-h-screen px-4 py-6 ${gameState === 'waiting' ? 'invisible' : 'slide-up'}`}>

                    {/* Header */}
                    <div className="flex items-center justify-between mb-auto w-full max-w-sm mx-auto">
                        <div>
                            <p className="text-xs text-zinc-600" style={mono}>TERMINAL</p>
                            <p className="text-white text-sm font-bold" style={mono}>{user.callsign}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-zinc-600" style={mono}>SCORE</p>
                            <p className="text-emerald-400 text-sm font-bold" style={mono}>{totalPoints}</p>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="flex flex-col items-center gap-7 my-8 w-full max-w-sm mx-auto">

                        {/* Target */}
                        <div className="text-center relative w-full">
                            <p className="text-[10px] text-zinc-600 tracking-widest uppercase mb-2" style={mono}>INCOMING PULSE</p>
                            <div
                                className={`text-8xl font-bold transition-colors duration-150 ${isMatch ? 'match-ring' : ''}`}
                                style={{ ...mono, color: target === null ? '#27272a' : isMatch ? '#10b981' : '#f4f4f5', display: 'inline-block', padding: '4px 12px', borderRadius: 12 }}
                            >
                                {target === null ? '—' : target}
                            </div>
                            {target !== null && (
                                <p className="text-[10px] text-zinc-700 mt-1" style={mono}>{target.toString(2).padStart(8, '0')}</p>
                            )}
                            {feedback && (
                                <div key={feedback.key} className="delta-badge absolute -top-4 left-1/2 -translate-x-1/2 text-sm font-bold text-emerald-400 pointer-events-none"
                                    style={{ ...mono, animation: 'slideUp 0.3s ease-out, fadeIn 0.2s' }}>
                                    +{feedback.pts} pts
                                </div>
                            )}
                        </div>

                        {/* Timer bar */}
                        <div className="w-full">
                            <div className="flex justify-between text-[10px] text-zinc-700 mb-1" style={mono}>
                                <span>PULSE TIMER</span><span>{timeLeft}s</span>
                            </div>
                            <div className="h-1 bg-zinc-900 rounded-full overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.04)' }}>
                                <div className="h-full rounded-full transition-all duration-300"
                                    style={{ width: `${progressPct}%`, background: timeLeft <= 5 ? '#ef4444' : '#10b981', boxShadow: `0 0 6px ${timeLeft <= 5 ? 'rgba(239,68,68,0.5)' : 'rgba(16,185,129,0.4)'}` }} />
                            </div>
                        </div>

                        {/* DIP Switches */}
                        <div>
                            <p className="text-[10px] text-zinc-600 tracking-widest uppercase text-center mb-4" style={mono}>DIP SWITCH ARRAY</p>
                            <div className="flex gap-2.5 justify-center">
                                {BIT_VALUES.map((val, idx) => (
                                    <DipSwitch
                                        key={val}
                                        value={val}
                                        isOn={switches[idx]}
                                        disabled={gameState !== 'active'}
                                        onToggle={() => setSwitches(prev => { const n = [...prev]; n[idx] = !n[idx]; return n; })}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Decimal output */}
                        <div className="text-center">
                            <p className="text-[10px] text-zinc-600 tracking-widest uppercase mb-1" style={mono}>DECIMAL OUTPUT</p>
                            <div className="text-5xl font-bold transition-colors duration-100"
                                style={{ ...mono, color: isMatch ? '#10b981' : '#71717a' }}>
                                {sum}
                            </div>
                            <p className="text-xs mt-1.5 transition-all duration-100"
                                style={{ ...mono, color: isMatch ? '#10b981' : 'transparent', minHeight: 16 }}>
                                {isMatch ? '✓ MATCH — COMMITTING' : '⠀'}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center w-full max-w-sm mx-auto mt-auto pt-4">
                        <span className="text-[10px] text-zinc-800" style={mono}>BINARY CLOCK v2</span>
                        <button onClick={() => router.post('/logout')} className="text-[10px] text-zinc-800 hover:text-zinc-600 transition-colors" style={mono}>
                            EXIT
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
