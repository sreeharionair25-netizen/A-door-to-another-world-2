'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Feather, Link2, Share2 } from 'lucide-react'
import { describeWorld, worldToQuery, type World } from '@/lib/world'

type Props = {
  world: World
  storiesFound: number
  onReturn: () => void
  onGift: () => void
}

export function Finale({ world, storiesFound, onReturn, onGift }: Props) {
  const [copied, setCopied] = useState<'idle' | 'copied' | 'failed'>('idle')
  const headingRef = useRef<HTMLHeadingElement>(null)
  const name = world.name.trim() || 'Somewhere Unnamed'

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onReturn()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onReturn])

  const link = () => `${window.location.origin}${window.location.pathname}?${worldToQuery(world)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link())
      setCopied('copied')
    } catch {
      setCopied('failed')
    }
    window.setTimeout(() => setCopied('idle'), 2600)
  }

  const share = async () => {
    if (!navigator.share) return copy()
    try {
      await navigator.share({ title: name, text: describeWorld(world), url: link() })
    } catch {
      // Dismissing the native share sheet rejects; nothing to recover.
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="finale-name"
      className="fade-in pointer-events-auto absolute inset-0 z-40 flex items-center justify-center overflow-y-auto bg-[radial-gradient(ellipse_at_center,rgba(6,6,24,0.35)_0%,rgba(4,4,15,0.85)_75%)] px-6 py-10"
    >
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <p className="fade-up text-[10px] font-medium uppercase tracking-[0.35em] text-[#f6d9a4]/80" style={{ animationDelay: '0.2s' }}>
          A world now exists that didn&apos;t before
        </p>
        <h2
          id="finale-name"
          ref={headingRef}
          tabIndex={-1}
          className="fade-up text-glow mt-4 text-balance font-serif text-5xl font-medium italic leading-tight text-[#fff8ec] focus:outline-none md:text-7xl"
          style={{ animationDelay: '0.5s' }}
        >
          {name}
        </h2>
        <p className="fade-up mt-5 max-w-md text-pretty font-serif text-xl leading-relaxed text-[#e6e0ff]/90" style={{ animationDelay: '0.9s' }}>
          {describeWorld(world)}
        </p>
        {storiesFound > 0 && (
          <p className="fade-up mt-3 text-sm text-[#a9a3cf]" style={{ animationDelay: '1.1s' }}>
            {`You listened to ${storiesFound} of its secrets.`}
          </p>
        )}

        <div className="fade-up mt-9 flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center" style={{ animationDelay: '1.4s' }}>
          <button
            type="button"
            onClick={share}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#f6d9a4]/40 bg-[#f6d9a4]/15 px-6 py-3.5 text-[#fff3dc] transition-all hover:bg-[#f6d9a4]/25 hover:shadow-[0_0_30px_4px_rgba(246,217,164,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
          >
            <Share2 className="size-4" aria-hidden="true" />
            Share this world
          </button>
          <button
            type="button"
            onClick={copy}
            className="glass flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[#ece8ff] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-auto"
          >
            {copied === 'copied' ? <Check className="size-4" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
            <span aria-live="polite">
              {copied === 'copied' ? 'Link copied' : copied === 'failed' ? 'Copy unavailable' : 'Copy link'}
            </span>
          </button>
        </div>

        <div className="fade-up glass mt-10 w-full max-w-md rounded-3xl p-5" style={{ animationDelay: '1.8s' }}>
          <p className="font-serif text-lg italic text-[#f4efff]">Before you go&hellip;</p>
          <p className="mt-1 text-sm leading-relaxed text-[#a9a3cf]">
            Leave a star, a wisp, or a note in the shared sky. Someone else will find it the next time this door opens.
          </p>
          <button
            type="button"
            onClick={onGift}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-[#ece8ff] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Feather className="size-4" aria-hidden="true" />
            Leave a gift
          </button>
        </div>

        <button
          type="button"
          onClick={onReturn}
          className="fade-up mt-8 rounded-full px-4 py-2 text-sm text-[#a9a3cf] underline-offset-4 transition-colors hover:text-[#ece8ff] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={{ animationDelay: '2.1s' }}
        >
          Return to your world
        </button>
      </div>
    </div>
  )
}
