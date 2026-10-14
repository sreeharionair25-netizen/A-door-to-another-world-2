'use client'

export type MurmurState = { id: number; text: string } | null

export function Murmur({ murmur }: { murmur: MurmurState }) {
  return (
    <div className="pointer-events-none flex min-h-14 justify-center px-6" aria-live="polite" aria-atomic="true">
      {murmur && (
        <p
          key={murmur.id}
          className="murmur text-glow max-w-lg text-balance text-center font-serif text-lg italic leading-snug text-[#f4efff]/90 md:text-xl"
        >
          {murmur.text}
        </p>
      )}
    </div>
  )
}
