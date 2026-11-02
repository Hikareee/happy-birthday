export const friend = {
  name: 'King',
  from: 'Your best friend',
  tagline: 'Another lap around the sun.',
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
    id: 'crew',
    src: '/photos/crew.jpg',
    title: 'The brotherhood',
    kicker: '04 — Never solo',
    copy: 'The crew, the jokes, the pit stop on a random street. You make ordinary days look like a poster.',
    frame: [1.45, 2.35] as [number, number],
  },
  {
    id: 'locked',
    src: '/photos/locked-in.jpg',
    title: 'Locked in',
    kicker: '05 — Game face',
    copy: 'Hoodie up. Thumbs flying. Completely in the zone. Same kid, new final boss.',
    frame: [1.45, 2.35] as [number, number],
  },
]

export const scrollMax = photos.length + 2

export const letter = {
  greeting: `Hey ${friend.name},`,
  body: [
    'Another trip around the sun. From the bowl-cut kid with the gap-tooth grin to the guy who still picks up rocks — and beach crystals — like they matter. You have always been built different.',
    'You show up. You laugh with your whole face. You lock in when it counts. Being your best friend is one of the easiest wins I have ever scored.',
    'Proud of you. Today, and every orbit after this one.',
  ],
  signoff: `Happy birthday.\n— ${friend.from}`,
}

export const palette = {
  gold: '#ffd76a',
  cyan: '#22f0ff',
  magenta: '#ff2d95',
  violet: '#8b5cff',
  ink: '#05010c',
}
