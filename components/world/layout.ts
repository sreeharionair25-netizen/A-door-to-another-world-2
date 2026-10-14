import type { LandId } from '@/lib/world'

export type Bob = 'a' | 'b' | 'c' | 'd'
export type Spot = { x: number; y: number; bob?: Bob; s?: number }

export type LandLayout = {
  fox: Spot
  glowcaps: Spot[]
  bells: Spot[]
  reeds: Spot[]
  lantern: Spot
  moon: Spot
  cloud: Spot
  mothHome: Spot
  river: string
  riverBob?: Bob
  hotspots: Spot[]
}

export const bobClass = (bob?: Bob) => (bob ? `anim-bob-${bob}` : undefined)

export const LAYOUTS: Record<LandId, LandLayout> = {
  forest: {
    fox: { x: 935, y: 712 },
    glowcaps: [
      { x: 655, y: 722 },
      { x: 1065, y: 716 },
      { x: 470, y: 740 },
    ],
    bells: [
      { x: 575, y: 714 },
      { x: 1150, y: 722 },
    ],
    reeds: [
      { x: 745, y: 728 },
      { x: 1010, y: 732 },
      { x: 410, y: 744 },
    ],
    lantern: { x: 815, y: 716 },
    moon: { x: 1030, y: 320 },
    cloud: { x: 650, y: 250 },
    mothHome: { x: 800, y: 560 },
    river: 'M1660 748 C 1400 752 1250 800 1050 782 S 760 770 610 812 S 300 872 -60 892',
    hotspots: [
      { x: 1180, y: 520 },
      { x: 700, y: 800 },
      { x: 880, y: 650 },
    ],
  },
  islands: {
    fox: { x: 905, y: 588, bob: 'a' },
    glowcaps: [
      { x: 670, y: 596, bob: 'a' },
      { x: 1215, y: 506, bob: 'c' },
      { x: 385, y: 476, bob: 'b' },
    ],
    bells: [
      { x: 600, y: 590, bob: 'a' },
      { x: 1300, y: 504, bob: 'c' },
    ],
    reeds: [
      { x: 985, y: 598, bob: 'a' },
      { x: 330, y: 478, bob: 'b' },
      { x: 745, y: 584, bob: 'a' },
    ],
    lantern: { x: 810, y: 586, bob: 'a' },
    moon: { x: 1040, y: 330 },
    cloud: { x: 640, y: 240 },
    mothHome: { x: 800, y: 500 },
    river: 'M610 600 C 700 614 820 584 920 604 S 1040 614 1062 600',
    riverBob: 'a',
    hotspots: [
      { x: 560, y: 352, bob: 'd' },
      { x: 860, y: 700, bob: 'a' },
      { x: 1050, y: 590, bob: 'a' },
    ],
  },
  desert: {
    fox: { x: 905, y: 684 },
    glowcaps: [
      { x: 700, y: 694 },
      { x: 1120, y: 700 },
      { x: 480, y: 730 },
    ],
    bells: [
      { x: 625, y: 688 },
      { x: 1185, y: 708 },
    ],
    reeds: [
      { x: 780, y: 700 },
      { x: 990, y: 708 },
      { x: 420, y: 734 },
    ],
    lantern: { x: 830, y: 686 },
    moon: { x: 1040, y: 320 },
    cloud: { x: 640, y: 250 },
    mothHome: { x: 800, y: 560 },
    river: 'M1660 712 C 1400 732 1200 772 1000 752 S 700 744 560 792 S 300 862 -60 872',
    hotspots: [
      { x: 1250, y: 500 },
      { x: 690, y: 790 },
      { x: 960, y: 640 },
    ],
  },
}

export const MOUNTAIN_HOTSPOT: Spot = { x: 900, y: 382 }
