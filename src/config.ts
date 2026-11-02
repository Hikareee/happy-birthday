export const friend = {
  name: 'Lionel',
  from: 'Ko Nik',
  tagline: 'May God bless you more and more as the years go by.',
}

export const photos = [
  {
    id: 'origin',
    src: '/photos/childhood.jpg',
    title: 'The origin story',
    kicker: '01 — Then',
    copy: 'The grin. The glasses. The era-defining bowl cut. Proof you came into this world already main-character coded.',
    frame: [1.72, 2.05] as [number, number],
  },
  {
    id: 'legend',
    src: '/photos/legend.jpg',
    title: 'Main character energy',
    kicker: '02 — Built different',
    copy: 'Still collecting rocks like the world is a treasure map. Braces, wings on the shirt, and a smile that could power a city block.',
    frame: [1.45, 2.35] as [number, number],
  },
  {
    id: 'beach',
    src: '/photos/beach.jpg',
    title: 'Treasure hunter',
    kicker: '03 — Shoreline loot',
    copy: 'Sandy knees, braces out, holding a crystal like you just unlocked a secret level. The beach never stood a chance.',
    frame: [1.45, 2.35] as [number, number],
  },
  {
    id: 'sunset',
    src: '/photos/sunset.jpg',
    title: 'Golden hour',
    kicker: '04 — Shoreline king',
    copy: 'Barefoot in the last light, kayak parked, same winged shirt. The sun showed up just to stand behind you.',
    frame: [1.45, 2.35] as [number, number],
  },
  {
    id: 'crew',
    src: '/photos/crew.jpg',
    title: 'The brotherhood',
    kicker: '05 — Never solo',
    copy: 'The crew, the jokes, the pit stop on a random street. You make ordinary days look like a poster.',
    frame: [1.45, 2.35] as [number, number],
  },
  {
    id: 'locked',
    src: '/photos/locked-in.jpg',
    title: 'Locked in',
    kicker: '06 — Game face',
    copy: 'Hoodie up. Thumbs flying. Completely in the zone. Same kid, new final boss.',
    frame: [1.45, 2.35] as [number, number],
  },
]

export const scrollMax = photos.length + 2

export const letter = {
  kicker: 'A birthday prayer',
  greeting: `Happy birthday ${friend.name},`,
  body: [
    'May God bless you more and more as the years go by.',
    'May with your added age comes added wisdom. With your added age comes more maturity, strength, and anointing, so that you may achieve great things and glorify the Lord’s name through your hands.',
    'Hope I’ll continue to see you grow.',
  ],
  signoff: `Happy birthday bro.\n— ${friend.from}`,
}

export const palette = {
  gold: '#ffd76a',
  cyan: '#22f0ff',
  magenta: '#ff2d95',
  violet: '#8b5cff',
  ink: '#05010c',
}
