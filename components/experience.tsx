'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useCommons, type GiftKind } from '@/lib/commons'
import { LAND_STORIES, MOUNTAIN_STORY, type Story } from '@/lib/stories'
import { DEFAULT_WORLD, LANDS, LIFE, SKIES, WONDERS, worldToQuery, type World } from '@/lib/world'
import { Builder } from './hud/builder'
import { Finale } from './hud/finale'
import { GiftPanel } from './hud/gift-panel'
import { Murmur, type MurmurState } from './hud/murmur'
import { StoryCard } from './hud/story-card'
import { TopBar } from './hud/top-bar'
import { Threshold } from './threshold'
import { WorldScene } from './world/scene'

type Phase = 'threshold' | 'opening' | 'world'

const CHANGE_LINES = {
  sky: (id: string) => `The sky turns to ${SKIES.find((s) => s.id === id)?.phrase}.`,
  land: (id: string) => `The ground rearranges itself into ${LANDS.find((l) => l.id === id)?.phrase}.`,
  wonder: (id: string) => `${WONDERS.find((w) => w.id === id)?.phrase.replace(/^a/, 'A')} arrives, quietly.`,
}

const GIFT_LINES: Record<GiftKind, string> = {
  star: 'Your star rises and finds its place in the shared sky.',
  creature: 'Your wisp slips upward to drift between worlds.',
  note: 'Your note folds itself into light and joins the others.',
}

export function Experience({ initialWorld }: { initialWorld: World | null }) {
  const [phase, setPhase] = useState<Phase>('threshold')
  const [world, setWorld] = useState<World>(initialWorld ?? DEFAULT_WORLD)
  const [found, setFound] = useState<Set<string>>(() => new Set())
  const [story, setStory] = useState<Story | null>(null)
  const [murmur, setMurmur] = useState<MurmurState>(null)
  const [overlay, setOverlay] = useState<'none' | 'gift' | 'finale'>('none')
  const [touched, setTouched] = useState(false)
  const gifts = useCommons()
  const murmurId = useRef(0)

  const say = useCallback((text: string) => {
    murmurId.current += 1
    setMurmur({ id: murmurId.current, text })
  }, [])

  useEffect(() => {
    if (!murmur) return
    const t = window.setTimeout(() => setMurmur((m) => (m?.id === murmur.id ? null : m)), 5200)
    return () => window.clearTimeout(t)
  }, [murmur])

  useEffect(() => {
    if (phase !== 'world') return
    const t = window.setTimeout(() => {
      const query = worldToQuery(world)
      window.history.replaceState(null, '', `${window.location.pathname}?${query}`)
    }, 400)
    return () => window.clearTimeout(t)
  }, [world, phase])

  const enter = () => {
    setPhase('opening')
    window.setTimeout(() => {
      setPhase('world')
      say(initialWorld ? 'Someone shaped this place, and left the door open for you.' : 'The air is new here. Touch anything that glows.')
    }, 2100)
  }

  const change = (patch: Partial<World>) => {
    setWorld((w) => ({ ...w, ...patch }))
    if (patch.sky) say(CHANGE_LINES.sky(patch.sky))
    else if (patch.land) {
      say(CHANGE_LINES.land(patch.land))
      setStory(null)
    } else if (patch.wonder) say(CHANGE_LINES.wonder(patch.wonder))
    else if (patch.life) {
      const added = patch.life.find((id) => !world.life.includes(id))
      if (added) say(`${LIFE.find((l) => l.id === added)?.label} wander in to look around.`)
      else if (patch.life.length === 0) say('It is very quiet now. The world is listening for someone.')
    }
  }

  const openStory = (s: Story) => {
    setStory(s)
    setMurmur(null)
    setFound((prev) => (prev.has(s.id) ? prev : new Set(prev).add(s.id)))
  }

  const closeStory = useCallback(() => setStory(null), [])
  const closeOverlay = useCallback(() => setOverlay('none'), [])

  const totalStories = LAND_STORIES[world.land].length + 1
  const foundHere = [MOUNTAIN_STORY, ...LAND_STORIES[world.land]].filter((s) => found.has(s.id)).length
  const inWorld = phase === 'world'

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-[#04040f]">
      <h1 className="sr-only">A Door to Another World</h1>

      {phase !== 'threshold' && (
        <div
          className={cn(
            'absolute inset-0 transition-[filter,transform] duration-[1600ms] ease-out',
            overlay === 'finale' && 'scale-[1.04] blur-[2px] brightness-75',
          )}
          aria-hidden={overlay !== 'none' || undefined}
        >
          <WorldScene
            world={world}
            gifts={gifts}
            found={found}
            onStory={openStory}
            onMurmur={say}
            onInteract={() => setTouched(true)}
          />
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(2,2,10,0.75)_100%)]"
        aria-hidden="true"
      />

      {inWorld && overlay !== 'finale' && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between">
          <div>
            <TopBar
              name={world.name}
              onName={(name) => setWorld((w) => ({ ...w, name }))}
              storiesFound={foundHere}
              storiesTotal={totalStories}
              onGift={() => setOverlay('gift')}
              onFinish={() => {
                setStory(null)
                setOverlay('finale')
              }}
            />
            <div className="mt-4 md:mt-2">
              <Murmur murmur={story ? null : murmur} />
            </div>
          </div>

          <div className="flex flex-col gap-3 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6 md:pb-6">
            {story && <StoryCard story={story} onClose={closeStory} />}
            {!touched && !story && (
              <p className="fade-in text-center text-xs tracking-wide text-[#cfc6ff]/70" style={{ animationDelay: '2.5s' }}>
                Pulsing lights hold stories. Creatures like to be noticed.
              </p>
            )}
            <Builder world={world} onChange={change} />
          </div>
        </div>
      )}

      {inWorld && overlay === 'finale' && (
        <Finale world={world} storiesFound={found.size} onReturn={closeOverlay} onGift={() => setOverlay('gift')} />
      )}

      {inWorld && overlay === 'gift' && (
        <GiftPanel
          worldName={world.name}
          onClose={closeOverlay}
          onLeft={(kind) => {
            setOverlay('none')
            say(GIFT_LINES[kind])
          }}
        />
      )}

      {phase !== 'world' && (
        <Threshold opening={phase === 'opening'} invitedName={initialWorld?.name.trim() || null} onEnter={enter} />
      )}

      <div className="pointer-events-none absolute inset-[-50%] z-50 opacity-[0.07] mix-blend-overlay grain" aria-hidden="true" />
    </main>
  )
}
