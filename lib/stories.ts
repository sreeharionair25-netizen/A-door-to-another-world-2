import type { LandId, LifeId } from './world'

export type Story = {
  id: string
  place: string
  text: string
}

export const MOUNTAIN_STORY: Story = {
  id: 'mountains',
  place: 'The listening mountains',
  text: 'The wind crosses the ridge and comes back softer. The mountains keep the loud parts, folded away like letters no one needs to read.',
}

export const LAND_STORIES: Record<LandId, Story[]> = {
  forest: [
    {
      id: 'forest-pine',
      place: 'Under the oldest pine',
      text: 'This tree has been counting stars since before there were any. It has reached four. It is in no hurry at all.',
    },
    {
      id: 'forest-stones',
      place: 'A path of white stones',
      text: 'Someone left these stones to find their way home. They never came back, but the stones still glow, just in case.',
    },
    {
      id: 'forest-clearing',
      place: 'The quiet clearing',
      text: 'Owls hold their meetings here. Nothing is ever decided. Everyone leaves feeling heard.',
    },
  ],
  islands: [
    {
      id: 'islands-small',
      place: 'The smallest island',
      text: 'It drifted away from the others on purpose. Every evening it floats a little closer, to see if anyone noticed.',
    },
    {
      id: 'islands-roots',
      place: 'Roots in the open air',
      text: 'These roots never found the ground, so they learned to drink from clouds. They say it tastes like thunder and pears.',
    },
    {
      id: 'islands-edge',
      place: 'The edge of everything',
      text: 'Drop a pebble from here and it falls for a week. On the eighth day, it lands softly in someone\u2019s dream.',
    },
  ],
  desert: [
    {
      id: 'desert-spire',
      place: 'The singing spire',
      text: 'At first light the crystals hum a single note. Travelers who hear it remember a song they never learned.',
    },
    {
      id: 'desert-steps',
      place: 'Footprints that lead nowhere',
      text: 'A giant walked here once, very carefully, so as not to wake the sand. The sand pretended to sleep.',
    },
    {
      id: 'desert-window',
      place: 'A buried window',
      text: 'Dig deep enough and the sand turns to glass. Beneath it, another sky is patiently waiting for its turn.',
    },
  ],
}

export const LIFE_MURMURS: Record<LifeId, string[]> = {
  moths: ['The moths scatter like a thought you almost had.', 'They always come back. Light is a kind of home.'],
  whale: [
    'The whale sings a note too low to hear. You feel it in your ribs anyway.',
    'Somewhere far off, another whale answers.',
  ],
  fox: ['The star fox flicks its tail. Somewhere, a wish comes true by accident.', 'It looks at you as if you are the strange one here.'],
  glowcaps: ['The glowcaps breathe out a small, bright sigh.', 'Spores drift up. Tomorrow there will be more light.'],
  bells: ['The bellflowers ring, very softly, for no one in particular.', 'A chime the color of blue hour.'],
  reeds: ['The reeds let go of a few bright seeds. They will be stars, eventually.', 'The reeds bow to the wind, politely.'],
}

export const LANTERN_MURMURS = [
  'The lantern rests. The dark here is kind.',
  'The lantern warms. Something nearby moves a little closer.',
  'The lantern blazes, and every shadow hurries to find somewhere to be.',
]

export const MOON_MURMURS = [
  'The tiny moon turns its whole face to you.',
  'It leans away, shy, keeping a little light for itself.',
  'Half lit, half dreaming.',
  'A thin smile of a moon.',
  'The moon closes its eyes. Even moons need rest.',
]

export const CLOUD_MURMURS = [
  'The cloud lets go. Where the rain lands, a river remembers its way.',
  'The river grows. It hums as it goes.',
  'The river is full now, and very proud of itself.',
]
