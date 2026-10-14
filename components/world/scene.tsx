'use client'

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import type { Gift } from '@/lib/commons'
import {
  CLOUD_MURMURS,
  LAND_STORIES,
  LANTERN_MURMURS,
  LIFE_MURMURS,
  MOON_MURMURS,
  MOUNTAIN_STORY,
  type Story,
} from '@/lib/stories'
import { SKY_PALETTE, type LifeId, type World } from '@/lib/world'
import { CommonsLayer } from './commons-layer'
import { Hotspot } from './hotspots'
import { LandBase } from './lands'
import { LAYOUTS, MOUNTAIN_HOTSPOT } from './layout'
import { Bellflowers, Fox, Glowcaps, Moths, Reeds, Whale } from './life'
import { Mountains } from './mountains'
import { SkyLayer } from './sky'
import { Lantern, RainCloud, River, TinyMoon } from './wonders'

type Props = {
  world: World
  gifts: Gift[]
  found: Set<string>
  onStory: (story: Story) => void
  onMurmur: (text: string) => void
  onInteract: () => void
}

const depth = (d: number): CSSProperties => ({
  transform: `translate(calc(var(--px, 0) * ${d}px), calc(var(--py, 0) * ${d * 0.4}px))`,
  transition: 'transform 1.4s cubic-bezier(0.2, 0.7, 0.2, 1)',
})

export function WorldScene({ world, gifts, found, onStory, onMurmur, onInteract }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [gust, setGust] = useState(false)
  const [water, setWater] = useState(0)
  const [raining, setRaining] = useState(false)
  const [lantern, setLantern] = useState(1)
  const [moonPhase, setMoonPhase] = useState(0)
  const murmurIndex = useRef<Partial<Record<LifeId, number>>>({})
  const timers = useRef<number[]>([])

  useEffect(() => {
    const list = timers.current
    return () => list.forEach((t) => window.clearTimeout(t))
  }, [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const layout = LAYOUTS[world.land]
  const palette = SKY_PALETTE[world.sky]
  const has = (id: LifeId) => world.life.includes(id)

  const react = (id: LifeId) => () => {
    onInteract()
    const lines = LIFE_MURMURS[id]
    const i = murmurIndex.current[id] ?? 0
    murmurIndex.current[id] = i + 1
    onMurmur(lines[i % lines.length])
  }

  const sendGust = () => {
    onInteract()
    setGust(true)
    onMurmur('A gust spills over the ridge, and everything bends to listen.')
    later(() => setGust(false), 3400)
  }

  const toggleLantern = () => {
    onInteract()
    const next = (lantern + 1) % 3
    setLantern(next)
    onMurmur(LANTERN_MURMURS[next])
  }

  const turnMoon = () => {
    onInteract()
    const next = (moonPhase + 1) % MOON_MURMURS.length
    setMoonPhase(next)
    onMurmur(MOON_MURMURS[next])
  }

  const rain = () => {
    onInteract()
    if (raining) return
    setRaining(true)
    const next = Math.min(3, water + 1)
    onMurmur(CLOUD_MURMURS[next - 1])
    later(() => setWater(next), 900)
    later(() => setRaining(false), 4800)
  }

  const openStory = (story: Story) => {
    onInteract()
    onStory(story)
  }

  const handlePointer = (e: PointerEvent<HTMLDivElement>) => {
    const el = rootRef.current
    if (!el || e.pointerType !== 'mouse') return
    el.style.setProperty('--px', ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3))
    el.style.setProperty('--py', ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3))
  }

  const mothHome =
    world.wonder === 'lantern' && lantern > 0
      ? { x: layout.lantern.x + 16, y: layout.lantern.y - 70 - lantern * 20 }
      : layout.mothHome

  const vars = {
    '--far': palette.far,
    '--mid': palette.mid,
    '--near': palette.near,
    '--rim': palette.rim,
    '--mist': palette.mist,
    '--glow': palette.glow,
    '--amp': gust ? '5deg' : '1.3deg',
    '--wind-dur': gust ? '1.4s' : '6s',
    '--wind-flow': gust ? '2.6s' : '9s',
  } as CSSProperties

  const stories = LAND_STORIES[world.land]

  return (
    <div ref={rootRef} className="absolute inset-0" style={vars} onPointerMove={handlePointer}>
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full select-none"
        role="group"
        aria-label={`Your world: ${world.name || 'an unnamed world'}`}
      >
        <SkyLayer sky={world.sky} />

        <g style={depth(-4)}>
          <CommonsLayer gifts={gifts} onReveal={onMurmur} />
          {world.wonder === 'moon' && (
            <g className="materialize">
              <TinyMoon spot={layout.moon} phase={moonPhase} onToggle={turnMoon} />
            </g>
          )}
        </g>

        <g style={depth(-8)}>
          {has('whale') && (
            <g className="materialize">
              <Whale onReact={react('whale')} />
            </g>
          )}
          {world.wonder === 'cloud' && (
            <g className="materialize">
              <RainCloud spot={layout.cloud} raining={raining} onRain={rain} />
            </g>
          )}
        </g>

        <g style={depth(-12)}>
          <Mountains gust={gust} onGust={sendGust} />
          <Hotspot spot={MOUNTAIN_HOTSPOT} story={MOUNTAIN_STORY} found={found.has(MOUNTAIN_STORY.id)} onOpen={openStory} />
        </g>

        <g style={depth(-20)}>
        <g key={world.land} className="materialize">
          <LandBase land={world.land} onMurmur={onMurmur} />
          <River path={layout.river} water={water} bob={layout.riverBob} waterfall={world.land === 'islands'} />
          {has('reeds') && <Reeds spots={layout.reeds} onReact={react('reeds')} />}
          {has('bells') && <Bellflowers spots={layout.bells} onReact={react('bells')} />}
          {has('glowcaps') && <Glowcaps spots={layout.glowcaps} onReact={react('glowcaps')} />}
          {has('fox') && <Fox spot={layout.fox} onReact={react('fox')} />}
          {world.wonder === 'lantern' && <Lantern spot={layout.lantern} level={lantern} onToggle={toggleLantern} />}
          {stories.map((story, i) => (
            <Hotspot key={story.id} spot={layout.hotspots[i]} story={story} found={found.has(story.id)} onOpen={openStory} />
          ))}
          {has('moths') && <Moths home={mothHome} onReact={react('moths')} />}
        </g>
        </g>
      </svg>
    </div>
  )
}
