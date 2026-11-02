export const friend = {
  name: 'Lionel',
  from: 'Ko Nik',
  tagline: 'May God bless you more and more as the years go by.',
}

export const photos = [
  {
    id: 'origin',
    src: '/photos/childhood.jpg',
    title: 'You made it',
    kicker: 'Fifteen',
    copy: 'Congrats on reaching 15 years old. From this little guy to the young man you are now — proud of you, Lionel.',
    frame: [1.72, 2.05] as [number, number],
  },
  {
    id: 'legend',
    src: '/photos/legend.jpg',
    title: 'Adept rock collector',
    kicker: 'Keep exploring',
    copy: 'Stay curious. The best treasures are still waiting for you.',
    frame: [1.45, 2.35] as [number, number],
  },
  {
    id: 'beach',
    src: '/photos/beach.jpg',
    title: 'Bronze?',
    kicker: 'Aim higher',
    copy: 'Laugh it off, then climb. Fifteen is a great year to level up.',
    frame: [1.45, 2.35] as [number, number],
  },
  {
    id: 'sunset',
    src: '/photos/sunset.jpg',
    title: 'Bronze?',
    kicker: 'Keep shining',
    copy: 'Fifteen looks good on you. Bigger sunsets are coming.',
    frame: [1.45, 2.35] as [number, number],
  },
  {
    id: 'crew',
    src: '/photos/crew.jpg',
    title: 'Never walk alone',
    kicker: 'Your people',
    copy: 'Good friends, good laughs, good years. You’ve got a whole team behind you.',
    frame: [1.45, 2.35] as [number, number],
  },
  {
    id: 'locked',
    src: '/photos/locked-in.jpg',
    title: 'Blood strike? I prefer overwatch',
    kicker: 'Locked in',
    copy: 'Keep that fire. This next year is yours to win.',
    frame: [1.45, 2.35] as [number, number],
  },
]

export const encorePhotos = [
  {
    id: 'encore-face',
    src: '/photos/encore-face.jpg',
    frame: [1.62, 2.05] as [number, number],
  },
  {
    id: 'encore-sleep',
    src: '/photos/encore-sleep.jpg',
    frame: [2.18, 1.32] as [number, number],
  },
  {
    id: 'encore-peace',
    src: '/photos/encore-peace.jpg',
    frame: [1.48, 2.32] as [number, number],
  },
]

export const letterStage = photos.length + 1
export const teaseStage = letterStage + 1
export const encoreStart = teaseStage + 1
export const wishStage = encoreStart + encorePhotos.length
export const scrollMax = wishStage
export const endingVideo = '/photos/endingvid.mp4'
export const teaseLine = "And of course it's not a birthday without..."

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
