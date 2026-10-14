'use client'

import { useState } from 'react'
import { ChevronDown, Cloud, Mountain, Sparkles, Sprout } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LANDS, LIFE, MAX_LIFE, SKIES, WONDERS, type LifeId, type World } from '@/lib/world'

type Tab = 'sky' | 'land' | 'life' | 'wonder'

const TABS: { id: Tab; label: string; icon: typeof Cloud }[] = [
  { id: 'sky', label: 'Sky', icon: Cloud },
  { id: 'land', label: 'Land', icon: Mountain },
  { id: 'life', label: 'Life', icon: Sprout },
  { id: 'wonder', label: 'Wonder', icon: Sparkles },
]

type Props = {
  world: World
  onChange: (patch: Partial<World>) => void
}

function Swatch({ colors, active }: { colors: [string, string]; active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'size-6 shrink-0 rounded-full ring-1 ring-white/20 transition-shadow duration-500',
        active && 'shadow-[0_0_14px_2px] ring-white/60',
      )}
      style={{
        background: `radial-gradient(circle at 30% 30%, ${colors[1]}, ${colors[0]} 75%)`,
        color: colors[1],
      }}
    />
  )
}

function OptionButton({
  label,
  colors,
  active,
  disabled,
  onClick,
  pressed,
}: {
  label: string
  colors: [string, string]
  active: boolean
  disabled?: boolean
  onClick: () => void
  pressed?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={pressed}
      role={pressed === undefined ? 'radio' : undefined}
      aria-checked={pressed === undefined ? active : undefined}
      className={cn(
        'flex shrink-0 items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 text-sm transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        active
          ? 'border-[#f6d9a4]/50 bg-[#f6d9a4]/12 text-[#fff3dc]'
          : 'border-white/10 bg-white/[0.03] text-[#cfc9f0] hover:border-white/25 hover:bg-white/[0.07]',
        disabled && 'cursor-not-allowed opacity-40 hover:border-white/10 hover:bg-white/[0.03]',
      )}
    >
      <Swatch colors={colors} active={active} />
      {label}
    </button>
  )
}

export function Builder({ world, onChange }: Props) {
  const [tab, setTab] = useState<Tab>('sky')
  const [open, setOpen] = useState(true)

  const selectTab = (id: Tab) => {
    setTab(id)
    setOpen(true)
  }

  const toggleLife = (id: LifeId) => {
    const has = world.life.includes(id)
    if (has) onChange({ life: world.life.filter((l) => l !== id) })
    else if (world.life.length < MAX_LIFE) onChange({ life: [...world.life, id] })
  }

  return (
    <div className="glass fade-up pointer-events-auto mx-auto w-full max-w-3xl rounded-3xl p-2" style={{ animationDelay: '0.6s' }}>
      <div className="flex items-center gap-1" role="tablist" aria-label="Shape your world">
        {TABS.map(({ id, label, icon: Icon }) => {
          const selected = tab === id && open
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={selected}
              aria-controls="builder-panel"
              onClick={() => (tab === id && open ? setOpen(false) : selectTab(id))}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-sm transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                selected ? 'bg-white/10 text-[#fff3dc]' : 'text-[#a9a3cf] hover:bg-white/5 hover:text-[#ece8ff]',
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{label}</span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Hide choices' : 'Show choices'}
          aria-expanded={open}
          className="ml-1 flex size-10 shrink-0 items-center justify-center rounded-2xl text-[#a9a3cf] transition-colors hover:bg-white/5 hover:text-[#ece8ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronDown className={cn('size-4 transition-transform duration-300', !open && 'rotate-180')} aria-hidden="true" />
        </button>
      </div>

      <div
        className={cn(
          'grid transition-[grid-template-rows,opacity] duration-500 ease-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <div
            id="builder-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
            className="flex flex-col gap-2 px-2 pb-2 pt-3"
          >
            <div
              key={tab}
              className="fade-in -mx-2 flex gap-2 overflow-x-auto px-2 pb-1 [scrollbar-width:none] md:flex-wrap md:justify-center"
              role={tab === 'life' ? 'group' : 'radiogroup'}
              aria-label={TABS.find((t) => t.id === tab)?.label}
            >
              {tab === 'sky' &&
                SKIES.map((o) => (
                  <OptionButton key={o.id} label={o.label} colors={o.swatch} active={world.sky === o.id} onClick={() => onChange({ sky: o.id })} />
                ))}
              {tab === 'land' &&
                LANDS.map((o) => (
                  <OptionButton key={o.id} label={o.label} colors={o.swatch} active={world.land === o.id} onClick={() => onChange({ land: o.id })} />
                ))}
              {tab === 'life' &&
                LIFE.map((o) => {
                  const active = world.life.includes(o.id)
                  return (
                    <OptionButton
                      key={o.id}
                      label={o.label}
                      colors={o.swatch}
                      active={active}
                      pressed={active}
                      disabled={!active && world.life.length >= MAX_LIFE}
                      onClick={() => toggleLife(o.id)}
                    />
                  )
                })}
              {tab === 'wonder' &&
                WONDERS.map((o) => (
                  <OptionButton key={o.id} label={o.label} colors={o.swatch} active={world.wonder === o.id} onClick={() => onChange({ wonder: o.id })} />
                ))}
            </div>
            <p className="text-center text-xs text-[#a9a3cf]/80" aria-live="polite">
              {tab === 'life'
                ? world.life.length === 0
                  ? 'Nothing lives here yet. Invite up to three.'
                  : `${world.life.length} of ${MAX_LIFE} \u2014 ${world.life.length >= MAX_LIFE ? 'release one to invite another' : 'room for more'}`
                : tab === 'sky'
                  ? 'Every sky remembers a different hour.'
                  : tab === 'land'
                    ? 'The ground beneath your door.'
                    : 'One small piece of magic. Touch it once it appears.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
