'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Feather, Star, Wind, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { leaveGift, type GiftKind } from '@/lib/commons'

const KINDS: { id: GiftKind; label: string; hint: string; icon: typeof Star }[] = [
  { id: 'star', label: 'A star', hint: 'It will hang in the shared sky.', icon: Star },
  { id: 'creature', label: 'A wisp', hint: 'A small creature that drifts between worlds.', icon: Wind },
  { id: 'note', label: 'A note', hint: 'A few words for whoever comes next.', icon: Feather },
]

const MAX_MESSAGE = 120

type Props = {
  worldName: string
  onClose: () => void
  onLeft: (kind: GiftKind) => void
}

export function GiftPanel({ worldName, onClose, onLeft }: Props) {
  const [kind, setKind] = useState<GiftKind>('star')
  const [message, setMessage] = useState('')
  const [from, setFrom] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending'>('idle')
  const panelRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus({ preventScroll: true })
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const defaultFrom = worldName.trim() ? `a traveler from ${worldName.trim()}` : 'a quiet traveler'
  const needsWords = kind === 'note' && !message.trim()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (needsWords || status === 'sending') return
    setStatus('sending')
    window.setTimeout(() => {
      leaveGift({ kind, message: message.trim().slice(0, MAX_MESSAGE), from: from.trim().slice(0, 40) || defaultFrom })
      onLeft(kind)
    }, 900)
  }

  const current = KINDS.find((k) => k.id === kind)!

  return (
    <div className="fade-in pointer-events-auto absolute inset-0 z-40 flex items-end justify-center bg-[#04040f]/50 p-4 md:items-center" onClick={onClose}>
      <form
        ref={panelRef}
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gift-title"
        className="glass fade-up relative w-full max-w-md rounded-3xl p-6 md:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full text-[#a9a3cf] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
        <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#f6d9a4]/80">The shared sky</p>
        <h2 id="gift-title" className="mt-2 text-balance font-serif text-3xl italic text-[#f4efff]">
          Leave something small behind
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#a9a3cf]">
          Every traveler who steps through this door can leave one thing. The next person will find it waiting.
        </p>

        <fieldset className="mt-6">
          <legend className="sr-only">What will you leave?</legend>
          <div className="grid grid-cols-3 gap-2">
            {KINDS.map(({ id, label, icon: Icon }, i) => (
              <label
                key={id}
                className={cn(
                  'flex cursor-pointer flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-sm transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring',
                  kind === id
                    ? 'border-[#f6d9a4]/50 bg-[#f6d9a4]/10 text-[#fff3dc]'
                    : 'border-white/10 text-[#cfc9f0] hover:border-white/25',
                )}
              >
                <input
                  type="radio"
                  name="gift-kind"
                  value={id}
                  checked={kind === id}
                  onChange={() => setKind(id)}
                  className="sr-only"
                  data-autofocus={i === 0 ? '' : undefined}
                />
                <Icon className="size-5" aria-hidden="true" />
                {label}
              </label>
            ))}
          </div>
          <p className="mt-2 text-center text-xs text-[#a9a3cf]/80">{current.hint}</p>
        </fieldset>

        <div className="mt-5">
          <label htmlFor="gift-message" className="text-xs text-[#cfc9f0]">
            {kind === 'note' ? 'Your words' : 'A whisper to go with it'}
            {kind !== 'note' && <span className="text-[#a9a3cf]/70"> (optional)</span>}
          </label>
          <textarea
            id="gift-message"
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, MAX_MESSAGE))}
            rows={2}
            placeholder={'For whoever needs it\u2026'}
            className="mt-1.5 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-serif text-lg italic text-[#f4efff] placeholder:text-[#a9a3cf]/50 focus:border-[#f6d9a4]/50 focus:outline-none"
          />
          <p className="text-right text-[11px] text-[#a9a3cf]/60">
            {message.length}/{MAX_MESSAGE}
          </p>
        </div>

        <div className="mt-1">
          <label htmlFor="gift-from" className="text-xs text-[#cfc9f0]">
            Signed
          </label>
          <input
            id="gift-from"
            value={from}
            maxLength={40}
            onChange={(e) => setFrom(e.target.value)}
            placeholder={defaultFrom}
            autoComplete="off"
            className="mt-1.5 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-[#f4efff] placeholder:text-[#a9a3cf]/50 focus:border-[#f6d9a4]/50 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={needsWords || status === 'sending'}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-[#f6d9a4]/40 bg-[#f6d9a4]/15 px-6 py-3.5 font-serif text-lg text-[#fff3dc] transition-all hover:bg-[#f6d9a4]/25 hover:shadow-[0_0_30px_4px_rgba(246,217,164,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
        >
          {status === 'sending' ? (
            <>
              <span className="size-2 animate-ping rounded-full bg-[#fff3dc]" aria-hidden="true" />
              Sending it upward
            </>
          ) : needsWords ? (
            'A note needs a few words'
          ) : (
            `Release ${current.label.toLowerCase()}`
          )}
        </button>
        <p className="mt-3 text-center text-[11px] leading-relaxed text-[#a9a3cf]/60">
          A preview of the shared world: gifts are kept on this device for now.
        </p>
      </form>
    </div>
  )
}
