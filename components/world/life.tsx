'use client'

import { round, seeded } from '@/lib/random'
import { bobClass, type Spot } from './layout'
import { Interactive, useReaction } from './interactive'

type ReactProps = { onReact: () => void }

const MOTHS = [
  { rx: 70, ry: 34, dur: 9, begin: 0 },
  { rx: 110, ry: 46, dur: 12, begin: -3 },
  { rx: 54, ry: 60, dur: 8, begin: -5 },
  { rx: 140, ry: 30, dur: 15, begin: -7 },
  { rx: 90, ry: 70, dur: 11, begin: -2 },
  { rx: 40, ry: 26, dur: 7, begin: -4 },
]

function Moth() {
  return (
    <g>
      <circle r="9" fill="#ffe6a8" opacity="0.35" filter="url(#glow-sm)" />
      <g className="anim-flap fill-box">
        <ellipse cx="-4.5" cy="0" rx="5" ry="3.6" fill="#fff4cf" opacity="0.9" />
        <ellipse cx="4.5" cy="0" rx="5" ry="3.6" fill="#fff4cf" opacity="0.9" />
      </g>
      <circle r="1.4" fill="#ffffff" />
    </g>
  )
}

export function Moths({ home, onReact }: { home: Spot } & ReactProps) {
  const { count, trigger } = useReaction(1600)
  return (
    <g style={{ transform: `translate(${home.x}px, ${home.y}px)`, transition: 'transform 3.5s cubic-bezier(0.4, 0, 0.2, 1)' }}>
      <Interactive
        label="Glowmoths. Touch to startle them."
        onActivate={() => {
          trigger()
          onReact()
        }}
      >
        <circle r="150" fill="transparent" />
        <g key={count} className={count > 0 ? 'react-startle fill-box' : undefined}>
          {MOTHS.map((m, i) => (
            <g key={i}>
              <animateMotion
                dur={`${m.dur}s`}
                begin={`${m.begin}s`}
                repeatCount="indefinite"
                path={`M${-m.rx} 0 a ${m.rx} ${m.ry} 0 1 0 ${m.rx * 2} 0 a ${m.rx} ${m.ry} 0 1 0 ${-m.rx * 2} 0`}
              />
              <Moth />
            </g>
          ))}
        </g>
      </Interactive>
    </g>
  )
}

const WHALE_BODY =
  'M120 5 C 120 -30 60 -48 0 -45 C -60 -42 -100 -25 -140 -5 L -186 -34 C -178 -12 -178 8 -188 28 L -140 7 C -100 30 -40 40 20 38 C 80 36 120 30 120 5 Z'
const WHALE_SPOTS = [-90, -60, -30, 0, 30, 60]

export function Whale({ onReact }: ReactProps) {
  const { count, trigger } = useReaction(2000)
  return (
    <g transform="translate(800 200)">
      <g className="anim-whale-swim">
        <g className="anim-bob-b">
          <g className="anim-whale-flip" style={{ transformOrigin: '0px 0px' }}>
            <Interactive
              label="A sky whale. Touch to hear it sing."
              onActivate={() => {
                trigger()
                onReact()
              }}
            >
              <defs>
                <linearGradient id="whale-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#cfe2ff" stopOpacity="0.38" />
                  <stop offset="100%" stopColor="#7d96ff" stopOpacity="0.08" />
                </linearGradient>
              </defs>
              <path d={WHALE_BODY} fill="url(#whale-grad)" className="tint" style={{ stroke: 'var(--rim)' }} strokeOpacity="0.55" strokeWidth="1.2" />
              <path d="M20 30 C 10 55 -15 70 -30 72 C -15 55 -5 40 0 34 Z" fill="#cfe2ff" opacity="0.18" />
              {[0, 1, 2].map((i) => (
                <path key={i} d={`M${60 - i * 30} ${26 + i * 2} Q ${20 - i * 30} ${34 + i * 2} ${-20 - i * 30} ${30 + i}`} fill="none" stroke="#e4eeff" strokeOpacity="0.2" />
              ))}
              {WHALE_SPOTS.map((x, i) => (
                <circle key={x} cx={x} cy={-38 + Math.abs(x) * 0.06} r="1.8" fill="#eaf2ff" className="anim-twinkle" style={{ animationDelay: `${-i * 0.7}s` }} />
              ))}
              <circle cx="88" cy="2" r="2.4" fill="#ffffff" />
              {count > 0 &&
                [0, 1, 2].map((i) => (
                  <circle
                    key={`${count}-${i}`}
                    cx="110"
                    cy="0"
                    r="40"
                    fill="none"
                    stroke="#d8e6ff"
                    strokeWidth="1.4"
                    className="react-ring fill-box"
                    style={{ animationDelay: `${i * 0.35}s`, opacity: 0 }}
                  />
                ))}
              <ellipse cx="-20" cy="0" rx="190" ry="70" fill="none" stroke="#fff" strokeOpacity="0.5" strokeDasharray="3 5" className="focus-ring" />
            </Interactive>
          </g>
        </g>
      </g>
    </g>
  )
}

export function Fox({ spot, onReact }: { spot: Spot } & ReactProps) {
  const { count, active, trigger } = useReaction(1000)
  return (
    <g className={bobClass(spot.bob)}>
      <g transform={`translate(${spot.x} ${spot.y}) scale(1.35)`}>
        <Interactive
          label="A star fox. Touch to say hello."
          onActivate={() => {
            trigger()
            onReact()
          }}
        >
          <circle cy="-20" r="34" fill="transparent" />
          <ellipse cy="1" rx="18" ry="3" fill="#000" opacity="0.35" />
          <g key={count} className={count > 0 ? 'react-hop fill-base' : undefined}>
            <path
              d="M10 -3 C 30 -2 38 -20 28 -32 C 27 -20 20 -12 8 -9 Z"
              className="tint fill-base anim-sway-strong"
              style={{ fill: 'var(--near)', stroke: 'var(--rim)' }}
              strokeOpacity="0.7"
            />
            <path
              d="M-12 0 C -15 -14 -11 -26 -6 -30 L -8 -43 L -1 -35 L 4 -35 L 9 -43 L 7 -30 C 12 -26 14 -14 12 0 Z"
              className="tint"
              style={{ fill: 'var(--near)', stroke: 'var(--rim)' }}
              strokeOpacity="0.75"
            />
            <circle cx="-3.5" cy="-27" r="1.4" fill="#ffe3b0" />
            <circle cx="3.5" cy="-27" r="1.4" fill="#ffe3b0" />
            <g transform="translate(28 -32)">
              <circle r={active ? 9 : 6} fill="#ffcf8a" opacity="0.4" filter="url(#glow-sm)" style={{ transition: 'r 0.4s' }} />
              <path d="M0 -4 L1 -1 L4 0 L1 1 L0 4 L-1 1 L-4 0 L-1 -1 Z" fill="#fff4dc" className="anim-twinkle" />
            </g>
          </g>
          {count > 0 &&
            [-14, 0, 14].map((dx, i) => (
              <path
                key={`${count}-${i}`}
                d="M0 -3 L0.8 -0.8 L3 0 L0.8 0.8 L0 3 L-0.8 0.8 L-3 0 L-0.8 -0.8 Z"
                transform={`translate(${28 + dx * 0.4} -34)`}
                fill="#fff1d0"
                className="react-spore"
                style={{ '--dx': `${dx}px`, animationDelay: `${i * 0.12}s` } as React.CSSProperties}
              />
            ))}
          <circle cy="-20" r="32" fill="none" stroke="#fff" strokeOpacity="0.5" strokeDasharray="3 4" className="focus-ring" />
        </Interactive>
      </g>
    </g>
  )
}

const capRand = seeded(5)
const CAPS = Array.from({ length: 4 }, (_, i) => ({
  x: round((i - 1.5) * 13 + capRand() * 6),
  h: round(10 + capRand() * 16),
  w: round(8 + capRand() * 8),
}))

export function Glowcaps({ spots, onReact }: { spots: Spot[] } & ReactProps) {
  return (
    <>
      {spots.map((spot, i) => (
        <GlowcapCluster key={i} spot={spot} index={i} onReact={onReact} />
      ))}
    </>
  )
}

function GlowcapCluster({ spot, index, onReact }: { spot: Spot; index: number } & ReactProps) {
  const { count, active, trigger } = useReaction(1400)
  return (
    <g className={bobClass(spot.bob)}>
      <g transform={`translate(${spot.x} ${spot.y})`}>
        <Interactive
          label="Glowcaps. Touch to make them glow."
          onActivate={() => {
            trigger()
            onReact()
          }}
        >
          <ellipse cy="-8" rx="40" ry="24" fill="#5ff0ff" opacity={active ? 0.45 : 0.18} filter="url(#glow-sm)" style={{ transition: 'opacity 0.5s' }} />
          {CAPS.map((c, j) => (
            <g key={j}>
              <rect x={c.x - 1.4} y={-c.h} width="2.8" height={c.h} fill="#c8f4ff" opacity="0.55" />
              <path
                d={`M${c.x - c.w / 2} ${-c.h} Q ${c.x} ${-c.h - c.w * 0.9} ${c.x + c.w / 2} ${-c.h} Z`}
                fill="#8af6ff"
                className="anim-pulse"
                style={{ animationDelay: `${-(index * 1.2 + j * 0.5)}s` }}
              />
            </g>
          ))}
          {count > 0 &&
            [-18, -8, 2, 12, 20].map((dx, j) => (
              <circle
                key={`${count}-${j}`}
                cx={dx * 0.6}
                cy="-20"
                r="1.6"
                fill="#bffaff"
                className="react-spore"
                style={{ '--dx': `${dx}px`, animationDelay: `${j * 0.1}s` } as React.CSSProperties}
              />
            ))}
          <ellipse cy="-12" rx="34" ry="22" fill="none" stroke="#fff" strokeOpacity="0.5" strokeDasharray="3 4" className="focus-ring" />
        </Interactive>
      </g>
    </g>
  )
}

export function Bellflowers({ spots, onReact }: { spots: Spot[] } & ReactProps) {
  return (
    <>
      {spots.map((spot, i) => (
        <Bellflower key={i} spot={spot} index={i} onReact={onReact} />
      ))}
    </>
  )
}

const BELLS = [
  { x: 22, y: -74 },
  { x: 32, y: -58 },
  { x: 12, y: -62 },
]

function Bellflower({ spot, index, onReact }: { spot: Spot; index: number } & ReactProps) {
  const { count, trigger } = useReaction(1400)
  return (
    <g className={bobClass(spot.bob)}>
      <g transform={`translate(${spot.x} ${spot.y})`}>
        <Interactive
          label="Bellflowers. Touch to ring them."
          onActivate={() => {
            trigger()
            onReact()
          }}
        >
          <rect x="-10" y="-90" width="56" height="92" fill="transparent" />
          <g className="fill-base anim-sway-strong" style={{ animationDelay: `${-index * 1.7}s` }}>
            <path d="M0 0 C 2 -40 6 -80 26 -86" fill="none" stroke="#9fb0e8" strokeOpacity="0.6" strokeWidth="1.6" />
            <path d="M3 -40 C 14 -52 24 -54 32 -62" fill="none" stroke="#9fb0e8" strokeOpacity="0.5" strokeWidth="1.2" />
            <path d="M2 -50 C 6 -56 10 -60 12 -66" fill="none" stroke="#9fb0e8" strokeOpacity="0.5" strokeWidth="1" />
            {BELLS.map((b, j) => (
              <g key={`${count}-${j}`} transform={`translate(${b.x} ${b.y})`}>
                <g className={count > 0 ? 'react-swing' : undefined} style={{ transformOrigin: '0px 0px', animationDelay: `${j * 0.08}s` }}>
                  <circle cy="7" r="9" fill="#b8c6ff" opacity="0.25" filter="url(#glow-sm)" />
                  <path d="M-5 2 C -5 -6 5 -6 5 2 L 7 10 Q 0 8 -7 10 Z" fill="#c4d0ff" className="anim-pulse" style={{ animationDelay: `${-j}s` }} />
                </g>
              </g>
            ))}
          </g>
          {count > 0 && (
            <circle key={count} cx="22" cy="-66" r="18" fill="none" stroke="#c4d0ff" strokeWidth="1.2" className="react-ring fill-box" />
          )}
          <rect x="-12" y="-94" width="60" height="98" rx="12" fill="none" stroke="#fff" strokeOpacity="0.5" strokeDasharray="3 4" className="focus-ring" />
        </Interactive>
      </g>
    </g>
  )
}

const reedRand = seeded(19)
const REEDS = Array.from({ length: 6 }, (_, i) => ({
  x: round((i - 2.5) * 7 + reedRand() * 4),
  h: round(60 + reedRand() * 60),
  bend: round(reedRand() * 16 - 8),
}))

export function Reeds({ spots, onReact }: { spots: Spot[] } & ReactProps) {
  return (
    <>
      {spots.map((spot, i) => (
        <ReedCluster key={i} spot={spot} index={i} onReact={onReact} />
      ))}
    </>
  )
}

function ReedCluster({ spot, index, onReact }: { spot: Spot; index: number } & ReactProps) {
  const { count, trigger } = useReaction(2400)
  return (
    <g className={bobClass(spot.bob)}>
      <g transform={`translate(${spot.x} ${spot.y})`}>
        <Interactive
          label="Lumen reeds. Touch to release their seeds."
          onActivate={() => {
            trigger()
            onReact()
          }}
        >
          <rect x="-28" y="-124" width="56" height="126" fill="transparent" />
          {REEDS.map((r, j) => (
            <g key={j} className="fill-base anim-sway-strong" style={{ animationDelay: `${-(index * 1.3 + j * 0.4)}s` }}>
              <path d={`M${r.x} 0 Q ${r.x + r.bend} ${-r.h / 2} ${r.x + r.bend * 0.6} ${-r.h}`} fill="none" stroke="#d9c58a" strokeOpacity="0.55" strokeWidth="1.3" />
              <circle cx={r.x + r.bend * 0.6} cy={-r.h} r="5" fill="#ffd36e" opacity="0.35" filter="url(#glow-sm)" />
              <ellipse cx={r.x + r.bend * 0.6} cy={-r.h} rx="1.8" ry="4" fill="#ffe7a8" className="anim-pulse" style={{ animationDelay: `${-j * 0.6}s` }} />
            </g>
          ))}
          {count > 0 &&
            REEDS.map((r, j) => (
              <circle
                key={`${count}-${j}`}
                cx={r.x + r.bend * 0.6}
                cy={-r.h}
                r="1.8"
                fill="#ffe7a8"
                className="react-spore"
                style={{ '--dx': `${(j - 2.5) * 10}px`, animationDelay: `${j * 0.15}s` } as React.CSSProperties}
              />
            ))}
          <rect x="-30" y="-126" width="60" height="130" rx="12" fill="none" stroke="#fff" strokeOpacity="0.5" strokeDasharray="3 4" className="focus-ring" />
        </Interactive>
      </g>
    </g>
  )
}
