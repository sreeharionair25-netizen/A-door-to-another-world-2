'use client'

import { Interactive } from './interactive'

const RIDGE =
  'M0 520 L110 478 L200 500 L320 430 L420 476 L520 392 L620 452 L700 438 L790 470 L900 400 L1010 458 L1120 392 L1240 462 L1340 432 L1460 484 L1600 444 L1600 720 L0 720 Z'
const NEAR_RIDGE =
  'M0 560 C 120 540 200 520 300 530 S 480 490 600 520 S 780 500 900 520 S 1100 490 1250 525 S 1480 510 1600 535 L1600 720 L0 720 Z'
const WIND =
  'M-80 430 C 120 420 250 380 330 384 S 470 340 540 352 S 660 412 730 404 S 850 360 920 366 S 1040 420 1130 362 S 1300 414 1400 418 S 1560 396 1700 396'

const STREAKS = [
  { dy: 0, delay: 0, opacity: 0.35 },
  { dy: -36, delay: -3, opacity: 0.25 },
  { dy: -78, delay: -6, opacity: 0.2 },
  { dy: -120, delay: -1.5, opacity: 0.14 },
  { dy: -170, delay: -4.5, opacity: 0.1 },
]

type Props = {
  gust: boolean
  onGust: () => void
}

export function Mountains({ gust, onGust }: Props) {
  return (
    <g>
      <defs>
        <linearGradient id="mountain-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0" />
          <stop offset="100%" className="tint" style={{ stopColor: 'var(--mist)' }} stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <Interactive label="The mountains. Touch to send a gust of wind." onActivate={onGust}>
        <path d={RIDGE} className="tint" style={{ fill: 'var(--far)' }} />
        <path
          d={RIDGE}
          fill="none"
          className="tint"
          style={{ stroke: 'var(--rim)' }}
          strokeOpacity="0.28"
          strokeWidth="1.2"
        />
        <path d={NEAR_RIDGE} className="tint" style={{ fill: 'var(--mid)' }} opacity="0.85" />
        <rect y="400" width="1600" height="320" fill="url(#mountain-haze)" pointerEvents="none" />
      </Interactive>

      <g
        aria-hidden="true"
        pointerEvents="none"
        style={{ opacity: gust ? 1 : 0.7, transition: 'opacity 0.8s ease' }}
      >
        {STREAKS.map((s, i) => (
          <path
            key={i}
            d={WIND}
            transform={`translate(0 ${s.dy})`}
            fill="none"
            stroke="#ffffff"
            strokeOpacity={gust ? s.opacity * 1.8 : s.opacity}
            strokeWidth={gust ? 1.6 : 1}
            strokeLinecap="round"
            className="anim-wind"
            style={{ animationDelay: `${s.delay}s` }}
          />
        ))}
      </g>
    </g>
  )
}
