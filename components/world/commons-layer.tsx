'use client'

import type { Gift } from '@/lib/commons'
import { hashString } from '@/lib/random'
import { Interactive } from './interactive'

const KIND_LABEL = { star: 'A star', creature: 'A wisp', note: 'A note' } as const

function placement(id: string) {
  const h = hashString(id)
  return { x: 180 + (h % 1240), y: 60 + ((h >>> 11) % 230), delay: (h >>> 5) % 7 }
}

export function giftLine(gift: Gift) {
  const words = gift.message.trim() ? `\u201C${gift.message.trim()}\u201D` : 'It shines without saying anything.'
  return `${words} \u2014 left by ${gift.from}`
}

function StarGlyph({ size }: { size: number }) {
  const s = size
  const k = s * 0.22
  return <path d={`M0 ${-s} L${k} ${-k} L${s} 0 L${k} ${k} L0 ${s} L${-k} ${k} L${-s} 0 L${-k} ${-k} Z`} fill="#fff1c8" />
}

export function CommonsLayer({ gifts, onReveal }: { gifts: Gift[]; onReveal: (text: string) => void }) {
  return (
    <g>
      {gifts.map((gift) => {
        const p = placement(gift.id)
        return (
          <g key={gift.id} transform={`translate(${p.x} ${p.y})`}>
            <g className={gift.kind === 'creature' ? 'anim-drift' : undefined} style={{ animationDuration: '24s', animationDelay: `${-p.delay * 3}s` }}>
              <Interactive label={`${KIND_LABEL[gift.kind]} left by ${gift.from}`} onActivate={() => onReveal(giftLine(gift))}>
                <circle r="20" fill="transparent" />
                {gift.mine && (
                  <circle r="16" fill="none" stroke="#ffe6b8" strokeOpacity="0.6" className="anim-hotspot fill-box" />
                )}
                <circle r={gift.mine ? 14 : 9} fill={gift.kind === 'note' ? '#b9c8ff' : '#ffe2a8'} opacity="0.3" filter="url(#glow-sm)" />
                <g className="anim-twinkle" style={{ animationDelay: `${-p.delay}s`, animationDuration: '5s' }}>
                  {gift.kind === 'star' && <StarGlyph size={gift.mine ? 9 : 6} />}
                  {gift.kind === 'creature' && (
                    <g>
                      <path d="M-14 3 Q -6 -2 0 0" fill="none" stroke="#ffe8c0" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" />
                      <circle r="3.2" fill="#fff4dc" />
                    </g>
                  )}
                  {gift.kind === 'note' && <path d="M0 -6 L5 0 L0 6 L-5 0 Z" fill="#dfe6ff" />}
                </g>
                <circle r="14" fill="none" stroke="#fff" strokeOpacity="0.6" strokeDasharray="3 3" className="focus-ring" />
              </Interactive>
            </g>
          </g>
        )
      })}
    </g>
  )
}
