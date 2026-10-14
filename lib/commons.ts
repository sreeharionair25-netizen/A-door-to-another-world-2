'use client'

import { useSyncExternalStore } from 'react'

export type GiftKind = 'star' | 'creature' | 'note'

export type Gift = {
  id: string
  kind: GiftKind
  message: string
  from: string
  mine?: boolean
}

const STORAGE_KEY = 'a-door-to-another-world:commons'
const CHANGE_EVENT = 'commons-change'

const SEED_GIFTS: Gift[] = [
  { id: 'seed-1', kind: 'star', message: 'For my sister, who is afraid of the dark. This one is yours.', from: 'Wren of Hollowmere' },
  { id: 'seed-2', kind: 'note', message: 'I came here on a bad day. It got better.', from: 'a traveler from Lull' },
  { id: 'seed-3', kind: 'creature', message: 'A small wisp. It likes being noticed.', from: 'Odo of the Glass Dunes' },
  { id: 'seed-4', kind: 'star', message: 'Make a wish on it. I already used mine.', from: 'Ines of Veyra' },
  { id: 'seed-5', kind: 'note', message: 'If you are reading this, you are exactly where you should be.', from: 'someone from Elsewhere' },
  { id: 'seed-6', kind: 'star', message: '', from: 'Kai of Nine Moons' },
  { id: 'seed-7', kind: 'creature', message: 'It follows the wind. Be gentle with it.', from: 'Mira of Saltlight' },
  { id: 'seed-8', kind: 'star', message: 'For everyone who stayed up too late wondering.', from: 'Theo of Driftwood' },
]

let cachedRaw: string | null = null
let cachedGifts: Gift[] = SEED_GIFTS

function readStored(): Gift[] {
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return cachedGifts
  }
  if (raw === cachedRaw) return cachedGifts
  cachedRaw = raw
  try {
    const parsed = raw ? (JSON.parse(raw) as Gift[]) : []
    cachedGifts = [...SEED_GIFTS, ...(Array.isArray(parsed) ? parsed : [])]
  } catch {
    cachedGifts = SEED_GIFTS
  }
  return cachedGifts
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener(CHANGE_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(CHANGE_EVENT, callback)
  }
}

export function useCommons() {
  return useSyncExternalStore(subscribe, readStored, () => SEED_GIFTS)
}

export function leaveGift(gift: Omit<Gift, 'id' | 'mine'>) {
  const entry: Gift = { ...gift, id: `gift-${Date.now().toString(36)}`, mine: true }
  const own = readStored().filter((g) => !g.id.startsWith('seed-'))
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...own, entry].slice(-40)))
  } catch {
    cachedGifts = [...cachedGifts, entry]
  }
  window.dispatchEvent(new Event(CHANGE_EVENT))
  return entry
}
