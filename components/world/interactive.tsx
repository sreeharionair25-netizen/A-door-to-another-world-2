'use client'

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type InteractiveProps = {
  label: string
  onActivate: () => void
  className?: string
  children: ReactNode
}

export function Interactive({ label, onActivate, className, children }: InteractiveProps) {
  const handleKey = (e: KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onActivate()
    }
  }
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      className={cn('interactive', className)}
      onClick={(e) => {
        e.stopPropagation()
        onActivate()
      }}
      onKeyDown={handleKey}
    >
      {children}
    </g>
  )
}

export function useReaction(duration = 1600) {
  const [count, setCount] = useState(0)
  const [active, setActive] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  const trigger = useCallback(() => {
    setCount((c) => c + 1)
    setActive(true)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setActive(false), duration)
  }, [duration])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  return { count, active, trigger }
}
