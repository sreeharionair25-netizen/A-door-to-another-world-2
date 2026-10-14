'use client'

import type { Story } from '@/lib/stories'
import { bobClass, type Spot } from './layout'
import { Interactive } from './interactive'

type Props = {
  spot: Spot
  story: Story
  found: boolean
  onOpen: (story: Story) => void
}

export function Hotspot({ spot, story, found, onOpen }: Props) {
  return (
    <g className={bobClass(spot.bob)}>
      <g transform={`translate(${spot.x} ${spot.y})`}>
        <Interactive label={`Hidden story: ${story.place}`} onActivate={() => onOpen(story)}>
          <circle r="26" fill="transparent" />
          {!found && (
            <circle r="9" fill="none" stroke="#fff3d6" strokeWidth="1.2" className="anim-hotspot fill-box" />
          )}
          <circle r={found ? 2.4 : 3.6} fill={found ? '#cfc6ff' : '#fff6e2'} opacity={found ? 0.6 : 1} />
          <circle r="10" fill="#ffe6b8" opacity={found ? 0.1 : 0.3} filter="url(#glow-sm)" />
          <circle r="16" fill="none" stroke="#fff" strokeOpacity="0.7" strokeDasharray="3 3" className="focus-ring" />
        </Interactive>
      </g>
    </g>
  )
}
