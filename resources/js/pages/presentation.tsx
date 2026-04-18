import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface Props { loginUrl: string; }

/* ── Slide definitions ─────────────────────────────── */
interface Slide {
    id: number;
    en: { title: string; subtitle?: string; body: React.ReactNode };
    ar: { title: string; subtitle?: string; body: React.ReactNode };
}

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
`;

const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
const arabic: React.CSSProperties = { fontFamily: "'IBM Plex Sans Arabic', sans-serif", direction: 'rtl' };
const inter: React.CSSProperties  = { fontFamily: "'Inter', sans-serif" };

/* ── Reusable slide atoms ── */
function BitRow({ value, bits }: { value: number; bits: string }) {
    return (
        <div className="flex items-center gap-4">
            <span className="w-8 text-right text-emerald-400 text-xl font-bold" style={mono}>{value}</span>
            <span className="text-zinc-600 text-sm" style={inter}>→</span>
            <div className="flex gap-1.5">
                {bits.split('').map((b, i) => (
                    <div key={i} className="w-8 h-8 rounded flex items-center justify-center text-sm font-bold"
                        style={{ ...mono, background: b === '1' ? 'rgba(16,185,129,0.15)' : 'rgba(39,39,42,0.8)', color: b === '1' ? '#10b981' : '#52525b', border: `1px solid ${b === '1' ? 'rgba(16,185,129,0.3)' : 'rgba(63,63,70,0.5)'}` }}>
                        {b}
                    </div>
                ))}
            </div>
        </div>
    );
}

function PowerGrid() {
    const powers = [
        { exp: 7, val: 128 }, { exp: 6, val: 64 },
        { exp: 5, val: 32  }, { exp: 4, val: 16 },
        { exp: 3, val: 8   }, { exp: 2, val: 4  },
        { exp: 1, val: 2   }, { exp: 0, val: 1  },
    ];
    return (
        <div className="grid grid-cols-4 gap-3 w-full max-w-lg">
            {powers.map(({ exp, val }) => (
                <div key={val} className="rounded-xl p-3 text-center"
                    style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)' }}>
                    <p className="text-emerald-500 text-xs mb-1" style={mono}>2<sup>{exp}</sup></p>
                    <p className="text-white text-2xl font-bold" style={mono}>{val}</p>
                </div>
            ))}
        </div>
    );
}

function Switch({ on }: { on: boolean }) {
    return (
        <div className="relative w-20 h-36 rounded-2xl border-2 flex flex-col items-center justify-between py-2"
            style={{ background: on ? 'rgba(5,46,22,0.6)' : 'rgba(24,24,27,0.8)', borderColor: on ? '#10b981' : '#3f3f46', boxShadow: on ? '0 0 20px rgba(16,185,129,0.2)' : 'none' }}>
            <span className="text-[10px] tracking-widest" style={{ ...mono, color: on ? '#10b981' : '#52525b' }}>ON</span>
            <div className={`w-14 h-14 rounded-xl ${on ? 'self-start' : 'self-end'}`}
                style={{ background: on ? '#10b981' : '#3f3f46', boxShadow: on ? '0 0 14px rgba(16,185,129,0.5)' : 'none', marginLeft: 4, marginRight: 4 }} />
            <span className="text-[10px] tracking-widest" style={{ ...mono, color: on ? '#52525b' : '#52525b' }}>OFF</span>
        </div>
    );
}

/* ── Slide content factory ── */
function makeSlides(loginUrl: string): Slide[] {
    return [
        {
            id: 1,
            en: {
                title: 'The World is Binary',
                subtitle: 'Everything a computer does — every image, sound, and word — comes down to one question:',
                body: (
                    <div className="flex items-center gap-8 mt-4">
                        <Switch on={false} />
                        <div className="text-center">
                            <p className="text-zinc-600 text-sm mb-2" style={inter}>or</p>
                            <p className="text-6xl font-bold text-zinc-700" style={mono}>0 / 1</p>
                        </div>
                        <Switch on />
                    </div>
                ),
            },
            ar: {
                title: 'العالم ثنائي',
                subtitle: 'كل شيء يفعله الحاسوب — كل صورة وصوت وكلمة — يعتمد على سؤال واحد:',
                body: (
                    <div className="flex items-center gap-4 mt-4">
                        <p className="text-4xl font-bold text-zinc-700" style={{ ...mono, direction: 'ltr' }}>0 / 1</p>
                        <p className="text-zinc-500 text-lg" style={arabic}>مفتوح أم مغلق؟</p>
                    </div>
                ),
            },
        },
        {
            id: 2,
            en: {
                title: 'The Bit & the Switch',
                subtitle: 'A single binary digit is called a BIT. Think of it as a light switch.',
                body: (
                    <div className="flex gap-12 mt-6 items-end">
                        <div className="text-center space-y-2">
                            <Switch on={false} />
                            <p className="text-zinc-500 text-sm" style={mono}>BIT = 0</p>
                            <p className="text-zinc-600 text-xs" style={inter}>Current = OFF</p>
                        </div>
                        <div className="text-center space-y-2">
                            <Switch on />
                            <p className="text-emerald-400 text-sm" style={mono}>BIT = 1</p>
                            <p className="text-zinc-500 text-xs" style={inter}>Current = ON</p>
                        </div>
                    </div>
                ),
            },
            ar: {
                title: 'البت والمفتاح',
                subtitle: 'الرقم الثنائي الواحد يُسمى "بت". فكّر فيه كمفتاح إضاءة.',
                body: (
                    <div className="flex gap-8 mt-4 items-end">
                        <div className="text-center space-y-2">
                            <Switch on={false} />
                            <p className="text-zinc-500 text-sm" style={mono}>بت = 0</p>
                        </div>
                        <div className="text-center space-y-2">
                            <Switch on />
                            <p className="text-emerald-400 text-sm" style={mono}>بت = 1</p>
                        </div>
                    </div>
                ),
            },
        },
        {
            id: 3,
            en: {
                title: 'The Power of 2',
                subtitle: 'We use 8 switches (bits). Each switch represents a power of two — doubling each time.',
                body: <PowerGrid />,
            },
            ar: {
                title: 'قوة الرقم ٢',
                subtitle: 'نستخدم ٨ مفاتيح (بت). كل مفتاح يمثّل قوة من قوى الرقم ٢ — يتضاعف في كل مرة.',
                body: <PowerGrid />,
            },
        },
        {
            id: 4,
            en: {
                title: 'The Binary Map',
                subtitle: 'To write 10 in binary, find which powers add up: 8 + 2 = 10.',
                body: (
                    <div className="space-y-3 mt-2 w-full max-w-md">
                        <BitRow value={10} bits="00001010" />
                        <div className="flex gap-2 flex-wrap mt-3">
                            <span className="px-3 py-1 rounded-lg text-sm" style={{ ...mono, background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>8</span>
                            <span className="text-zinc-600 text-sm self-center" style={inter}>+</span>
                            <span className="px-3 py-1 rounded-lg text-sm" style={{ ...mono, background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>2</span>
                            <span className="text-zinc-600 text-sm self-center" style={inter}>=</span>
                            <span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ ...mono, background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.4)' }}>10</span>
                        </div>
                        <div className="mt-4 space-y-2 opacity-60">
                            <BitRow value={42} bits="00101010" />
                            <BitRow value={255} bits="11111111" />
                        </div>
                    </div>
                ),
            },
            ar: {
                title: 'الخريطة الثنائية',
                subtitle: 'لكتابة الرقم 10 بنظام ثنائي، ابحث عن القوى التي مجموعها 10: 8 + 2 = 10.',
                body: (
                    <div className="space-y-3 mt-2 w-full max-w-md">
                        <BitRow value={10} bits="00001010" />
                        <div className="flex gap-2 flex-wrap mt-3" style={{ direction: 'ltr' }}>
                            <span className="px-3 py-1 rounded-lg text-sm" style={{ ...mono, background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>8</span>
                            <span className="text-zinc-600 text-sm self-center">+</span>
                            <span className="px-3 py-1 rounded-lg text-sm" style={{ ...mono, background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>2</span>
                            <span className="text-zinc-600 text-sm self-center">=</span>
                            <span className="px-3 py-1 rounded-lg text-sm font-bold" style={{ ...mono, background: 'rgba(16,185,129,0.2)', color: '#10b981', border: '1px solid rgba(16,185,129,0.4)' }}>10</span>
                        </div>
                    </div>
                ),
            },
        },
        {
            id: 5,
            en: {
                title: 'The Clock Cycle',
                subtitle: 'Every 20 seconds, a new number (0–255) will appear. Your mission:',
                body: (
                    <div className="mt-4 space-y-4 w-full max-w-md">
                        {[
                            { step: '01', text: 'Read the target number on screen.' },
                            { step: '02', text: 'Flip your 8 DIP switches to match it in binary.' },
                            { step: '03', text: 'It auto-commits when your sum equals the target.' },
                            { step: '04', text: 'Faster commits = more points. Max 20 pts per pulse.' },
                        ].map(({ step, text }) => (
                            <div key={step} className="flex items-start gap-4">
                                <span className="text-xs text-emerald-500 mt-0.5 shrink-0 w-6" style={mono}>{step}</span>
                                <p className="text-zinc-300 text-sm leading-relaxed" style={inter}>{text}</p>
                            </div>
                        ))}
                    </div>
                ),
            },
            ar: {
                title: 'دورة الساعة',
                subtitle: 'كل ٢٠ ثانية، يظهر رقم جديد (٠–٢٥٥). مهمتك:',
                body: (
                    <div className="mt-4 space-y-3 w-full max-w-md" style={arabic}>
                        {[
                            { step: '٠١', text: 'اقرأ الرقم المستهدف على الشاشة.' },
                            { step: '٠٢', text: 'اضبط مفاتيح DIP الثمانية لتمثيله بنظام ثنائي.' },
                            { step: '٠٣', text: 'يُرسَل الجواب تلقائياً حين يساوي مجموعك الرقم المستهدف.' },
                            { step: '٠٤', text: 'الإجابة الأسرع = نقاط أكثر. الحد الأقصى ٢٠ نقطة لكل نبضة.' },
                        ].map(({ step, text }) => (
                            <div key={step} className="flex items-start gap-4" style={{ flexDirection: 'row-reverse' }}>
                                <span className="text-xs text-emerald-500 mt-0.5 shrink-0" style={mono}>{step}</span>
                                <p className="text-zinc-300 text-sm leading-relaxed">{text}</p>
                            </div>
                        ))}
                    </div>
                ),
            },
        },
        {
            id: 6,
            en: {
                title: 'Scan to Initialize',
                subtitle: 'Open this link on your device and enter your Terminal ID to join the session.',
                body: null,
            },
            ar: {
                title: 'امسح الرمز للبدء',
                subtitle: 'افتح هذا الرابط على جهازك وأدخل رقم طرفيتك للانضمام إلى الجلسة.',
                body: null,
            },
        },
    ];
}

/* ── Slide variants ─────────────────────────────────── */
const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

/* ── Main component ─────────────────────────────────── */
export default function Presentation({ loginUrl }: Props) {
    const slides = makeSlides(loginUrl);
    const [index, setIndex] = useState(0);
    const [dir, setDir]     = useState(1);

    const go = (next: number) => {
        if (next < 0 || next >= slides.length) return;
        setDir(next > index ? 1 : -1);
        setIndex(next);
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') go(index + 1);
            if (e.key === 'ArrowLeft')  go(index - 1);
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [index]);

    const slide  = slides[index];
    const isQR   = index === slides.length - 1;
    const progress = ((index + 1) / slides.length) * 100;

    return (
        <>
            <Head title="Technical Briefing" />
            <style>{FONTS}</style>

            <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col select-none"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
                    `,
                    backgroundSize: '48px 48px',
                }}>

                {/* Slide area */}
                <div className="flex-1 flex items-center justify-center px-8 py-12 overflow-hidden relative">
                    <AnimatePresence mode="wait" custom={dir}>
                        <motion.div
                            key={index}
                            custom={dir}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.35, ease: [0.32, 0, 0.67, 0] }}
                            className="w-full max-w-4xl"
                        >
                            {isQR ? (
                                /* QR slide — full centre */
                                <div className="flex flex-col items-center gap-8">
                                    <SlideHeader slide={slide} />
                                    <div className="p-6 rounded-2xl" style={{ background: '#fff' }}>
                                        <QRCodeSVG value={loginUrl} size={220} bgColor="#ffffff" fgColor="#0a0a0a" level="M" />
                                    </div>
                                    <p className="text-xs text-zinc-600 max-w-xs text-center" style={mono}>{loginUrl}</p>
                                </div>
                            ) : (
                                /* Normal slide — two columns EN | AR */
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
                                    {/* English */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="w-1 h-6 rounded-full bg-emerald-500" />
                                            <span className="text-xs text-emerald-500 tracking-widest uppercase" style={mono}>EN</span>
                                        </div>
                                        <h2 className="text-3xl font-bold text-white leading-tight" style={inter}>{slide.en.title}</h2>
                                        {slide.en.subtitle && (
                                            <p className="text-zinc-500 text-sm leading-relaxed" style={inter}>{slide.en.subtitle}</p>
                                        )}
                                        <div>{slide.en.body}</div>
                                    </div>

                                    {/* Divider */}
                                    <div className="hidden md:block absolute left-1/2 top-8 bottom-8 w-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

                                    {/* Arabic */}
                                    <div className="space-y-4" style={{ direction: 'rtl' }}>
                                        <div className="flex items-center gap-2 mb-4" style={{ flexDirection: 'row-reverse' }}>
                                            <div className="w-1 h-6 rounded-full bg-emerald-500" />
                                            <span className="text-xs text-emerald-500 tracking-widest uppercase" style={mono}>AR</span>
                                        </div>
                                        <h2 className="text-3xl font-bold text-white leading-tight" style={arabic}>{slide.ar.title}</h2>
                                        {slide.ar.subtitle && (
                                            <p className="text-zinc-500 text-sm leading-relaxed" style={arabic}>{slide.ar.subtitle}</p>
                                        )}
                                        <div>{slide.ar.body}</div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer nav */}
                <div className="shrink-0 px-8 pb-6">
                    {/* Progress bar */}
                    <div className="h-px bg-zinc-900 rounded-full overflow-hidden mb-4">
                        <motion.div
                            className="h-full bg-emerald-500 rounded-full"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            style={{ boxShadow: '0 0 8px rgba(16,185,129,0.5)' }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        {/* Left: slide counter */}
                        <span className="text-xs text-zinc-600" style={mono}>
                            {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
                        </span>

                        {/* Centre: nav buttons */}
                        <div className="flex items-center gap-2">
                            <NavBtn onClick={() => go(index - 1)} disabled={index === 0} label="←" />
                            <div className="flex gap-1.5">
                                {slides.map((_, i) => (
                                    <button key={i} onClick={() => go(i)}
                                        className="w-1.5 h-1.5 rounded-full transition-all"
                                        style={{ background: i === index ? '#10b981' : 'rgba(255,255,255,0.15)', boxShadow: i === index ? '0 0 4px #10b981' : 'none' }} />
                                ))}
                            </div>
                            <NavBtn onClick={() => go(index + 1)} disabled={index === slides.length - 1} label="→" />
                        </div>

                        {/* Right: keyboard hint */}
                        <span className="text-xs text-zinc-700" style={mono}>← → to navigate</span>
                    </div>
                </div>
            </div>
        </>
    );
}

function SlideHeader({ slide }: { slide: Slide }) {
    return (
        <div className="text-center space-y-2">
            <h2 className="text-4xl font-bold" style={{ fontFamily: "'Inter', sans-serif" }}>{slide.en.title}</h2>
            <h3 className="text-2xl text-zinc-400" style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif" }}>{slide.ar.title}</h3>
            {slide.en.subtitle && <p className="text-zinc-500 text-sm max-w-md mx-auto mt-2" style={{ fontFamily: "'Inter', sans-serif" }}>{slide.en.subtitle}</p>}
        </div>
    );
}

function NavBtn({ onClick, disabled, label }: { onClick: () => void; disabled: boolean; label: string }) {
    return (
        <button onClick={onClick} disabled={disabled}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all disabled:opacity-20"
            style={{ fontFamily: "'JetBrains Mono', monospace", border: '1px solid rgba(255,255,255,0.08)', color: '#71717a' }}
            onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#71717a'; }}>
            {label}
        </button>
    );
}
