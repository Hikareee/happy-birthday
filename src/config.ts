export const friend = {
  name: 'Lionel',
  from: 'Ko Nik',
  tagline: 'May God bless you more and more as the years go by.',
}

export const photos = [
  {
    id: 'origin',
    src: '/photos/childhood.jpg',
    title: 'Fat Lionel',
    kicker: '',
    copy: '',
    frame: [1.72, 2.05] as [number, number],
  },
  {
    id: 'legend',
    src: '/photos/legend.jpg',
    title: 'Adept rock collector',
    kicker: '',
    copy: '',
    frame: [1.45, 2.35] as [number, number],
  },
  {
    id: 'beach',
    src: '/photos/beach.jpg',
    title: '',
    kicker: '',
    copy: '',
    frame: [1.45, 2.35] as [number, number],
  },
  {
    id: 'sunset',
    src: '/photos/sunset.jpg',
    title: '',
    kicker: '',
    copy: '',
    frame: [1.45, 2.35] as [number, number],
  },
  {
    id: 'crew',
    src: '/photos/crew.jpg',
    title: '',
    kicker: '',
    copy: '',
    frame: [1.45, 2.35] as [number, number],
  },
  {
    id: 'locked',
    src: '/photos/locked-in.jpg',
    title: 'Blood strike? I prefer overwatch',
    kicker: '',
    copy: '',
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
  gold: '#E9C46A',
  teal: '#2A9D8F',
  orange: '#E76F51',
  lime: '#7CB342',
  ink: '#07140C',
}
