'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import type { Story } from '@/lib/stories'

export function StoryCard({ story, onClose }: { story: Story; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [story, onClose])

  return (
    <aside
      key={story.id}
      role="dialog"
      aria-modal="false"
      aria-labelledby="story-place"
      className="glass fade-up pointer-events-auto relative mx-auto w-full max-w-md rounded-3xl px-6 pb-6 pt-5 md:px-8"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close story"
        className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-[#a9a3cf] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
      <p id="story-place" className="pr-8 text-[10px] font-medium uppercase tracking-[0.3em] text-[#f6d9a4]/80">
        {story.place}
      </p>
      <p className="mt-3 text-pretty font-serif text-xl leading-relaxed text-[#f4efff] md:text-2xl">{story.text}</p>
    </aside>
  )
}
