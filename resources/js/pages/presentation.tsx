import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface Props { loginUrl: string; }

/* ─────────────────────── fonts & shared styles ─────────────────────── */
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
`;
const BG: React.CSSProperties = {
    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)`,
    backgroundSize: '52px 52px',
};
const en   = (extra?: React.CSSProperties): React.CSSProperties => ({ fontFamily:"'Inter',sans-serif", ...extra });
const ar   = (extra?: React.CSSProperties): React.CSSProperties => ({ fontFamily:"'IBM Plex Sans Arabic',sans-serif", direction:'rtl', ...extra });
const mono = (extra?: React.CSSProperties): React.CSSProperties => ({ fontFamily:"'JetBrains Mono',monospace", ...extra });

const EMERALD   = '#10b981';
const DIM       = '#3f3f46';
const MUTED     = '#52525b';
const CARD_DARK = 'rgba(24,24,27,0.85)';
const CARD_BORDER = '1px solid rgba(255,255,255,0.07)';

/* ─────────────────────── reusable primitives ─────────────────────── */
function Chip({ children, color = EMERALD }: { children: React.ReactNode; color?: string }) {
    return (
        <span style={mono({ fontSize: 11, color, background: `${color}18`, border: `1px solid ${color}40`, padding: '2px 10px', borderRadius: 99 })}>
            {children}
        </span>
    );
}

function SlideBit({ val }: { val: 0 | 1 }) {
    const on = val === 1;
    return (
        <div style={{
            width: 52, height: 52, borderRadius: 10, display:'flex', alignItems:'center', justifyContent:'center',
            background: on ? `${EMERALD}18` : 'rgba(39,39,42,0.7)',
            border: `2px solid ${on ? EMERALD : DIM}`,
            boxShadow: on ? `0 0 14px ${EMERALD}55` : 'none',
        }}>
            <span style={mono({ fontSize: 22, fontWeight: 700, color: on ? EMERALD : MUTED })}>{val}</span>
        </div>
    );
}

function DipSwitch({ on, label }: { on: boolean; label?: number }) {
    return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 6 }}>
            <div style={{
                width: 34, height: 68, borderRadius: 8, position:'relative',
                background: on ? 'rgba(5,46,22,0.7)' : 'rgba(24,24,27,0.9)',
                border: `2px solid ${on ? EMERALD : DIM}`,
                boxShadow: on ? `0 0 10px ${EMERALD}44` : 'none',
                transition: 'all 0.2s',
            }}>
                <div style={{ position:'absolute', left:4, right:4, height:24,
                    top: on ? 3 : undefined, bottom: on ? undefined : 3,
                    background: on ? EMERALD : '#52525b', borderRadius: 5,
                    boxShadow: on ? `0 0 8px ${EMERALD}88` : 'none',
                    transition: 'all 0.2s',
                }} />
            </div>
            {label !== undefined && (
                <span style={mono({ fontSize: 9, color: on ? EMERALD : MUTED })}>{label}</span>
            )}
        </div>
    );
}

function SlideFrame({ tag, en: enTitle, ar: arTitle, children }: {
    tag?: string; en: string; ar: string; children?: React.ReactNode;
}) {
    return (
        <div style={{ width:'100%', maxWidth: 1100, display:'flex', flexDirection:'column', gap: 28 }}>
            {/* titles */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'start', gap: 16 }}>
                <div>
                    {tag && <Chip>{tag}</Chip>}
                    <h2 style={en({ fontSize: 38, fontWeight: 800, color:'#f4f4f5', lineHeight:1.15, marginTop: tag ? 8 : 0 })}>
                        {enTitle}
                    </h2>
                </div>
                <div style={{ width: 1, background:'rgba(255,255,255,0.07)', alignSelf:'stretch' }} />
                <div style={{ textAlign:'right' }}>
                    {tag && <Chip>{tag}</Chip>}
                    <h2 style={ar({ fontSize: 34, fontWeight: 700, color:'#f4f4f5', lineHeight:1.25, marginTop: tag ? 8 : 0 })}>
                        {arTitle}
                    </h2>
                </div>
            </div>
            {/* body */}
            {children && <div style={{ display:'flex', justifyContent:'center' }}>{children}</div>}
        </div>
    );
}

function TwoCol({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
    return (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 40, width:'100%', maxWidth: 960 }}>
            <div style={{ display:'flex', flexDirection:'column', gap: 12 }}>{left}</div>
            <div style={{ display:'flex', flexDirection:'column', gap: 12, direction:'rtl' }}>{right}</div>
        </div>
    );
}

function Body({ children, dir = 'ltr' }: { children: React.ReactNode; dir?: 'ltr'|'rtl' }) {
    return <p style={(dir==='ltr'?en:ar)({ fontSize:17, color:'#a1a1aa', lineHeight:1.7 })}>{children}</p>;
}

/* ─────────────────────── SLIDES ─────────────────────── */

/** 1 · Welcome */
function S01() {
    const bits = [1,0,1,1,0,0,1,0,1,0,0,1,1,0,1,0];
    return (
        <SlideFrame en="Welcome to the Digital World" ar="أهلاً بك في العالم الرقمي">
            <div style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', alignItems:'center', gap: 32 }}>
                <TwoCol
                    left={<Body>Today you'll discover the hidden language that runs every phone, computer, and screen on the planet — a language built from just two symbols.</Body>}
                    right={<Body dir="rtl">اليوم ستكتشف اللغة الخفية التي تشغّل كل هاتف وحاسوب وشاشة في العالم — لغة مبنية من رمزين فقط.</Body>}
                />
                {/* floating bits */}
                <div style={{ display:'flex', gap: 10, flexWrap:'wrap', justifyContent:'center', maxWidth: 600, opacity: 0.5 }}>
                    {bits.map((b, i) => <SlideBit key={i} val={b as 0|1} />)}
                </div>
                <div style={{ display:'flex', gap: 32, alignItems:'center' }}>
                    <div style={{ textAlign:'center' }}>
                        <SlideBit val={0} />
                        <p style={mono({ fontSize:11, color: MUTED, marginTop:6 })}>OFF / Zero</p>
                    </div>
                    <span style={{ fontSize: 32, color: MUTED }}>+</span>
                    <div style={{ textAlign:'center' }}>
                        <SlideBit val={1} />
                        <p style={mono({ fontSize:11, color: EMERALD, marginTop:6 })}>ON / One</p>
                    </div>
                    <span style={{ fontSize: 32, color: MUTED }}>=</span>
                    <span style={en({ fontSize:22, fontWeight:700, color:'#f4f4f5' })}>Everything</span>
                </div>
            </div>
        </SlideFrame>
    );
}

/** 2 · Analog vs Digital */
function S02() {
    return (
        <SlideFrame tag="CONCEPT 01" en="Analog vs. Digital" ar="تناظري مقابل رقمي">
            <div style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', gap:32 }}>
                <TwoCol
                    left={<Body>The real world is <em style={{ color:'#f4f4f5' }}>smooth and continuous</em> — a thermometer rises gradually. Digital systems <em style={{ color: EMERALD }}>convert that smoothness into steps</em>, assigning each step a number.</Body>}
                    right={<Body dir="rtl">العالم الحقيقي <em style={{ color:'#f4f4f5' }}>ناعم ومستمر</em> — ترتفع الحرارة تدريجياً. الأنظمة الرقمية <em style={{ color: EMERALD }}>تُحوّل هذا الانسياب إلى خطوات</em>، تُعطي كل خطوة رقماً.</Body>}
                />
                <div style={{ display:'flex', gap: 40, justifyContent:'center', alignItems:'flex-end' }}>
                    {/* Analog */}
                    <div style={{ textAlign:'center' }}>
                        <svg width="200" height="90" viewBox="0 0 200 90">
                            <path d="M0,70 C30,70 40,10 70,10 S110,70 140,70 S170,10 200,10" stroke={EMERALD} fill="none" strokeWidth="2.5" strokeLinecap="round"/>
                            <text x="100" y="86" textAnchor="middle" fill={MUTED} fontSize="11" fontFamily="JetBrains Mono">ANALOG — smooth</text>
                        </svg>
                    </div>
                    <span style={{ fontSize:28, color: DIM, marginBottom: 30 }}>→</span>
                    {/* Digital */}
                    <div style={{ textAlign:'center' }}>
                        <svg width="200" height="90" viewBox="0 0 200 90">
                            <path d="M0,70 L40,70 L40,40 L80,40 L80,10 L120,10 L120,40 L160,40 L160,70 L200,70" stroke={EMERALD} fill="none" strokeWidth="2.5" strokeLinecap="square"/>
                            <text x="100" y="86" textAnchor="middle" fill={MUTED} fontSize="11" fontFamily="JetBrains Mono">DIGITAL — steps</text>
                        </svg>
                    </div>
                </div>
                <div style={{ textAlign:'center' }}>
                    <span style={mono({ fontSize:13, color: MUTED })}>Compact disc, MP3, JPEG — all digital. Each is a very long list of numbers.</span>
                </div>
            </div>
        </SlideFrame>
    );
}

/** 3 · Electricity */
function S03() {
    return (
        <SlideFrame tag="CONCEPT 02" en="Computers Speak Electricity" ar="الحواسيب تتكلم الكهرباء">
            <div style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', gap:32 }}>
                <TwoCol
                    left={<Body>Inside a computer, billions of tiny wires carry electricity. Each wire is either <em style={{ color: EMERALD }}>powered (ON)</em> or <em style={{ color: '#ef4444' }}>unpowered (OFF)</em>. That's the entire vocabulary.</Body>}
                    right={<Body dir="rtl">داخل الحاسوب، مليارات الأسلاك الدقيقة تحمل الكهرباء. كل سلك إما <em style={{ color: EMERALD }}>مكهرب (تشغيل)</em> أو <em style={{ color:'#ef4444' }}>غير مكهرب (إيقاف)</em>. هذه هي المفردات كاملة.</Body>}
                />
                <div style={{ display:'flex', gap:60, justifyContent:'center' }}>
                    {/* OFF wire */}
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 12 }}>
                        <svg width="120" height="50" viewBox="0 0 120 50">
                            <rect x="10" y="20" width="100" height="10" rx="5" fill={DIM}/>
                            <circle cx="10" cy="25" r="8" fill={DIM}/>
                            <circle cx="110" cy="25" r="8" fill={DIM}/>
                        </svg>
                        <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'6px 20px' }}>
                            <span style={mono({ fontSize:22, fontWeight:700, color:'#ef4444' })}>0</span>
                        </div>
                        <span style={en({ fontSize:13, color: MUTED })}>No current → OFF</span>
                    </div>
                    {/* ON wire */}
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: 12 }}>
                        <svg width="120" height="50" viewBox="0 0 120 50">
                            <rect x="10" y="20" width="100" height="10" rx="5" fill={EMERALD}/>
                            <circle cx="10" cy="25" r="8" fill={EMERALD}/>
                            <circle cx="110" cy="25" r="8" fill={EMERALD}/>
                            <line x1="30" y1="15" x2="40" y2="35" stroke="white" strokeWidth="1.5" opacity="0.4"/>
                            <line x1="55" y1="15" x2="65" y2="35" stroke="white" strokeWidth="1.5" opacity="0.4"/>
                            <line x1="80" y1="15" x2="90" y2="35" stroke="white" strokeWidth="1.5" opacity="0.4"/>
                        </svg>
                        <div style={{ background:`${EMERALD}18`, border:`1px solid ${EMERALD}55`, borderRadius:8, padding:'6px 20px', boxShadow:`0 0 16px ${EMERALD}33` }}>
                            <span style={mono({ fontSize:22, fontWeight:700, color: EMERALD })}>1</span>
                        </div>
                        <span style={en({ fontSize:13, color: MUTED })}>Has current → ON</span>
                    </div>
                </div>
            </div>
        </SlideFrame>
    );
}

/** 4 · Meet the BIT */
function S04() {
    return (
        <SlideFrame tag="CONCEPT 03" en="Meet the BIT" ar="تعرّف على البت">
            <div style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', gap:32 }}>
                <TwoCol
                    left={<Body>A <em style={{ color: EMERALD }}>BIT</em> (Binary digIT) is the smallest possible piece of information. It holds exactly one answer to one yes/no question. Everything else is built from these.</Body>}
                    right={<Body dir="rtl"><em style={{ color: EMERALD }}>البت</em> (Binary digIT) هو أصغر وحدة معلومات ممكنة. يحمل إجابة واحدة لسؤال نعم/لا. كل شيء آخر مبنيّ منها.</Body>}
                />
                <div style={{ display:'flex', gap:40, justifyContent:'center', alignItems:'stretch' }}>
                    {[
                        { val: 0 as const, examples: ['Light is OFF','Door is CLOSED','False','No'] },
                        { val: 1 as const, examples: ['Light is ON', 'Door is OPEN', 'True', 'Yes'] },
                    ].map(({ val, examples }) => (
                        <div key={val} style={{ background: CARD_DARK, border: CARD_BORDER, borderRadius:14, padding:'24px 32px', display:'flex', flexDirection:'column', alignItems:'center', gap:16, minWidth:200 }}>
                            <div style={{ width:72, height:72, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:14,
                                background: val ? `${EMERALD}18` : 'rgba(239,68,68,0.1)',
                                border: `2px solid ${val ? EMERALD : '#ef4444'}`,
                                boxShadow: val ? `0 0 20px ${EMERALD}44` : '0 0 20px rgba(239,68,68,0.2)' }}>
                                <span style={mono({ fontSize:36, fontWeight:700, color: val ? EMERALD : '#ef4444' })}>{val}</span>
                            </div>
                            <ul style={{ listStyle:'none', padding:0, margin:0, display:'flex', flexDirection:'column', gap:6 }}>
                                {examples.map(e => (
                                    <li key={e} style={en({ fontSize:13, color: MUTED, textAlign:'center' })}>{e}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </SlideFrame>
    );
}

/** 5 · How humans count */
function S05() {
    const decimal = [
        { place: '1000s', mult: 'Thousands', val: 1000 },
        { place: '100s',  mult: 'Hundreds',  val: 100  },
        { place: '10s',   mult: 'Tens',      val: 10   },
        { place: '1s',    mult: 'Ones',      val: 1    },
    ];
    return (
        <SlideFrame tag="SYSTEM 01" en="How Humans Count — Base 10" ar="كيف يعدّ الإنسان — الأساس ١٠">
            <div style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', gap:28 }}>
                <TwoCol
                    left={<Body>We use <em style={{ color:'#f4f4f5' }}>10 digits (0–9)</em> because we have 10 fingers. Each position in a number is worth <em style={{ color: EMERALD }}>ten times</em> the position to its right.</Body>}
                    right={<Body dir="rtl">نستخدم <em style={{ color:'#f4f4f5' }}>١٠ أرقام (٠–٩)</em> لأن لدينا ١٠ أصابع. كل منزلة في الرقم تساوي <em style={{ color: EMERALD }}>عشرة أضعاف</em> المنزلة على يمينها.</Body>}
                />
                {/* 347 breakdown */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
                    <div style={{ display:'flex', gap:4, alignItems:'flex-end' }}>
                        {[
                            { digit:'3', place:'Hundreds', color:'#6366f1' },
                            { digit:'4', place:'Tens',     color:'#f59e0b' },
                            { digit:'7', place:'Ones',     color: EMERALD  },
                        ].map(({ digit, place, color }) => (
                            <div key={digit+place} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, padding:'12px 20px', borderRadius:10, background: CARD_DARK, border: `1px solid ${color}44` }}>
                                <span style={mono({ fontSize:42, fontWeight:700, color })}>{digit}</span>
                                <span style={en({ fontSize:11, color, textTransform:'uppercase', letterSpacing:'0.1em' })}>{place}</span>
                            </div>
                        ))}
                    </div>
                    <p style={mono({ fontSize:15, color: MUTED })}>3 × 100 + 4 × 10 + 7 × 1 = <span style={{ color:'#f4f4f5', fontWeight:700 }}>347</span></p>
                </div>
            </div>
        </SlideFrame>
    );
}

/** 6 · How computers count */
function S06() {
    const rows = Array.from({ length:8 }, (_, i) => ({
        dec: i, bin: i.toString(2).padStart(4,'0')
    }));
    return (
        <SlideFrame tag="SYSTEM 02" en="How Computers Count — Base 2" ar="كيف تعدّ الحواسيب — الأساس ٢">
            <div style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', gap:28 }}>
                <TwoCol
                    left={<Body>Computers only have <em style={{ color:'#f4f4f5' }}>2 digits (0 and 1)</em> — one per wire. Each position is worth <em style={{ color: EMERALD }}>two times</em> the position to its right. This is called <em style={{ color: EMERALD }}>Base 2</em> or Binary.</Body>}
                    right={<Body dir="rtl">الحواسيب لديها <em style={{ color:'#f4f4f5' }}>رقمان فقط (٠ و١)</em> — واحد لكل سلك. كل منزلة تساوي <em style={{ color: EMERALD }}>ضعف</em> المنزلة على يمينها. هذا يُسمى <em style={{ color: EMERALD }}>الأساس ٢</em> أو الثنائي.</Body>}
                />
                <div style={{ display:'flex', gap:12, justifyContent:'center' }}>
                    {/* Decimal col */}
                    <div style={{ background: CARD_DARK, border: CARD_BORDER, borderRadius:12, overflow:'hidden' }}>
                        <div style={{ padding:'8px 20px', borderBottom: CARD_BORDER, textAlign:'center' }}>
                            <span style={en({ fontSize:11, color: MUTED, textTransform:'uppercase', letterSpacing:'0.1em' })}>Decimal</span>
                        </div>
                        {rows.map(r => (
                            <div key={r.dec} style={{ padding:'6px 24px', borderBottom:'1px solid rgba(255,255,255,0.04)', textAlign:'center' }}>
                                <span style={mono({ fontSize:18, color:'#f4f4f5', fontWeight:700 })}>{r.dec}</span>
                            </div>
                        ))}
                    </div>
                    {/* Arrow */}
                    <div style={{ display:'flex', alignItems:'center', padding:'0 8px' }}>
                        <span style={{ fontSize:24, color: MUTED }}>→</span>
                    </div>
                    {/* Binary col */}
                    <div style={{ background: CARD_DARK, border:`1px solid ${EMERALD}33`, borderRadius:12, overflow:'hidden' }}>
                        <div style={{ padding:'8px 20px', borderBottom:`1px solid ${EMERALD}22`, textAlign:'center' }}>
                            <span style={en({ fontSize:11, color: EMERALD, textTransform:'uppercase', letterSpacing:'0.1em' })}>Binary</span>
                        </div>
                        {rows.map(r => (
                            <div key={r.dec} style={{ padding:'6px 24px', borderBottom:`1px solid rgba(16,185,129,0.08)`, textAlign:'center', display:'flex', gap:3, justifyContent:'center' }}>
                                {r.bin.split('').map((b,i) => (
                                    <span key={i} style={mono({ fontSize:18, fontWeight:700, color: b==='1' ? EMERALD : DIM })}>{b}</span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </SlideFrame>
    );
}

/** 7 · Place values side by side */
function S07() {
    return (
        <SlideFrame tag="SYSTEM 03" en="The Place-Value System" ar="نظام قيمة المنزلة">
            <div style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', gap:28 }}>
                <TwoCol
                    left={<Body>In <em style={{ color:'#f4f4f5' }}>decimal</em>, moving one step left multiplies by 10. In <em style={{ color: EMERALD }}>binary</em>, moving one step left multiplies by 2. Same idea — different number of fingers!</Body>}
                    right={<Body dir="rtl">في <em style={{ color:'#f4f4f5' }}>العشري</em>، الانتقال خطوة يساراً يضرب في ١٠. في <em style={{ color: EMERALD }}>الثنائي</em>، الانتقال يساراً يضرب في ٢. نفس الفكرة — لكن عدد أصابع مختلف!</Body>}
                />
                <div style={{ display:'flex', flexDirection:'column', gap:16, alignItems:'center' }}>
                    {/* Decimal */}
                    <div>
                        <p style={en({ fontSize:12, color: MUTED, marginBottom:8, textAlign:'center' })}>DECIMAL — multiply by 10 each step</p>
                        <div style={{ display:'flex', gap:4 }}>
                            {['10 000','1 000','100','10','1'].map(v => (
                                <div key={v} style={{ padding:'10px 16px', borderRadius:8, background: CARD_DARK, border: CARD_BORDER, textAlign:'center' }}>
                                    <span style={mono({ fontSize:16, color:'#a1a1aa', fontWeight:700 })}>{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* Binary */}
                    <div>
                        <p style={en({ fontSize:12, color: EMERALD, marginBottom:8, textAlign:'center' })}>BINARY — multiply by 2 each step</p>
                        <div style={{ display:'flex', gap:4 }}>
                            {['128','64','32','16','8','4','2','1'].map(v => (
                                <div key={v} style={{ padding:'10px 16px', borderRadius:8, background:`${EMERALD}0d`, border:`1px solid ${EMERALD}33`, textAlign:'center' }}>
                                    <span style={mono({ fontSize:16, color: EMERALD, fontWeight:700 })}>{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SlideFrame>
    );
}

/** 8 · Powers of 2 */
function S08() {
    const powers = [
        { exp:7, val:128 }, { exp:6, val:64 }, { exp:5, val:32 }, { exp:4, val:16 },
        { exp:3, val:8   }, { exp:2, val:4  }, { exp:1, val:2  }, { exp:0, val:1  },
    ];
    return (
        <SlideFrame tag="SYSTEM 04" en="The 8 Powers of Two" ar="قوى الرقم ٢ الثمانية">
            <div style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', gap:28 }}>
                <TwoCol
                    left={<Body>We use <em style={{ color: EMERALD }}>8 bits (1 byte)</em>. Each bit position holds a power of 2. The leftmost bit is worth 128 — the largest. The rightmost is worth 1 — the smallest.</Body>}
                    right={<Body dir="rtl">نستخدم <em style={{ color: EMERALD }}>٨ بتات (بايت واحد)</em>. كل موضع بت يحمل قوة من قوى ٢. البت الأيسر يساوي ١٢٨ — الأكبر. الأيمن يساوي ١ — الأصغر.</Body>}
                />
                <div style={{ display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:10, width:'100%', maxWidth:700 }}>
                    {powers.map(({ exp, val }) => (
                        <div key={val} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8,
                            padding:'16px 8px', borderRadius:12, background: CARD_DARK, border:`1px solid ${EMERALD}22` }}>
                            <span style={mono({ fontSize:12, color: MUTED })}>2<sup style={{ fontSize:9 }}>{exp}</sup></span>
                            <span style={mono({ fontSize:22, fontWeight:700, color: EMERALD })}>{val}</span>
                        </div>
                    ))}
                </div>
            </div>
        </SlideFrame>
    );
}

/** 9 · Decode a binary number */
function S09() {
    // Example: 10110100 = 128+32+16+4 = 180
    const bits = [1,0,1,1,0,1,0,0] as const;
    const vals = [128,64,32,16,8,4,2,1];
    const active = bits.map((b, i) => ({ bit: b, val: vals[i], on: b === 1 }));
    const total = active.filter(a=>a.on).reduce((s,a)=>s+a.val, 0);
    return (
        <SlideFrame tag="SYSTEM 05" en="Decoding a Binary Number" ar="فكّ شيفرة رقم ثنائي">
            <div style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', gap:28 }}>
                <TwoCol
                    left={<Body>Look at each bit from left to right. If the bit is <em style={{ color: EMERALD }}>1</em>, add its position's value. If it's <em style={{ color: MUTED }}>0</em>, skip it. Add the selected values to get the decimal number.</Body>}
                    right={<Body dir="rtl">انظر كل بت من اليسار لليمين. إذا كان البت <em style={{ color: EMERALD }}>١</em>، أضف قيمة موضعه. إذا كان <em style={{ color: MUTED }}>٠</em>، تجاوزه. اجمع القيم المختارة للحصول على الرقم.</Body>}
                />
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
                    <div style={{ display:'flex', gap:6 }}>
                        {active.map((a, i) => (
                            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                                <span style={mono({ fontSize:11, color: MUTED })}>{a.val}</span>
                                <div style={{ width:48, height:48, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center',
                                    background: a.on ? `${EMERALD}18` : 'rgba(39,39,42,0.5)',
                                    border:`2px solid ${a.on ? EMERALD : DIM}`,
                                    boxShadow: a.on ? `0 0 12px ${EMERALD}44` : 'none' }}>
                                    <span style={mono({ fontSize:22, fontWeight:700, color: a.on ? EMERALD : MUTED })}>{a.bit}</span>
                                </div>
                                {a.on && <span style={mono({ fontSize:12, color: EMERALD })}>+{a.val}</span>}
                            </div>
                        ))}
                    </div>
                    <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap', justifyContent:'center' }}>
                        {active.filter(a=>a.on).map((a, i, arr) => (
                            <span key={i} style={mono({ fontSize:16, color: EMERALD })}>
                                {a.val}{i < arr.length-1 ? ' +' : ''}
                            </span>
                        ))}
                        <span style={mono({ fontSize:16, color: MUTED })}>=</span>
                        <span style={mono({ fontSize:28, fontWeight:700, color:'#f4f4f5' })}>{total}</span>
                    </div>
                </div>
            </div>
        </SlideFrame>
    );
}

/** 10 · The byte */
function S10() {
    return (
        <SlideFrame tag="SYSTEM 06" en="The Byte — 8 Bits Together" ar="البايت — ٨ بتات معاً">
            <div style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', gap:28 }}>
                <TwoCol
                    left={<Body>8 bits grouped together form one <em style={{ color: EMERALD }}>byte</em>. A byte can represent <em style={{ color:'#f4f4f5' }}>256 different values</em> (0 through 255). Almost every number in computers comes in bytes.</Body>}
                    right={<Body dir="rtl">٨ بتات مجتمعة تشكّل <em style={{ color: EMERALD }}>بايتاً</em> واحداً. يمكن للبايت تمثيل <em style={{ color:'#f4f4f5' }}>٢٥٦ قيمة مختلفة</em> (من ٠ إلى ٢٥٥). تقريباً كل رقم في الحواسيب يأتي بالبايتات.</Body>}
                />
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
                    {/* 8 switches for the byte visual */}
                    <div style={{ display:'flex', gap:10 }}>
                        {[1,0,1,1,0,1,1,0].map((on, i) => (
                            <DipSwitch key={i} on={on===1} label={[128,64,32,16,8,4,2,1][i]} />
                        ))}
                    </div>
                    <div style={{ display:'flex', gap:24, alignItems:'center' }}>
                        <div style={{ textAlign:'center', padding:'12px 24px', borderRadius:10, background: CARD_DARK, border: CARD_BORDER }}>
                            <p style={mono({ fontSize:12, color: MUTED, marginBottom:4 })}>BINARY</p>
                            <p style={mono({ fontSize:20, fontWeight:700, color: EMERALD })}>10110110</p>
                        </div>
                        <span style={{ fontSize:24, color: MUTED }}>=</span>
                        <div style={{ textAlign:'center', padding:'12px 24px', borderRadius:10, background: CARD_DARK, border: CARD_BORDER }}>
                            <p style={mono({ fontSize:12, color: MUTED, marginBottom:4 })}>DECIMAL</p>
                            <p style={mono({ fontSize:20, fontWeight:700, color:'#f4f4f5' })}>182</p>
                        </div>
                    </div>
                    <p style={mono({ fontSize:12, color: MUTED })}>128+0+32+16+0+4+2+0 = 182</p>
                </div>
            </div>
        </SlideFrame>
    );
}

/** 11 · Colors on screen */
function S11() {
    const colors = [
        { name:'Red',   r:255, g:0,   b:0,   hex:'FF0000' },
        { name:'Green', r:0,   g:200, b:100, hex:'00C864' },
        { name:'Blue',  r:30,  g:100, b:255, hex:'1E64FF' },
        { name:'White', r:255, g:255, b:255, hex:'FFFFFF' },
    ];
    return (
        <SlideFrame tag="REAL WORLD 01" en="Bits Paint Every Pixel" ar="البتات ترسم كل بكسل">
            <div style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', gap:28 }}>
                <TwoCol
                    left={<Body>Every pixel on your screen is made of 3 bytes: <em style={{ color:'#ef4444' }}>Red</em>, <em style={{ color: EMERALD }}>Green</em>, and <em style={{ color:'#60a5fa' }}>Blue</em> — each 0 to 255. Mix them to make any colour in the world.</Body>}
                    right={<Body dir="rtl">كل بكسل على شاشتك مكوّن من ٣ بايتات: <em style={{ color:'#ef4444' }}>أحمر</em>، <em style={{ color: EMERALD }}>أخضر</em>، و<em style={{ color:'#60a5fa' }}>أزرق</em> — كل واحد من ٠ إلى ٢٥٥. امزجهم لتصنع أي لون في العالم.</Body>}
                />
                <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
                    {colors.map(c => (
                        <div key={c.name} style={{ display:'flex', flexDirection:'column', gap:10, alignItems:'center' }}>
                            <div style={{ width:64, height:64, borderRadius:12, background:`rgb(${c.r},${c.g},${c.b})`, border:'2px solid rgba(255,255,255,0.12)', boxShadow:'0 4px 16px rgba(0,0,0,0.4)' }} />
                            <div style={{ background: CARD_DARK, border: CARD_BORDER, borderRadius:10, padding:'10px 14px', display:'flex', flexDirection:'column', gap:4 }}>
                                <span style={en({ fontSize:12, color:'#f4f4f5', fontWeight:600, textAlign:'center' })}>{c.name}</span>
                                <span style={mono({ fontSize:11, color:'#ef4444' })}>R: {c.r}</span>
                                <span style={mono({ fontSize:11, color: EMERALD })}>G: {c.g}</span>
                                <span style={mono({ fontSize:11, color:'#60a5fa' })}>B: {c.b}</span>
                                <span style={mono({ fontSize:10, color: MUTED })}>#{c.hex}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SlideFrame>
    );
}

/** 12 · Text as numbers (ASCII) */
function S12() {
    const chars = [
        { ch:'A', code:65 }, { ch:'B', code:66 }, { ch:'C', code:67 },
        { ch:'a', code:97 }, { ch:'b', code:98 }, { ch:'c', code:99 },
        { ch:'0', code:48 }, { ch:'!', code:33 }, { ch:' ', code:32 },
    ];
    const word = 'HI';
    return (
        <SlideFrame tag="REAL WORLD 02" en="Letters Are Numbers Too" ar="الحروف أيضاً أرقام">
            <div style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', gap:28 }}>
                <TwoCol
                    left={<Body>Every letter has an agreed number code called <em style={{ color: EMERALD }}>ASCII</em>. When you type a message, your phone sends a list of numbers. The screen on the other end reads the numbers and shows the letters.</Body>}
                    right={<Body dir="rtl">لكل حرف رمز رقمي متفق عليه يُسمى <em style={{ color: EMERALD }}>ASCII</em>. حين تكتب رسالة، يرسل هاتفك قائمة أرقام. الشاشة في الطرف الآخر تقرأ الأرقام وتعرض الحروف.</Body>}
                />
                <div style={{ display:'flex', gap:32, justifyContent:'center', alignItems:'flex-start', flexWrap:'wrap' }}>
                    {/* ASCII table */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,auto)', gap:2, background: CARD_DARK, border: CARD_BORDER, borderRadius:12, padding:12 }}>
                        {chars.map(({ ch, code }) => (
                            <div key={ch+code} style={{ display:'flex', gap:8, alignItems:'center', padding:'4px 12px' }}>
                                <span style={mono({ fontSize:18, fontWeight:700, color:'#f4f4f5', minWidth:16, textAlign:'center' })}>
                                    {ch === ' ' ? '⎵' : ch}
                                </span>
                                <span style={mono({ fontSize:13, color: MUTED })}>→</span>
                                <span style={mono({ fontSize:14, color: EMERALD })}>{code}</span>
                            </div>
                        ))}
                    </div>
                    {/* Example word */}
                    <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'center' }}>
                        <p style={en({ fontSize:12, color: MUTED, marginBottom:4 })}>"HI" in binary:</p>
                        {word.split('').map(letter => {
                            const code = letter.charCodeAt(0);
                            return (
                                <div key={letter} style={{ display:'flex', gap:10, alignItems:'center' }}>
                                    <span style={mono({ fontSize:22, fontWeight:700, color:'#f4f4f5', width:24 })}>{letter}</span>
                                    <span style={mono({ fontSize:13, color: MUTED })}>={code}=</span>
                                    <span style={mono({ fontSize:15, color: EMERALD })}>{code.toString(2).padStart(8,'0')}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </SlideFrame>
    );
}

/** 13 · Everything is numbers */
function S13() {
    const items = [
        { icon:'🖼️', en:'Photos', ar:'صور',   desc:'Millions of pixels, each 3 bytes (RGB)' },
        { icon:'🎵', en:'Music',  ar:'موسيقى', desc:'Sound waves sampled ~44,000 times/sec'  },
        { icon:'🎬', en:'Video',  ar:'فيديو',  desc:'25–60 photo frames per second'          },
        { icon:'📝', en:'Text',   ar:'نصوص',  desc:'Each character = one ASCII code number' },
    ];
    return (
        <SlideFrame tag="REAL WORLD 03" en="Everything is a Number" ar="كل شيء هو رقم">
            <div style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', gap:28 }}>
                <TwoCol
                    left={<Body>A photo, a song, a movie, a text message — they're all ultimately <em style={{ color: EMERALD }}>lists of numbers</em> stored as billions of 1s and 0s. That's the secret of the digital world.</Body>}
                    right={<Body dir="rtl">صورة، أغنية، فيلم، رسالة نصية — كلها في نهاية المطاف <em style={{ color: EMERALD }}>قوائم من الأرقام</em> مخزّنة كمليارات من الواحدات والأصفار. هذا سرّ العالم الرقمي.</Body>}
                />
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, width:'100%', maxWidth:700 }}>
                    {items.map(({ icon, en: enLabel, ar: arLabel, desc }) => (
                        <div key={enLabel} style={{ background: CARD_DARK, border: CARD_BORDER, borderRadius:12, padding:'20px 16px', display:'flex', flexDirection:'column', gap:10, alignItems:'center', textAlign:'center' }}>
                            <span style={{ fontSize:32 }}>{icon}</span>
                            <p style={en({ fontSize:15, fontWeight:600, color:'#f4f4f5' })}>{enLabel}</p>
                            <p style={ar({ fontSize:13, color:'#a1a1aa' })}>{arLabel}</p>
                            <p style={en({ fontSize:11, color: MUTED, lineHeight:1.5 })}>{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </SlideFrame>
    );
}

/** 14 · The challenge rules */
function S14() {
    const enSteps = [
        { n:'01', t:'A number (0–255) appears on screen every pulse.' },
        { n:'02', t:'Flip your 8 DIP switches to represent it in binary.' },
        { n:'03', t:'When your switch sum matches the number, it auto-commits.' },
        { n:'04', t:'Faster = more points. Up to 20 pts per pulse.' },
    ];
    const arSteps = [
        { n:'٠١', t:'يظهر رقم (٠–٢٥٥) على الشاشة في كل نبضة.' },
        { n:'٠٢', t:'اضبط مفاتيح DIP الثمانية لتمثّله بنظام ثنائي.' },
        { n:'٠٣', t:'حين يساوي مجموعك الرقم، يُرسَل الجواب تلقائياً.' },
        { n:'٠٤', t:'الأسرع = نقاط أكثر. الحد الأقصى ٢٠ نقطة لكل نبضة.' },
    ];
    return (
        <SlideFrame tag="CHALLENGE" en="The Binary Clock Challenge" ar="تحدّي الساعة الثنائية">
            <div style={{ width:'100%', maxWidth:900, display:'flex', flexDirection:'column', gap:24 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:40, width:'100%' }}>
                    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                        {enSteps.map(({ n, t }) => (
                            <div key={n} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                                <span style={mono({ fontSize:12, color: EMERALD, minWidth:24, marginTop:2 })}>{n}</span>
                                <p style={en({ fontSize:15, color:'#a1a1aa', lineHeight:1.6 })}>{t}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:12, direction:'rtl' }}>
                        {arSteps.map(({ n, t }) => (
                            <div key={n} style={{ display:'flex', gap:12, alignItems:'flex-start' }}>
                                <span style={mono({ fontSize:12, color: EMERALD, minWidth:28 })}>{n}</span>
                                <p style={ar({ fontSize:15, color:'#a1a1aa', lineHeight:1.6 })}>{t}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* mini switch demo */}
                <div style={{ display:'flex', gap:8, justifyContent:'center', alignItems:'flex-end', flexWrap:'wrap' }}>
                    {([1,0,1,1,0,1,0,0] as const).map((on, i) => (
                        <DipSwitch key={i} on={on===1} label={[128,64,32,16,8,4,2,1][i]} />
                    ))}
                    <span style={mono({ fontSize:14, color: MUTED, marginLeft:12, marginBottom:16 })}>= 180</span>
                </div>
            </div>
        </SlideFrame>
    );
}

/** 15 · QR Code */
function S15({ loginUrl }: { loginUrl: string }) {
    return (
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:28, width:'100%', maxWidth:800 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr auto 1fr', alignItems:'center', gap:20, width:'100%' }}>
                <div>
                    <Chip color={EMERALD}>JOIN NOW</Chip>
                    <h2 style={en({ fontSize:38, fontWeight:800, color:'#f4f4f5', marginTop:8 })}>Scan to Initialize</h2>
                    <p style={en({ fontSize:16, color: MUTED, marginTop:8, lineHeight:1.6 })}>
                        Open the link on your phone.<br/>Enter your Terminal ID to begin.
                    </p>
                </div>
                <div style={{ width:1, background:'rgba(255,255,255,0.07)', alignSelf:'stretch' }} />
                <div style={{ textAlign:'right' }}>
                    <Chip color={EMERALD}>انضم الآن</Chip>
                    <h2 style={ar({ fontSize:34, fontWeight:700, color:'#f4f4f5', marginTop:8 })}>امسح الرمز للبدء</h2>
                    <p style={ar({ fontSize:16, color: MUTED, marginTop:8, lineHeight:1.7 })}>
                        افتح الرابط على هاتفك.<br/>أدخل رقم طرفيتك للانضمام.
                    </p>
                </div>
            </div>
            <div style={{ display:'flex', gap:32, alignItems:'center', justifyContent:'center', flexWrap:'wrap' }}>
                <div style={{ padding:16, borderRadius:16, background:'#fff', boxShadow:`0 0 40px ${EMERALD}33` }}>
                    <QRCodeSVG value={loginUrl} size={200} bgColor="#ffffff" fgColor="#0a0a0a" level="M" />
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    <div style={{ padding:'12px 24px', borderRadius:10, background: CARD_DARK, border: CARD_BORDER }}>
                        <p style={mono({ fontSize:12, color: MUTED, marginBottom:4 })}>URL</p>
                        <p style={mono({ fontSize:14, color:'#f4f4f5' })}>{loginUrl}</p>
                    </div>
                    <div style={{ padding:'12px 24px', borderRadius:10, background:`${EMERALD}0d`, border:`1px solid ${EMERALD}33` }}>
                        <p style={mono({ fontSize:12, color: EMERALD, marginBottom:4 })}>Your login credentials</p>
                        <p style={mono({ fontSize:13, color:'#a1a1aa' })}>Terminal ID = your assigned number</p>
                        <p style={mono({ fontSize:13, color:'#a1a1aa' })}>Access Key  = same number</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─────────────────────── slide registry ─────────────────────── */
type SlideFC = React.FC<{ loginUrl: string }>;

const SLIDES: { component: SlideFC; chapter: string }[] = [
    { component: ({ loginUrl: _ }) => <S01 />,           chapter: 'Intro' },
    { component: ({ loginUrl: _ }) => <S02 />,           chapter: 'Foundation' },
    { component: ({ loginUrl: _ }) => <S03 />,           chapter: 'Foundation' },
    { component: ({ loginUrl: _ }) => <S04 />,           chapter: 'Foundation' },
    { component: ({ loginUrl: _ }) => <S05 />,           chapter: 'System' },
    { component: ({ loginUrl: _ }) => <S06 />,           chapter: 'System' },
    { component: ({ loginUrl: _ }) => <S07 />,           chapter: 'System' },
    { component: ({ loginUrl: _ }) => <S08 />,           chapter: 'System' },
    { component: ({ loginUrl: _ }) => <S09 />,           chapter: 'System' },
    { component: ({ loginUrl: _ }) => <S10 />,           chapter: 'System' },
    { component: ({ loginUrl: _ }) => <S11 />,           chapter: 'Real World' },
    { component: ({ loginUrl: _ }) => <S12 />,           chapter: 'Real World' },
    { component: ({ loginUrl: _ }) => <S13 />,           chapter: 'Real World' },
    { component: (props)          => <S14 />,            chapter: 'Challenge' },
    { component: (props)          => <S15 {...props} />, chapter: 'Challenge' },
];

/* ─────────────────────── transitions ─────────────────────── */
const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit:  (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
};

/* ─────────────────────── main component ─────────────────────── */
export default function Presentation({ loginUrl }: Props) {
    const [index, setIndex] = useState(0);
    const [dir, setDir]     = useState(1);

    const go = (next: number) => {
        if (next < 0 || next >= SLIDES.length) return;
        setDir(next > index ? 1 : -1);
        setIndex(next);
    };

    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') go(index + 1);
            if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')                    go(index - 1);
        };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [index]);

    const { component: Slide, chapter } = SLIDES[index];
    const progress = ((index + 1) / SLIDES.length) * 100;

    /* chapter colour map */
    const chapterColor: Record<string, string> = {
        'Intro': '#6366f1', 'Foundation': '#f59e0b',
        'System': EMERALD,  'Real World': '#60a5fa', 'Challenge': '#10b981',
    };
    const cc = chapterColor[chapter] ?? EMERALD;

    return (
        <>
            <Head title="Technical Briefing" />
            <style>{FONTS}</style>

            <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col select-none overflow-hidden"
                style={BG}>

                {/* Chapter tag top-left */}
                <div className="flex items-center gap-3 px-8 pt-5 shrink-0">
                    <span style={{ ...mono({ fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase' }), color: cc }}>
                        {chapter}
                    </span>
                    <span style={{ color:'rgba(255,255,255,0.08)', fontSize:11 }}>·</span>
                    <span style={mono({ fontSize:11, color:'rgba(255,255,255,0.15)' })}>
                        {String(index + 1).padStart(2,'0')} / {String(SLIDES.length).padStart(2,'0')}
                    </span>
                </div>

                {/* Slide content */}
                <div className="flex-1 flex items-center justify-center px-8 py-6 overflow-hidden">
                    <AnimatePresence mode="wait" custom={dir}>
                        <motion.div
                            key={index}
                            custom={dir}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                            style={{ width:'100%', display:'flex', justifyContent:'center' }}
                        >
                            <Slide loginUrl={loginUrl} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="shrink-0 px-8 pb-6 space-y-3">
                    {/* Progress bar */}
                    <div style={{ height:2, background:'rgba(255,255,255,0.06)', borderRadius:99, overflow:'hidden' }}>
                        <motion.div
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.4, ease: 'easeOut' }}
                            style={{ height:'100%', background: cc, borderRadius:99, boxShadow:`0 0 8px ${cc}88` }}
                        />
                    </div>

                    {/* Nav */}
                    <div className="flex items-center justify-between">
                        <span style={mono({ fontSize:11, color:'rgba(255,255,255,0.2)' })}>
                            ← → or Space to navigate
                        </span>

                        <div className="flex items-center gap-2">
                            <NavBtn onClick={() => go(index - 1)} disabled={index === 0} label="←" />
                            <div className="flex gap-1.5">
                                {SLIDES.map((s, i) => {
                                    const dot_cc = chapterColor[s.chapter] ?? EMERALD;
                                    return (
                                        <button key={i} onClick={() => go(i)}
                                            style={{
                                                width: 7, height: 7, borderRadius: 99,
                                                background: i === index ? dot_cc : 'rgba(255,255,255,0.12)',
                                                border: 'none', cursor:'pointer', padding:0,
                                                boxShadow: i === index ? `0 0 5px ${dot_cc}` : 'none',
                                                transition:'all 0.2s',
                                            }} />
                                    );
                                })}
                            </div>
                            <NavBtn onClick={() => go(index + 1)} disabled={index === SLIDES.length - 1} label="→" />
                        </div>

                        <span style={mono({ fontSize:11, color:'rgba(255,255,255,0.2)' })}>
                            HASHTAT · BINARY CLOCK
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

function NavBtn({ onClick, disabled, label }: { onClick:()=>void; disabled:boolean; label:string }) {
    return (
        <button onClick={onClick} disabled={disabled}
            style={{
                width:32, height:32, borderRadius:8, border:'1px solid rgba(255,255,255,0.08)',
                background:'transparent', color:'rgba(255,255,255,0.3)', cursor: disabled ? 'default' : 'pointer',
                fontFamily:"'JetBrains Mono',monospace", fontSize:14, opacity: disabled ? 0.2 : 1,
                display:'flex', alignItems:'center', justifyContent:'center',
            }}
            onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.color = '#fff'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.3)'; }}>
            {label}
        </button>
    );
}
