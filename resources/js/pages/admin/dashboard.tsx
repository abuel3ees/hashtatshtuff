import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { getEcho } from '@/hooks/use-echo';

interface LeaderboardEntry { id: number; name: string; display_name: string | null; points: number; }
interface ClockPulse      { id: number; number: number; ends_at: string; }
interface LobbyUser       { id: number; callsign: string; terminal: string; is_admin: boolean; }
interface DeltaInfo       { pts: number; stamp: number; }

interface Props {
    leaderboard:   LeaderboardEntry[];
    gameState:     'waiting' | 'active';
    currentPulse:  ClockPulse | null;
    userCount:     number;
    clockInterval: number;
}

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');`;
const GRID: React.CSSProperties = {
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
};
const CARD: React.CSSProperties = { background: 'rgba(24,24,27,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16 };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

export default function AdminDashboard({ leaderboard: initial, gameState: initState, currentPulse, userCount, clockInterval: initInterval }: Props) {
    const [board, setBoard]           = useState<LeaderboardEntry[]>(initial);
    const [gameState, setGameState]   = useState<'waiting' | 'active'>(initState);
    const [pulse, setPulse]           = useState<ClockPulse | null>(currentPulse);
    const [timeLeft, setTimeLeft]     = useState(0);
    const [lobby, setLobby]           = useState<LobbyUser[]>([]);
    const [deltas, setDeltas]         = useState<Map<number, DeltaInfo>>(new Map());
    const [boardFlash, setBoardFlash] = useState(false);
    const [confirmRemove, setConfirmRemove] = useState(false);
    const [interval, setIntervalSec]       = useState(initInterval);
    const prevBoard = useRef<Map<number, number>>(new Map());
    const deltaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pulseDuration = useRef(currentPulse ? Math.round((new Date(currentPulse.ends_at).getTime() - Date.now()) / 1000) : initInterval);

    const flash = (usePage().props as Record<string, string>).success ?? null;
    const { data, setData, post, processing } = useForm({ count: 30 });

    /* Countdown */
    useEffect(() => {
        if (!pulse) { setTimeLeft(0); return; }
        const id = setInterval(() => {
            setTimeLeft(Math.max(0, Math.ceil((new Date(pulse.ends_at).getTime() - Date.now()) / 1000)));
        }, 300);
        return () => clearInterval(id);
    }, [pulse]);

    /* Animated leaderboard update */
    const applyBoardUpdate = (newBoard: LeaderboardEntry[]) => {
        const newDeltas = new Map<number, DeltaInfo>();
        newBoard.forEach(entry => {
            const prev = prevBoard.current.get(entry.id) ?? 0;
            if (entry.points > prev) newDeltas.set(entry.id, { pts: entry.points - prev, stamp: Date.now() });
        });
        prevBoard.current = new Map(newBoard.map(e => [e.id, e.points]));
        setBoard(newBoard);
        if (newDeltas.size > 0) {
            setBoardFlash(true);
            setDeltas(newDeltas);
            if (deltaTimer.current) clearTimeout(deltaTimer.current);
            deltaTimer.current = setTimeout(() => { setDeltas(new Map()); setBoardFlash(false); }, 2200);
        }
    };

    /* Echo */
    useEffect(() => {
        prevBoard.current = new Map(initial.map(e => [e.id, e.points]));
        const echo = getEcho();
        echo.channel('clock').listen('.pulse', (e: { number: number; pulseId: number; endsAt: string }) => {
            pulseDuration.current = Math.round((new Date(e.endsAt).getTime() - Date.now()) / 1000);
            setPulse({ id: e.pulseId, number: e.number, ends_at: e.endsAt });
        });
        echo.channel('leaderboard').listen('.updated', (e: { leaderboard: LeaderboardEntry[] }) => applyBoardUpdate(e.leaderboard));
        echo.channel('game').listen('.state', (e: { state: 'waiting' | 'active' }) => setGameState(e.state));
        echo.join('game.lobby')
            .here((users: LobbyUser[]) => setLobby(users.filter(u => !u.is_admin)))
            .joining((u: LobbyUser) => { if (!u.is_admin) setLobby(p => [...p.filter(x => x.id !== u.id), u]); })
            .leaving((u: LobbyUser) => setLobby(p => p.filter(x => x.id !== u.id)));
        return () => { echo.leave('clock'); echo.leave('leaderboard'); echo.leave('game'); echo.leave('game.lobby'); };
    }, []);

    const progressPct = pulse ? (timeLeft / (pulseDuration.current || initInterval)) * 100 : 0;
    const bits = pulse ? Array.from({ length: 8 }, (_, i) => Boolean((pulse.number >> (7 - i)) & 1)) : Array(8).fill(false);

    return (
        <>
            <Head title="Command Center" />
            <style>{FONTS}{`
                @keyframes scoreFlash {
                    0%   { background: rgba(16,185,129,0.25); box-shadow: 0 0 20px rgba(16,185,129,0.3); }
                    100% { background: transparent; box-shadow: none; }
                }
                @keyframes deltaFade {
                    0%   { opacity: 1; transform: translateY(0); }
                    70%  { opacity: 1; transform: translateY(-8px); }
                    100% { opacity: 0; transform: translateY(-16px); }
                }
                @keyframes boardPulse {
                    0%, 100% { border-color: rgba(255,255,255,0.07); }
                    50%      { border-color: rgba(16,185,129,0.35); }
                }
                .score-flash { animation: scoreFlash 1.8s ease-out forwards; }
                .delta-badge { animation: deltaFade 2s ease-out forwards; }
                .board-pulse { animation: boardPulse 0.6s ease-in-out; }
            `}</style>

            <div className="min-h-screen bg-zinc-950 text-white" style={GRID}>
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">

                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-7">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" style={{ boxShadow: '0 0 8px #10b981' }} />
                            <span className="text-white font-bold" style={mono}>COMMAND CENTER</span>
                            <span className="text-zinc-600 text-xs" style={mono}>· {userCount} terminals</span>
                        </div>
                        <button onClick={() => router.post('/logout')} className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors" style={mono}>
                            DISCONNECT
                        </button>
                    </div>

                    {flash && (
                        <div className="mb-5 px-4 py-2.5 rounded-xl text-sm text-emerald-400 border border-emerald-900/60 bg-emerald-950/40" style={mono}>
                            ✓ {flash}
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                        {/* ── LEFT (3 cols) ── */}
                        <div className="lg:col-span-3 space-y-5">

                            {/* Game control card */}
                            <div className="p-6 space-y-4" style={CARD}>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-zinc-500 tracking-widest uppercase" style={mono}>Game Session</span>
                                    <span className="text-xs px-2.5 py-1 rounded-full" style={{
                                        ...mono,
                                        background: gameState === 'active' ? 'rgba(16,185,129,0.12)' : 'rgba(113,113,122,0.12)',
                                        color:      gameState === 'active' ? '#10b981' : '#52525b',
                                        border:     `1px solid ${gameState === 'active' ? 'rgba(16,185,129,0.3)' : 'rgba(82,82,91,0.3)'}`,
                                    }}>
                                        {gameState === 'active' ? '● LIVE' : '○ STANDBY'}
                                    </span>
                                </div>

                                {/* Clock display */}
                                {gameState === 'active' && pulse ? (
                                    <div>
                                        <div className="flex items-baseline gap-4 mb-3">
                                            <span className="text-7xl font-bold leading-none" style={mono}>{pulse.number}</span>
                                            <div className="space-y-1.5 pb-1">
                                                <div className="flex gap-1">
                                                    {bits.map((on, i) => (
                                                        <div key={i} className="w-3.5 h-3.5 rounded-sm transition-all duration-150"
                                                            style={{ background: on ? '#10b981' : '#27272a', boxShadow: on ? '0 0 6px rgba(16,185,129,0.6)' : 'none' }} />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-zinc-600" style={mono}>{pulse.number.toString(2).padStart(8, '0')}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full transition-all duration-300"
                                                    style={{ width: `${progressPct}%`, background: timeLeft <= 5 ? '#ef4444' : '#10b981', boxShadow: `0 0 8px ${timeLeft <= 5 ? 'rgba(239,68,68,0.5)' : 'rgba(16,185,129,0.5)'}` }} />
                                            </div>
                                            <span className="text-xs w-7 text-right text-zinc-400" style={mono}>{timeLeft}s</span>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-zinc-700 text-sm" style={mono}>— Waiting for game to start —</p>
                                )}

                                {/* Action buttons */}
                                <div className="flex gap-3 pt-1">
                                    {gameState === 'waiting' ? (
                                        <button onClick={() => router.post('/admin/game/start')}
                                            className="flex-1 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all"
                                            style={{ ...mono, background: 'rgba(16,185,129,0.15)', border: '1.5px solid #10b981', color: '#10b981', boxShadow: '0 0 24px rgba(16,185,129,0.15)' }}>
                                            ▶  START GAME
                                        </button>
                                    ) : (
                                        <>
                                            <button onClick={() => router.post('/admin/game/stop')}
                                                className="flex-1 py-3 rounded-xl text-sm tracking-widest uppercase transition-colors"
                                                style={{ ...mono, border: '1px solid rgba(239,68,68,0.35)', color: '#71717a' }}
                                                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                                                onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
                                                ■ STOP
                                            </button>
                                            <button onClick={() => router.post('/admin/game/reset')}
                                                className="flex-1 py-3 rounded-xl text-sm tracking-widest uppercase transition-colors"
                                                style={{ ...mono, border: '1px solid rgba(251,191,36,0.3)', color: '#71717a' }}
                                                onMouseEnter={e => (e.currentTarget.style.color = '#fbbf24')}
                                                onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
                                                ↺ RESET GAME
                                            </button>
                                        </>
                                    )}
                                </div>

                                {/* Pulse speed */}
                                <div>
                                    <p className="text-[10px] text-zinc-600 tracking-widest uppercase mb-2" style={mono}>Pulse Interval</p>
                                    <div className="flex gap-2">
                                        {[5, 10, 15, 20].map(s => (
                                            <button key={s}
                                                onClick={() => { setIntervalSec(s); router.post('/admin/clock/interval', { seconds: s }); }}
                                                className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
                                                style={{ ...mono, background: interval === s ? 'rgba(16,185,129,0.15)' : 'transparent', border: `1px solid ${interval === s ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.07)'}`, color: interval === s ? '#10b981' : '#52525b' }}>
                                                {s}s
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Lobby card */}
                            <div className="p-6" style={CARD}>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-xs text-zinc-500 tracking-widest uppercase" style={mono}>Lobby</span>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs text-zinc-400" style={mono}>{lobby.length} online</span>
                                    </div>
                                </div>
                                {lobby.length === 0 ? (
                                    <p className="text-zinc-700 text-xs py-1" style={mono}>No terminals connected yet.</p>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-44 overflow-y-auto">
                                        {lobby.map(u => (
                                            <div key={u.id} className="flex items-center gap-2 px-3 py-2 rounded-lg"
                                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" style={{ boxShadow: '0 0 4px #10b981' }} />
                                                <div className="min-w-0">
                                                    <p className="text-white text-xs font-medium truncate" style={mono}>{u.callsign}</p>
                                                    <p className="text-zinc-600 text-[10px]" style={mono}>T-{u.terminal}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Bottom row: bulk create + danger zone */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Bulk create */}
                                <div className="p-5" style={CARD}>
                                    <p className="text-xs text-zinc-500 tracking-widest uppercase mb-3" style={mono}>Generate Terminals</p>
                                    <form onSubmit={(e) => { e.preventDefault(); post('/admin/users/bulk'); }} className="flex gap-2">
                                        <input type="number" min={1} max={500}
                                            value={data.count}
                                            onChange={(e) => setData('count', parseInt(e.target.value))}
                                            className="flex-1 w-0 bg-zinc-950 rounded-lg px-3 py-2 text-white text-sm focus:outline-none"
                                            style={{ ...mono, border: '1px solid rgba(255,255,255,0.07)' }} />
                                        <button type="submit" disabled={processing}
                                            className="px-3 py-2 rounded-lg text-xs text-zinc-300 transition-colors disabled:opacity-40"
                                            style={{ ...mono, border: '1px solid rgba(255,255,255,0.1)' }}>
                                            ADD
                                        </button>
                                    </form>
                                    <p className="text-zinc-700 text-[10px] mt-2" style={mono}>ID = Password = number</p>
                                </div>

                                {/* Danger zone */}
                                <div className="p-5 space-y-2" style={CARD}>
                                    <p className="text-xs text-zinc-500 tracking-widest uppercase mb-3" style={mono}>Danger Zone</p>
                                    <button onClick={() => router.post('/admin/scores/reset')}
                                        className="w-full py-2 rounded-lg text-xs transition-colors"
                                        style={{ ...mono, border: '1px solid rgba(113,113,122,0.2)', color: '#52525b' }}
                                        onMouseEnter={e => (e.currentTarget.style.color = '#a1a1aa')}
                                        onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}>
                                        RESET SCORES ONLY
                                    </button>

                                    {!confirmRemove ? (
                                        <button onClick={() => setConfirmRemove(true)}
                                            className="w-full py-2 rounded-lg text-xs transition-colors"
                                            style={{ ...mono, border: '1px solid rgba(239,68,68,0.2)', color: '#52525b' }}
                                            onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                                            onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}>
                                            REMOVE ALL USERS
                                        </button>
                                    ) : (
                                        <div className="rounded-lg p-2 space-y-1.5" style={{ border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.06)' }}>
                                            <p className="text-red-400 text-[10px] text-center" style={mono}>This deletes all terminals.</p>
                                            <div className="flex gap-2">
                                                <button onClick={() => { router.delete('/admin/users'); setConfirmRemove(false); }}
                                                    className="flex-1 py-1.5 rounded-md text-xs font-bold"
                                                    style={{ ...mono, background: 'rgba(239,68,68,0.2)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.4)' }}>
                                                    CONFIRM
                                                </button>
                                                <button onClick={() => setConfirmRemove(false)}
                                                    className="flex-1 py-1.5 rounded-md text-xs"
                                                    style={{ ...mono, border: '1px solid rgba(255,255,255,0.1)', color: '#71717a' }}>
                                                    CANCEL
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* ── RIGHT (2 cols) — Live Leaderboard ── */}
                        <div className="lg:col-span-2 p-6" style={{ ...CARD, ...(boardFlash ? { animation: 'boardPulse 0.6s ease-in-out' } : {}) }}>
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-xs text-zinc-500 tracking-widest uppercase" style={mono}>Live Leaderboard</span>
                                </div>
                                {boardFlash && (
                                    <span className="text-[10px] text-emerald-500" style={mono}>UPDATED</span>
                                )}
                            </div>

                            {board.length === 0 ? (
                                <p className="text-zinc-700 text-xs" style={mono}>No scores yet.</p>
                            ) : (
                                <ol className="space-y-1.5">
                                    {board.map((entry, idx) => {
                                        const delta = deltas.get(entry.id);
                                        return (
                                            <li key={entry.id} className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${delta ? 'score-flash' : ''}`}
                                                style={{ background: idx === 0 ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.025)', border: `1px solid ${idx === 0 ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)'}` }}>

                                                {/* Rank number */}
                                                <span className="text-xs w-4 text-center shrink-0"
                                                    style={{ ...mono, color: idx === 0 ? '#fbbf24' : idx === 1 ? '#9ca3af' : idx === 2 ? '#b45309' : '#3f3f46' }}>
                                                    {idx + 1}
                                                </span>

                                                {/* Name */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white text-sm font-medium truncate" style={mono}>
                                                        {entry.display_name || `T-${entry.name}`}
                                                    </p>
                                                    <p className="text-zinc-600 text-[10px]" style={mono}>Terminal {entry.name}</p>
                                                </div>

                                                {/* Score */}
                                                <span className="text-emerald-400 font-bold text-sm shrink-0" style={mono}>{entry.points}</span>

                                                {/* +N pts delta badge */}
                                                {delta && (
                                                    <span key={delta.stamp} className="delta-badge absolute right-3 -top-5 text-xs font-bold text-emerald-400 pointer-events-none" style={mono}>
                                                        +{delta.pts}
                                                    </span>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ol>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
