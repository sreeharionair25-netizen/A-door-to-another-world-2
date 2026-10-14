'use client'

import { Feather, Sparkles } from 'lucide-react'
import { MAX_NAME } from '@/lib/world'

type Props = {
  name: string
  onName: (name: string) => void
  storiesFound: number
  storiesTotal: number
  onGift: () => void
  onFinish: () => void
}

export function TopBar({ name, onName, storiesFound, storiesTotal, onGift, onFinish }: Props) {
  return (
    <header className="fade-in pointer-events-none flex items-start justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] md:px-8 md:pt-6" style={{ animationDelay: '0.4s' }}>
      <div className="pointer-events-auto min-w-0 flex-1">
        <label htmlFor="world-name" className="block text-[10px] font-medium uppercase tracking-[0.3em] text-[#a9a3cf]/80">
          {name.trim() ? 'This world is called' : 'Name your world'}
        </label>
        <input
          id="world-name"
          value={name}
          maxLength={MAX_NAME}
          onChange={(e) => onName(e.target.value)}
          placeholder="Somewhere unnamed"
          autoComplete="off"
          spellCheck={false}
          className="text-glow mt-0.5 w-full max-w-sm border-b border-transparent bg-transparent font-serif text-2xl italic text-[#f4efff] placeholder:text-[#f4efff]/35 transition-colors hover:border-white/15 focus:border-[#f6d9a4]/50 focus:outline-none md:text-3xl"
        />
        <p className="mt-1 text-xs text-[#a9a3cf]" aria-live="polite">
          {storiesFound === 0
            ? `${storiesTotal} stories are hidden here`
            : storiesFound === storiesTotal
              ? 'Every story here has been heard'
              : `${storiesFound} of ${storiesTotal} stories found`}
        </p>
      </div>
      <div className="pointer-events-auto flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onGift}
          className="glass flex items-center gap-2 rounded-full px-3.5 py-2.5 text-sm text-[#ece8ff] transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Feather className="size-4" aria-hidden="true" />
          <span className="hidden sm:inline">Leave a gift</span>
          <span className="sr-only sm:hidden">Leave a gift</span>
        </button>
        <button
          type="button"
          onClick={onFinish}
          className="flex items-center gap-2 rounded-full border border-[#f6d9a4]/40 bg-[#f6d9a4]/15 px-4 py-2.5 text-sm text-[#fff3dc] backdrop-blur-md transition-all hover:bg-[#f6d9a4]/25 hover:shadow-[0_0_30px_4px_rgba(246,217,164,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Sparkles className="size-4" aria-hidden="true" />
          <span>Finish</span>
        </button>
      </div>
    </header>
  )
}
