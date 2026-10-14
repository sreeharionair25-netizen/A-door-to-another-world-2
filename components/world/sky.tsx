import { round, seeded } from '@/lib/random'
import { SKY_PALETTE, type SkyId } from '@/lib/world'

const GRADIENTS: Record<SkyId, string[]> = {
  midnight: ['#02030c', '#071030', '#122058', '#26367a'],
  dusk: ['#0d0820', '#2b1450', '#6e2c70', '#d0687c'],
  aurora: ['#020812', '#06182c', '#0b2a40', '#123e4c'],
  dawn: ['#151a44', '#463d86', '#a877aa', '#f6c2a8'],
}

const rand = seeded(42)
const STARS = Array.from({ length: 150 }, () => ({
  x: round(rand() * 1600),
  y: round(rand() * 520),
  r: round(0.4 + rand() * 1.4),
  d: round(rand() * 7),
  dur: round(3 + rand() * 4),
}))

export function SkyLayer({ sky }: { sky: SkyId }) {
  const palette = SKY_PALETTE[sky]
  return (
    <g aria-hidden="true">
      <defs>
        {(Object.keys(GRADIENTS) as SkyId[]).map((id) => (
          <linearGradient key={id} id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
            {GRADIENTS[id].map((c, i) => (
              <stop key={i} offset={`${(i / (GRADIENTS[id].length - 1)) * 72}%`} stopColor={c} />
            ))}
          </linearGradient>
        ))}
        <radialGradient id="horizon-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="aurora-a" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6affc8" stopOpacity="0" />
          <stop offset="55%" stopColor="#6affc8" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#9a7cff" stopOpacity="0" />
        </linearGradient>
        <filter id="soft-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <filter id="glow-sm" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {(Object.keys(GRADIENTS) as SkyId[]).map((id) => (
        <rect
          key={id}
          width="1600"
          height="900"
          fill={`url(#sky-${id})`}
          style={{ opacity: sky === id ? 1 : 0, transition: 'opacity 1.8s ease' }}
        />
      ))}

      <g style={{ opacity: palette.stars, transition: 'opacity 1.8s ease' }}>
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="#f1edff"
            className="anim-twinkle"
            style={{ animationDelay: `${-s.d}s`, animationDuration: `${s.dur}s` }}
          />
        ))}
      </g>

      <g style={{ opacity: sky === 'midnight' ? 1 : 0, transition: 'opacity 1.8s ease' }}>
        <circle cx="1300" cy="150" r="70" fill="#c9d4ff" opacity="0.06" />
        <ellipse
          cx="1300"
          cy="150"
          rx="130"
          ry="18"
          fill="none"
          stroke="#c9d4ff"
          strokeOpacity="0.14"
          transform="rotate(-18 1300 150)"
        />
      </g>

      <g
        style={{ opacity: sky === 'aurora' ? 1 : 0, transition: 'opacity 2.2s ease' }}
        filter="url(#soft-blur)"
      >
        <path
          className="anim-drift"
          d="M-100 260 C 200 120 420 300 700 170 S 1150 80 1400 210 S 1700 160 1800 190 L1800 360 C 1500 300 1200 360 900 300 S 300 400 -100 380 Z"
          fill="url(#aurora-a)"
        />
        <path
          className="anim-drift-slow"
          d="M-100 180 C 300 60 600 220 900 110 S 1400 40 1800 130 L1800 230 C 1400 180 1100 270 800 210 S 200 300 -100 260 Z"
          fill="url(#aurora-a)"
          opacity="0.6"
        />
      </g>

      <ellipse
        cx="800"
        cy="600"
        rx="900"
        ry="200"
        fill="url(#horizon-glow)"
        className="tint"
        style={{
          opacity: sky === 'dusk' || sky === 'dawn' ? 0.35 : 0.12,
          mixBlendMode: 'soft-light',
        }}
      />
      <ellipse
        cx="800"
        cy="590"
        rx="760"
        ry="120"
        className="tint"
        style={{ fill: 'var(--glow)', opacity: sky === 'dusk' || sky === 'dawn' ? 0.28 : 0.12 }}
        filter="url(#soft-blur)"
      />
    </g>
  )
}
