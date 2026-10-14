'use client'

import { useRef, type CSSProperties, type PointerEvent } from 'react'
import { cn } from '@/lib/utils'
import { round, seeded } from '@/lib/random'

const rand = seeded(7)
const STARS = Array.from({ length: 110 }, () => ({
  x: round(rand() * 1600),
  y: round(rand() * 560),
  r: round(0.4 + rand() * 1.3),
  d: round(rand() * 6),
}))
const MOTES = Array.from({ length: 22 }, () => ({
  left: round(38 + rand() * 24),
  top: round(55 + rand() * 30),
  size: round(1.5 + rand() * 2.5),
  dur: round(9 + rand() * 10),
  delay: round(-rand() * 18),
}))

const parallax = (depth: number): CSSProperties => ({
  transform: `translate(calc(var(--px, 0) * ${depth}px), calc(var(--py, 0) * ${depth * 0.5}px))`,
  transition: 'transform 1.2s cubic-bezier(0.2, 0.7, 0.2, 1)',
})

type Props = {
  opening: boolean
  invitedName: string | null
  onEnter: () => void
}

export function Threshold({ opening, invitedName, onEnter }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)

  const handlePointer = (e: PointerEvent<HTMLDivElement>) => {
    const el = rootRef.current
    if (!el || e.pointerType !== 'mouse') return
    el.style.setProperty('--px', ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3))
    el.style.setProperty('--py', ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3))
  }

  return (
    <div
      ref={rootRef}
      onPointerMove={handlePointer}
      className={cn(
        'absolute inset-0 z-30 overflow-hidden bg-[#04040f] transition-opacity duration-1000',
        opening && 'pointer-events-none opacity-0 delay-[1100ms]',
      )}
    >
      <svg
        className="fade-in absolute inset-0 h-full w-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="th-bg" cx="50%" cy="78%" r="80%">
            <stop offset="0%" stopColor="#3a2470" />
            <stop offset="35%" stopColor="#170f3c" />
            <stop offset="70%" stopColor="#080822" />
            <stop offset="100%" stopColor="#03030c" />
          </radialGradient>
          <radialGradient id="th-planet" cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#4b3a8a" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#1a1446" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1a1446" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="th-ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1c1446" />
            <stop offset="100%" stopColor="#05040f" />
          </linearGradient>
          <linearGradient id="th-spire" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2060" />
            <stop offset="100%" stopColor="#0a0820" />
          </linearGradient>
          <radialGradient id="th-pool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd9a0" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#b392ff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#b392ff" stopOpacity="0" />
          </radialGradient>
          <filter id="th-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
        </defs>

        <rect width="1600" height="900" fill="url(#th-bg)" />

        <g style={parallax(-6)}>
          {STARS.map((s, i) => (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill="#e9e4ff"
              className="anim-twinkle"
              style={{ animationDelay: `${-s.d}s` }}
            />
          ))}
        </g>

        <g style={parallax(-10)}>
          <circle cx="1190" cy="250" r="190" fill="url(#th-planet)" />
          <ellipse
            cx="1190"
            cy="250"
            rx="300"
            ry="46"
            fill="none"
            stroke="#8f7ae0"
            strokeOpacity="0.22"
            strokeWidth="1.5"
            transform="rotate(-14 1190 250)"
          />
          <circle cx="330" cy="170" r="22" fill="#cfc4ff" opacity="0.12" />
        </g>

        <g style={parallax(-16)}>
          <path
            d="M0 640 L60 560 L90 600 L150 470 L190 560 L240 520 L300 610 L360 590 L420 640 L520 600 L600 650 L700 620 L780 660 L880 640 L1000 600 L1080 640 L1160 560 L1210 600 L1280 430 L1320 560 L1380 520 L1440 600 L1520 560 L1600 610 L1600 900 L0 900 Z"
            fill="url(#th-spire)"
            opacity="0.85"
          />
          <path d="M415 640 C 415 520, 545 520, 545 640" fill="none" stroke="#2a2060" strokeWidth="14" />
        </g>

        <g style={parallax(-24)}>
          <g className="anim-bob-b">
            <path d="M250 380 L330 380 L310 410 L290 430 L270 408 Z" fill="#191440" />
            <ellipse cx="290" cy="380" rx="40" ry="6" fill="#2c2466" />
          </g>
          <g className="anim-bob-c">
            <path d="M1300 470 L1350 470 L1338 492 L1322 506 L1310 490 Z" fill="#191440" />
            <ellipse cx="1325" cy="470" rx="25" ry="4" fill="#2c2466" />
          </g>
          <g className="anim-bob-d">
            <path d="M1050 330 L1074 330 L1066 344 L1058 350 Z" fill="#191440" />
          </g>
        </g>

        <path
          d="M0 700 C 300 680, 600 690, 800 688 S 1300 680, 1600 700 L1600 900 L0 900 Z"
          fill="url(#th-ground)"
        />

        <ellipse cx="800" cy="720" rx="420" ry="70" fill="url(#th-pool)" />
        <ellipse cx="800" cy="760" rx="60" ry="140" fill="#ffd9a0" opacity="0.08" filter="url(#th-blur)" />

        <g className="anim-drift" opacity="0.5">
          <ellipse cx="400" cy="690" rx="420" ry="40" fill="#5a4aa8" opacity="0.25" filter="url(#th-blur)" />
          <ellipse cx="1250" cy="700" rx="460" ry="44" fill="#5a4aa8" opacity="0.22" filter="url(#th-blur)" />
        </g>
        <g className="anim-drift-slow" opacity="0.5">
          <ellipse cx="800" cy="800" rx="700" ry="50" fill="#3a2e7a" opacity="0.35" filter="url(#th-blur)" />
        </g>
      </svg>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {MOTES.map((m, i) => (
          <span
            key={i}
            className="anim-rise absolute rounded-full bg-[#ffe6b8]"
            style={{
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: m.size,
              height: m.size,
              boxShadow: '0 0 8px 2px rgba(255, 220, 160, 0.6)',
              animationDuration: `${m.dur}s`,
              animationDelay: `${m.delay}s`,
            }}
          />
        ))}
      </div>

      <div
        className="pointer-events-none absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div
          className="anim-rays absolute left-1/2 top-1/2 size-[min(120vw,900px)] -translate-x-1/2 -translate-y-1/2 opacity-40"
          style={{
            background:
              'repeating-conic-gradient(from 0deg, rgba(255,220,170,0.16) 0deg 3deg, transparent 3deg 14deg)',
            maskImage: 'radial-gradient(circle, black 0%, transparent 60%)',
            WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 60%)',
          }}
        />
        <div className="anim-float">
          <div
            className="relative w-[clamp(96px,11vw,150px)] transition-transform ease-[cubic-bezier(0.7,0,0.25,1)]"
            style={{
              aspectRatio: '5 / 9',
              transform: opening ? 'scale(16)' : 'scale(1)',
              transitionDuration: '1700ms',
            }}
          >
            <div className="absolute -inset-3 rounded-t-full border border-[#ffe9c4]/40" />
            <div
              className="anim-breathe absolute inset-0 overflow-hidden rounded-t-full"
              style={{
                background:
                  'linear-gradient(180deg, #fff8e6 0%, #ffe0a8 28%, #d6b4ff 70%, #8f7cff 100%)',
                boxShadow:
                  '0 0 30px 6px rgba(255, 220, 160, 0.55), 0 0 110px 36px rgba(170, 130, 255, 0.35), 0 0 260px 110px rgba(110, 80, 255, 0.18)',
              }}
            >
              <div
                className="absolute inset-0 opacity-70 mix-blend-soft-light"
                style={{
                  background:
                    'radial-gradient(circle at 30% 30%, white 0 1px, transparent 2px), radial-gradient(circle at 70% 55%, white 0 1px, transparent 2px), radial-gradient(circle at 45% 75%, white 0 1px, transparent 2px)',
                  backgroundSize: '40px 40px, 56px 56px, 34px 34px',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_44%,#fff4dc_0%,#d8c2ff_35%,#7a68e0_75%)] opacity-0 transition-opacity duration-700',
          opening && 'opacity-100 delay-700',
        )}
        aria-hidden="true"
      />

      <div
        className={cn(
          'absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-[max(3.5rem,env(safe-area-inset-bottom))] text-center transition-all duration-700',
          opening && 'translate-y-4 opacity-0',
        )}
      >
        <p className="fade-up mb-4 text-[11px] font-medium uppercase tracking-[0.35em] text-[#cfc6ff]/70" style={{ animationDelay: '0.4s' }}>
          {invitedName ? `${invitedName} was made for you` : 'A Door to Another World'}
        </p>
        <h1
          className="fade-up text-glow max-w-xl text-balance font-serif text-4xl font-medium italic leading-tight text-[#f4efff] md:text-6xl"
          style={{ animationDelay: '0.9s' }}
        >
          {'You found a place that doesn\u2019t exist yet.'}
        </h1>
        <button
          type="button"
          onClick={onEnter}
          disabled={opening}
          className="fade-up group relative mt-10 rounded-full border border-[#ffe3b0]/40 bg-[#ffe3b0]/10 px-9 py-3.5 font-serif text-xl tracking-wide text-[#fff3dc] backdrop-blur-md transition-all duration-500 hover:border-[#ffe3b0]/80 hover:bg-[#ffe3b0]/20 hover:shadow-[0_0_40px_6px_rgba(255,214,150,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe3b0]/70"
          style={{ animationDelay: '1.6s' }}
        >
          Step inside
          <span className="absolute inset-0 -z-10 rounded-full bg-[#ffd9a0]/20 blur-xl transition-opacity duration-500 group-hover:opacity-100 md:opacity-0" />
        </button>
      </div>
    </div>
  )
}
