'use client'

import { round, seeded } from '@/lib/random'
import { bobClass, type Bob, type Spot } from './layout'
import { Interactive } from './interactive'

const LANTERN_GLOW = [26, 90, 170]
const LANTERN_POOL = [20, 90, 160]

export function Lantern({ spot, level, onToggle }: { spot: Spot; level: number; onToggle: () => void }) {
  return (
    <g className={bobClass(spot.bob)}>
      <g transform={`translate(${spot.x} ${spot.y})`}>
        <defs>
          <radialGradient id="lantern-glow">
            <stop offset="0%" stopColor="#ffe2a0" stopOpacity="0.75" />
            <stop offset="45%" stopColor="#ffb86a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#ffb86a" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse
          cx="16"
          cy="2"
          rx={LANTERN_POOL[level]}
          ry={LANTERN_POOL[level] * 0.22}
          fill="#ffd38a"
          opacity={level === 0 ? 0.04 : 0.14 + level * 0.06}
          style={{ transition: 'all 1.2s ease' }}
        />
        <circle
          cx="16"
          cy="-54"
          r={LANTERN_GLOW[level]}
          fill="url(#lantern-glow)"
          style={{ transition: 'r 1.2s ease, opacity 1.2s ease', opacity: level === 0 ? 0.35 : 1 }}
        />
        <Interactive label={`A lantern, ${['resting', 'lit', 'blazing'][level]}. Touch to change its light.`} onActivate={onToggle}>
          <rect x="-12" y="-90" width="50" height="94" fill="transparent" />
          <path d="M0 0 L0 -76 Q 0 -82 8 -82 L 16 -82 L 16 -72" fill="none" stroke="#1a1430" strokeWidth="3" strokeLinecap="round" />
          <path d="M0 0 L0 -76 Q 0 -82 8 -82 L 16 -82" fill="none" className="tint" style={{ stroke: 'var(--rim)' }} strokeOpacity="0.4" strokeWidth="1" />
          <path d="M8 -70 L24 -70 L22 -66 L10 -66 Z" fill="#2a2040" />
          <rect x="9" y="-66" width="14" height="20" rx="3" fill="#ffe6b0" opacity={0.25 + level * 0.3} style={{ transition: 'opacity 1s' }} stroke="#3a2c50" strokeWidth="1.4" />
          <ellipse
            cx="16"
            cy="-55"
            rx="3"
            ry="5"
            fill="#fff4d6"
            className="anim-flicker fill-base"
            style={{ opacity: level === 0 ? 0.25 : 1, transition: 'opacity 1s' }}
          />
          <path d="M10 -46 L22 -46 L20 -42 L12 -42 Z" fill="#2a2040" />
          <rect x="-14" y="-92" width="54" height="98" rx="10" fill="none" stroke="#fff" strokeOpacity="0.5" strokeDasharray="3 4" className="focus-ring" />
        </Interactive>
      </g>
    </g>
  )
}

const MOON_SHADOW = [80, 44, 28, 14, 2]

export function TinyMoon({ spot, phase, onToggle }: { spot: Spot; phase: number; onToggle: () => void }) {
  const lit = 1 - phase / (MOON_SHADOW.length - 1)
  return (
    <g transform={`translate(${spot.x} ${spot.y})`}>
      <g className="anim-bob-c">
        <defs>
          <radialGradient id="moon-surface" cx="35%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#dfe2ff" />
            <stop offset="100%" stopColor="#a8aee0" />
          </radialGradient>
          <mask id="moon-mask">
            <circle r="26" fill="#fff" />
            <circle
              r="27"
              fill="#000"
              style={{ transform: `translateX(${MOON_SHADOW[phase]}px)`, transition: 'transform 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
          </mask>
        </defs>
        <circle r="110" fill="#e6e9ff" opacity={0.05 + lit * 0.14} filter="url(#soft-blur)" style={{ transition: 'opacity 1.4s' }} />
        <Interactive label="A tiny moon. Touch to turn its phase." onActivate={onToggle}>
          <circle r="40" fill="transparent" />
          <circle r="26" fill="#1a1d3a" opacity="0.6" />
          <circle r="26" fill="url(#moon-surface)" mask="url(#moon-mask)" />
          <circle cx="-8" cy="-6" r="4" fill="#b8bde8" opacity="0.35" mask="url(#moon-mask)" />
          <circle cx="7" cy="9" r="2.5" fill="#b8bde8" opacity="0.35" mask="url(#moon-mask)" />
          <circle r="26" fill="none" stroke="#e6e9ff" strokeOpacity="0.25" />
          <g className="anim-rays" style={{ transformOrigin: '0px 0px', animationDuration: '18s' }}>
            <circle cx="44" cy="0" r="2" fill="#f4f6ff" />
          </g>
          <circle r="38" fill="none" stroke="#fff" strokeOpacity="0.5" strokeDasharray="3 4" className="focus-ring" />
        </Interactive>
      </g>
    </g>
  )
}

const rainRand = seeded(3)
const DROPS = Array.from({ length: 26 }, () => ({
  x: round(-70 + rainRand() * 140),
  y: round(rainRand() * 80),
  d: round(rainRand() * 0.7),
}))

export function RainCloud({ spot, raining, onRain }: { spot: Spot; raining: boolean; onRain: () => void }) {
  return (
    <g transform={`translate(${spot.x} ${spot.y})`}>
      <g className="anim-drift" style={{ animationDuration: '30s' }}>
        <g style={{ opacity: raining ? 1 : 0, transition: 'opacity 0.8s ease' }} aria-hidden="true">
          <clipPath id="rain-clip">
            <rect x="-90" y="10" width="180" height="200" />
          </clipPath>
          <g clipPath="url(#rain-clip)">
            {DROPS.map((d, i) => (
              <line
                key={i}
                x1={d.x}
                y1={d.y}
                x2={d.x - 3}
                y2={d.y + 14}
                stroke="#bfe4ff"
                strokeOpacity="0.7"
                strokeWidth="1.2"
                strokeLinecap="round"
                className="anim-rain"
                style={{ animationDelay: `${-d.d}s` }}
              />
            ))}
          </g>
        </g>
        <Interactive label={raining ? 'A rain cloud, raining.' : 'A rain cloud. Touch to make it rain.'} onActivate={onRain}>
          <ellipse rx="110" ry="54" fill="transparent" />
          <g className="tint" style={{ fill: 'var(--mist)' }} opacity={raining ? 0.95 : 0.75}>
            <circle cx="-40" cy="0" r="30" />
            <circle cx="-6" cy="-18" r="38" />
            <circle cx="34" cy="-4" r="30" />
            <circle cx="62" cy="8" r="20" />
            <rect x="-70" y="0" width="140" height="26" rx="13" />
          </g>
          <path d="M-60 -10 C -50 -36 -20 -52 6 -52" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="2" strokeLinecap="round" />
          <circle cx="-6" cy="-6" r="70" fill="#bfe4ff" opacity={raining ? 0.12 : 0.05} filter="url(#soft-blur)" />
          <ellipse rx="100" ry="56" cy="-8" fill="none" stroke="#fff" strokeOpacity="0.5" strokeDasharray="3 4" className="focus-ring" />
        </Interactive>
      </g>
    </g>
  )
}

export function River({ path, water, bob, waterfall }: { path: string; water: number; bob?: Bob; waterfall: boolean }) {
  const reveal = water / 3
  return (
    <g className={bobClass(bob)} aria-hidden="true" pointerEvents="none">
      <path
        d={path}
        pathLength={100}
        fill="none"
        stroke="#9fd8ff"
        strokeOpacity="0.35"
        strokeWidth={6 + water * 6}
        strokeLinecap="round"
        filter="url(#glow-sm)"
        strokeDasharray="100 100"
        style={{ strokeDashoffset: 100 - reveal * 100, transition: 'stroke-dashoffset 4s ease, stroke-width 3s ease' }}
      />
      <path
        d={path}
        pathLength={100}
        fill="none"
        stroke="#d6eeff"
        strokeOpacity="0.8"
        strokeWidth={1.5 + water}
        strokeLinecap="round"
        strokeDasharray="100 100"
        style={{ strokeDashoffset: 100 - reveal * 100, transition: 'stroke-dashoffset 4s ease, stroke-width 3s ease' }}
      />
      {waterfall && (
        <g style={{ opacity: water > 0 ? 1 : 0, transition: 'opacity 2s ease 2.4s' }}>
          <path
            d="M1062 602 C 1072 680 1066 780 1070 900"
            fill="none"
            stroke="#bfe4ff"
            strokeOpacity="0.3"
            strokeWidth={4 + water * 4}
            filter="url(#glow-sm)"
          />
          <path
            d="M1062 602 C 1072 680 1066 780 1070 900"
            fill="none"
            stroke="#eaf6ff"
            strokeOpacity="0.7"
            strokeWidth="1.4"
            strokeDasharray="14 10"
            className="anim-fall"
          />
        </g>
      )}
    </g>
  )
}
