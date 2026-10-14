export type SkyId = 'midnight' | 'dusk' | 'aurora' | 'dawn'
export type LandId = 'forest' | 'islands' | 'desert'
export type LifeId = 'moths' | 'whale' | 'fox' | 'glowcaps' | 'bells' | 'reeds'
export type WonderId = 'lantern' | 'moon' | 'cloud'

export type World = {
  sky: SkyId
  land: LandId
  life: LifeId[]
  wonder: WonderId
  name: string
}

export const MAX_LIFE = 3
export const MAX_NAME = 32

export const DEFAULT_WORLD: World = {
  sky: 'midnight',
  land: 'forest',
  life: ['moths', 'glowcaps'],
  wonder: 'lantern',
  name: '',
}

type Option<T extends string> = {
  id: T
  label: string
  phrase: string
  swatch: [string, string]
}

export const SKIES: Option<SkyId>[] = [
  { id: 'midnight', label: 'Midnight', phrase: 'a deep midnight', swatch: ['#050818', '#3a4f9a'] },
  { id: 'dusk', label: 'Violet Dusk', phrase: 'a violet dusk', swatch: ['#2b1450', '#d0687c'] },
  { id: 'aurora', label: 'Aurora', phrase: 'a restless aurora', swatch: ['#06192e', '#5fe8b8'] },
  { id: 'dawn', label: 'Pale Dawn', phrase: 'a pale dawn', swatch: ['#463d86', '#f6c2a8'] },
]

export const LANDS: Option<LandId>[] = [
  { id: 'forest', label: 'Moonlit Forest', phrase: 'a moonlit forest', swatch: ['#0a1030', '#5a74c8'] },
  { id: 'islands', label: 'Floating Islands', phrase: 'islands that float', swatch: ['#1a1440', '#9a86e8'] },
  { id: 'desert', label: 'Crystal Desert', phrase: 'a desert of crystals', swatch: ['#2a1a48', '#b4a2ff'] },
]

export const LIFE: (Option<LifeId> & { kind: 'creature' | 'plant' })[] = [
  { id: 'moths', label: 'Glowmoths', kind: 'creature', phrase: 'glowmoths', swatch: ['#3a2a10', '#ffe2a0'] },
  { id: 'whale', label: 'Sky Whale', kind: 'creature', phrase: 'a sky whale', swatch: ['#0e1e40', '#9ec8ff'] },
  { id: 'fox', label: 'Star Fox', kind: 'creature', phrase: 'a star fox', swatch: ['#2a1630', '#ffb48a'] },
  { id: 'glowcaps', label: 'Glowcaps', kind: 'plant', phrase: 'glowcaps', swatch: ['#06283a', '#7af5ff'] },
  { id: 'bells', label: 'Bellflowers', kind: 'plant', phrase: 'bellflowers', swatch: ['#1a1a4a', '#b0bcff'] },
  { id: 'reeds', label: 'Lumen Reeds', kind: 'plant', phrase: 'lumen reeds', swatch: ['#2a2410', '#ffd36e'] },
]

export const WONDERS: Option<WonderId>[] = [
  { id: 'lantern', label: 'A Lantern', phrase: 'a lantern', swatch: ['#3a2008', '#ffd58a'] },
  { id: 'moon', label: 'A Tiny Moon', phrase: 'a tiny moon', swatch: ['#1a1d3a', '#eef0ff'] },
  { id: 'cloud', label: 'A Rain Cloud', phrase: 'a rain cloud', swatch: ['#18203a', '#9fd8ff'] },
]

export type SkyPalette = {
  stars: number
  far: string
  mid: string
  near: string
  rim: string
  mist: string
  glow: string
}

export const SKY_PALETTE: Record<SkyId, SkyPalette> = {
  midnight: { stars: 1, far: '#1a2456', mid: '#111a44', near: '#080c26', rim: '#a8bcff', mist: '#3a4c90', glow: '#7f9cff' },
  dusk: { stars: 0.45, far: '#43225e', mid: '#2a1642', near: '#140b24', rim: '#ffbb94', mist: '#8a4a7e', glow: '#ff9e7a' },
  aurora: { stars: 0.8, far: '#123046', mid: '#0b2032', near: '#05101c', rim: '#86ffd8', mist: '#1f5a6a', glow: '#6affc8' },
  dawn: { stars: 0.18, far: '#5e4f92', mid: '#3c316c', near: '#1e1a44', rim: '#ffdcae', mist: '#c7a0c8', glow: '#ffd0a0' },
}

const isOneOf = <T extends string>(list: Option<T>[], value: unknown): value is T =>
  typeof value === 'string' && list.some((o) => o.id === value)

export function worldToQuery(world: World) {
  const params = new URLSearchParams()
  params.set('sky', world.sky)
  params.set('land', world.land)
  if (world.life.length) params.set('life', world.life.join('.'))
  params.set('wonder', world.wonder)
  const name = world.name.trim()
  if (name) params.set('name', name)
  return params.toString()
}

export function worldFromParams(raw: Record<string, string | string[] | undefined>): World | null {
  const get = (key: string) => {
    const v = raw[key]
    return Array.isArray(v) ? v[0] : v
  }
  const sky = get('sky')
  const land = get('land')
  if (!isOneOf(SKIES, sky) || !isOneOf(LANDS, land)) return null
  const wonder = get('wonder')
  const life = (get('life') ?? '')
    .split('.')
    .filter((id, i, arr): id is LifeId => isOneOf(LIFE, id) && arr.indexOf(id) === i)
    .slice(0, MAX_LIFE)
  return {
    sky,
    land,
    life,
    wonder: isOneOf(WONDERS, wonder) ? wonder : DEFAULT_WORLD.wonder,
    name: (get('name') ?? '').slice(0, MAX_NAME),
  }
}

const phraseOf = <T extends string>(list: Option<T>[], id: T) => list.find((o) => o.id === id)?.phrase ?? ''

function joinList(items: string[]) {
  if (items.length <= 1) return items[0] ?? ''
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`
}

export function describeWorld(world: World) {
  const sky = phraseOf(SKIES, world.sky)
  const land = phraseOf(LANDS, world.land)
  const wonder = phraseOf(WONDERS, world.wonder)
  const life = world.life.map((id) => phraseOf(LIFE, id))
  const dwellers = life.length ? `, where ${joinList(life)} make their home` : ', quiet and waiting for its first inhabitant'
  return `Beneath ${sky} lies ${land}${dwellers}, and ${wonder} keeps watch.`
}
