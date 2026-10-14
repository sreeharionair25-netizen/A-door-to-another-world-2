'use client'

import { round, seeded } from '@/lib/random'
import type { LandId } from '@/lib/world'
import { Interactive, useReaction } from './interactive'

export function pinePath(x: number, y: number, h: number) {
  const w = h * 0.38
  const top = y - h
  const tiers = 4
  const crown = h * 0.84
  const right: string[] = []
  const left: string[] = []
  for (let i = 1; i <= tiers; i++) {
    const ty = top + (crown * i) / tiers
    const half = (w / 2) * (0.3 + (0.7 * i) / tiers)
    right.push(`L${round(x + half)} ${round(ty)}`)
    left.unshift(`L${round(x - half)} ${round(ty)}`)
    if (i < tiers) {
      right.push(`L${round(x + half * 0.42)} ${round(ty - h * 0.02)}`)
      left.unshift(`L${round(x - half * 0.42)} ${round(ty - h * 0.02)}`)
    }
  }
  const trunk = w * 0.06
  const base = top + crown
  return `M${round(x)} ${round(top)} ${right.join(' ')} L${round(x + trunk)} ${round(base)} L${round(x + trunk)} ${y} L${round(x - trunk)} ${y} L${round(x - trunk)} ${round(base)} ${left.join(' ')} Z`
}

const forestRand = seeded(11)
const BACK_PINES = Array.from({ length: 30 }, (_, i) => ({
  x: round(i * 56 + forestRand() * 30 - 10),
  y: round(598 + forestRand() * 16),
  h: round(70 + forestRand() * 70),
  d: round(forestRand() * 6),
}))
const MID_PINES = Array.from({ length: 16 }, (_, i) => ({
  x: round(i * 106 + forestRand() * 50),
  y: round(668 + forestRand() * 14),
  h: round(120 + forestRand() * 80),
  d: round(forestRand() * 6),
})).filter((p) => p.x < 560 || p.x > 1110)
const FRONT_PINES = [
  { x: 70, y: 820, h: 470 },
  { x: 220, y: 860, h: 420 },
  { x: 1360, y: 850, h: 440 },
  { x: 1530, y: 820, h: 500 },
]
const FIREFLIES = Array.from({ length: 16 }, () => ({
  x: round(380 + forestRand() * 840),
  y: round(600 + forestRand() * 140),
  d: round(forestRand() * 5),
}))
const STONES = [
  { x: 640, y: 804, r: 5 },
  { x: 672, y: 796, r: 4 },
  { x: 708, y: 800, r: 5.5 },
  { x: 742, y: 790, r: 4 },
]

function Forest() {
  return (
    <g>
      <path
        d="M0 600 C 200 570 400 595 600 580 S 1000 560 1200 585 S 1500 570 1600 590 L1600 900 L0 900 Z"
        className="tint"
        style={{ fill: 'var(--mid)' }}
      />
      {BACK_PINES.map((p, i) => (
        <path
          key={i}
          d={pinePath(p.x, p.y, p.h)}
          className="tint fill-base anim-sway"
          style={{ fill: 'var(--mid)', stroke: 'var(--rim)', animationDelay: `${-p.d}s` }}
          strokeOpacity="0.14"
          strokeWidth="1"
        />
      ))}
      <path
        d={pinePath(1180, 612, 240)}
        className="tint fill-base anim-sway"
        style={{ fill: 'var(--mid)', stroke: 'var(--rim)' }}
        strokeOpacity="0.3"
        strokeWidth="1.2"
      />
      <path
        d="M0 670 C 250 640 500 662 800 650 S 1300 636 1600 660 L1600 900 L0 900 Z"
        className="tint"
        style={{ fill: 'var(--near)' }}
      />
      {MID_PINES.map((p, i) => (
        <path
          key={i}
          d={pinePath(p.x, p.y, p.h)}
          className="tint fill-base anim-sway"
          style={{ fill: 'var(--near)', stroke: 'var(--rim)', animationDelay: `${-p.d}s` }}
          strokeOpacity="0.1"
        />
      ))}
      <ellipse cx="830" cy="720" rx="380" ry="60" className="tint" style={{ fill: 'var(--rim)' }} opacity="0.07" />
      <path
        d="M0 728 C 300 708 600 724 800 718 S 1300 710 1600 734 L1600 900 L0 900 Z"
        fill="#03040c"
        opacity="0.72"
      />
      {STONES.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r={s.r}
          fill="#e8ecff"
          opacity="0.55"
          className="anim-pulse"
          style={{ animationDelay: `${-i * 0.6}s` }}
        />
      ))}
      {FIREFLIES.map((f, i) => (
        <circle
          key={i}
          cx={f.x}
          cy={f.y}
          r="1.8"
          fill="#fff1b8"
          className="anim-twinkle"
          style={{ animationDelay: `${-f.d}s` }}
        />
      ))}
      {FRONT_PINES.map((p, i) => (
        <path
          key={i}
          d={pinePath(p.x, p.y, p.h)}
          fill="#02030a"
          className="fill-base anim-sway"
          style={{ animationDelay: `${-i * 1.3}s` }}
        />
      ))}
    </g>
  )
}

const islandRand = seeded(23)
function islandPath(cx: number, cy: number, rx: number, depth: number) {
  const n = 10
  const pts: string[] = []
  for (let i = 1; i < n; i++) {
    const t = i / n
    const x = cx - rx + 2 * rx * t
    const d = Math.pow(Math.sin(Math.PI * t), 0.9) * depth * (0.7 + islandRand() * 0.5)
    pts.push(`L${round(x)} ${round(cy + d)}`)
  }
  return `M${cx - rx} ${cy} ${pts.join(' ')} L${cx + rx} ${cy} Z`
}

const ISLANDS = [
  { cx: 800, cy: 594, rx: 280, ry: 34, depth: 210, bob: 'a', roots: 7 },
  { cx: 360, cy: 474, rx: 140, ry: 20, depth: 120, bob: 'b', roots: 4 },
  { cx: 1250, cy: 504, rx: 160, ry: 22, depth: 140, bob: 'c', roots: 4 },
  { cx: 560, cy: 372, rx: 46, ry: 8, depth: 44, bob: 'd', roots: 2 },
].map((isl) => ({
  ...isl,
  path: islandPath(isl.cx, isl.cy, isl.rx, isl.depth),
  rootLines: Array.from({ length: isl.roots }, () => {
    const x = round(isl.cx - isl.rx * 0.7 + islandRand() * isl.rx * 1.4)
    const len = round(isl.depth * (0.4 + islandRand() * 0.6))
    return { x, len, sway: round(islandRand() * 16 - 8) }
  }),
}))

function Islands() {
  return (
    <g>
      <defs>
        <linearGradient id="rock-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="tint" style={{ stopColor: 'var(--far)' }} />
          <stop offset="100%" stopColor="#04040e" />
        </linearGradient>
      </defs>
      <g className="anim-drift" filter="url(#soft-blur)">
        <ellipse cx="400" cy="800" rx="520" ry="60" className="tint" style={{ fill: 'var(--mist)' }} opacity="0.35" />
        <ellipse cx="1240" cy="820" rx="560" ry="70" className="tint" style={{ fill: 'var(--mist)' }} opacity="0.3" />
      </g>
      <g className="anim-drift-slow" filter="url(#soft-blur)">
        <ellipse cx="800" cy="880" rx="900" ry="80" className="tint" style={{ fill: 'var(--mist)' }} opacity="0.4" />
      </g>
      {ISLANDS.map((isl, i) => (
        <g key={i} className={`anim-bob-${isl.bob}`}>
          {isl.rootLines.map((r, j) => (
            <path
              key={j}
              d={`M${r.x} ${isl.cy + 6} q ${r.sway} ${r.len / 2} ${-r.sway / 2} ${r.len}`}
              fill="none"
              className="tint"
              style={{ stroke: 'var(--rim)' }}
              strokeOpacity="0.25"
              strokeWidth="1.2"
            />
          ))}
          <path d={isl.path} fill="url(#rock-grad)" />
          <ellipse cx={isl.cx} cy={isl.cy} rx={isl.rx} ry={isl.ry} className="tint" style={{ fill: 'var(--mid)' }} />
          <ellipse
            cx={isl.cx}
            cy={isl.cy - 2}
            rx={isl.rx * 0.96}
            ry={isl.ry * 0.82}
            fill="none"
            className="tint"
            style={{ stroke: 'var(--rim)' }}
            strokeOpacity="0.4"
          />
        </g>
      ))}
    </g>
  )
}

const desertRand = seeded(31)
type CrystalSpec = { x: number; y: number; s: number }
const CRYSTALS: CrystalSpec[] = [
  { x: 1250, y: 650, s: 1.35 },
  { x: 560, y: 680, s: 0.8 },
  { x: 1050, y: 700, s: 0.55 },
  { x: 330, y: 712, s: 1 },
]
const SHARDS = CRYSTALS.map((c) =>
  Array.from({ length: 5 }, (_, i) => {
    const h = (60 + desertRand() * 110) * c.s * (i === 2 ? 1.5 : 1)
    const w = (12 + desertRand() * 12) * c.s
    const ox = (i - 2) * 16 * c.s + desertRand() * 6
    const tilt = (i - 2) * 9 * c.s
    return { h: round(h), w: round(w), ox: round(ox), tilt: round(tilt) }
  }),
)
const SAND = Array.from({ length: 18 }, () => ({
  x: round(desertRand() * 1600),
  y: round(640 + desertRand() * 200),
  d: round(desertRand() * 6),
}))

function Crystal({ spec, shards, index, onChime }: { spec: CrystalSpec; shards: (typeof SHARDS)[number]; index: number; onChime: () => void }) {
  const { count, active, trigger } = useReaction(1600)
  return (
    <Interactive
      label="A crystal spire. Touch to make it chime."
      onActivate={() => {
        trigger()
        onChime()
      }}
    >
      <ellipse
        cx={spec.x}
        cy={spec.y - 40 * spec.s}
        rx={70 * spec.s}
        ry={90 * spec.s}
        fill="#b9a6ff"
        opacity={active ? 0.35 : 0.12}
        filter="url(#soft-blur)"
        style={{ transition: 'opacity 0.6s' }}
      />
      {shards.map((sh, i) => {
        const bx = spec.x + sh.ox
        const tipX = bx + sh.tilt
        const tipY = spec.y - sh.h
        return (
          <g key={i}>
            <polygon
              points={`${bx - sh.w / 2},${spec.y} ${tipX},${tipY} ${bx + sh.w / 2},${spec.y}`}
              fill="url(#crystal-grad)"
              opacity="0.9"
            />
            <line x1={bx} y1={spec.y} x2={tipX} y2={tipY} stroke="#ffffff" strokeOpacity="0.35" strokeWidth="0.8" />
          </g>
        )
      })}
      <circle
        cx={spec.x + shards[2].ox + shards[2].tilt}
        cy={spec.y - shards[2].h}
        r="3"
        fill="#ffffff"
        className="anim-twinkle"
        style={{ animationDelay: `${-index * 1.1}s` }}
      />
      {count > 0 && (
        <circle
          key={count}
          cx={spec.x}
          cy={spec.y - 60 * spec.s}
          r={30 * spec.s}
          fill="none"
          stroke="#e4dcff"
          strokeWidth="1.5"
          className="react-ring fill-box"
        />
      )}
      <circle cx={spec.x} cy={spec.y - 50 * spec.s} r={60 * spec.s} fill="none" stroke="#fff" strokeOpacity="0.6" strokeDasharray="3 5" className="focus-ring" />
    </Interactive>
  )
}

function Desert({ onMurmur }: { onMurmur: (t: string) => void }) {
  return (
    <g>
      <defs>
        <linearGradient id="crystal-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4f0ff" />
          <stop offset="35%" stopColor="#b6a4ff" />
          <stop offset="100%" stopColor="#4a3aa8" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="dune-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="tint" style={{ stopColor: 'var(--far)' }} />
          <stop offset="100%" className="tint" style={{ stopColor: 'var(--near)' }} />
        </linearGradient>
      </defs>
      <path
        d="M0 610 C 300 570 500 620 800 595 S 1300 570 1600 610 V900 H0 Z"
        className="tint"
        style={{ fill: 'var(--mid)' }}
      />
      <path
        d="M0 610 C 300 570 500 620 800 595 S 1300 570 1600 610"
        fill="none"
        className="tint"
        style={{ stroke: 'var(--rim)' }}
        strokeOpacity="0.3"
      />
      <path d="M0 690 C 250 650 520 700 820 670 S 1300 650 1600 700 V900 H0 Z" fill="url(#dune-grad)" />
      <path
        d="M0 690 C 250 650 520 700 820 670 S 1300 650 1600 700"
        fill="none"
        className="tint"
        style={{ stroke: 'var(--rim)' }}
        strokeOpacity="0.35"
      />
      {[0, 1].map((i) => (
        <g key={i} opacity="0.4">
          {[0, 1, 2, 3, 4].map((j) => (
            <ellipse
              key={j}
              cx={620 + j * 34 + i * 16}
              cy={784 - j * 6 + i * 10}
              rx="7"
              ry="3"
              className="tint"
              style={{ fill: 'var(--rim)' }}
              opacity="0.35"
            />
          ))}
        </g>
      ))}
      {CRYSTALS.map((c, i) => (
        <Crystal
          key={i}
          spec={c}
          shards={SHARDS[i]}
          index={i}
          onChime={() => onMurmur('The crystal chimes a note the color of violet.')}
        />
      ))}
      <path d="M0 768 C 300 740 600 778 900 755 S 1400 745 1600 778 V900 H0 Z" fill="#05040e" opacity="0.75" />
      {SAND.map((s, i) => (
        <circle
          key={i}
          cx={s.x}
          cy={s.y}
          r="1.2"
          fill="#ffe8d0"
          className="anim-twinkle"
          style={{ animationDelay: `${-s.d}s` }}
        />
      ))}
    </g>
  )
}

export function LandBase({ land, onMurmur }: { land: LandId; onMurmur: (t: string) => void }) {
  if (land === 'islands') return <Islands />
  if (land === 'desert') return <Desert onMurmur={onMurmur} />
  return <Forest />
}
