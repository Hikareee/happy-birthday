import { useEnvironment, useFont, useTexture } from '@react-three/drei'
import { photos } from './config'

export const IMAGE_ASSETS = [
  ...photos.map((photo) => photo.src),
  '/photos/meerkat.png',
  '/photos/valorant-bronze.png',
]

export const FONT_ASSET = '/fonts/helvetiker_bold.typeface.json'
export const MUSIC_ASSET = '/photos/hapede.mp3'

const HTML_ASSETS = [...IMAGE_ASSETS, FONT_ASSET, MUSIC_ASSET]

try {
  useTexture.preload([...IMAGE_ASSETS])
  useFont.preload(FONT_ASSET)
  useEnvironment.preload({ preset: 'sunset' })
} catch {
  // Scene suspense still loads these if preload is unavailable.
}

async function wait(ms: number) {
  await new Promise((resolve) => window.setTimeout(resolve, ms))
}

async function withRetry<T>(run: () => Promise<T>, attempts = 4): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await run()
    } catch (error) {
      lastError = error
      await wait(220 * (attempt + 1))
    }
  }
  throw lastError
}

async function decodeImage(src: string) {
  const image = new Image()
  image.decoding = 'async'
  image.src = src
  if (typeof image.decode === 'function') {
    await image.decode()
    return
  }
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve()
    image.onerror = () => reject(new Error(`Failed to load ${src}`))
  })
}

async function loadAsset(url: string) {
  if (url.endsWith('.json') || url.endsWith('.mp3')) {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`Failed to load ${url}`)
    if (url.endsWith('.json')) await response.json()
    else await response.arrayBuffer()
    return
  }
  await decodeImage(url)
}

export async function preloadHtmlAssets(onProgress: (ratio: number) => void) {
  const total = HTML_ASSETS.length + 1
  let done = 0

  await Promise.all(
    HTML_ASSETS.map(async (url) => {
      await withRetry(() => loadAsset(url))
      done += 1
      onProgress(done / total)
    }),
  )

  if (document.fonts) {
    await Promise.allSettled([
      document.fonts.load('700 80px "Bebas Neue"'),
      document.fonts.load('400 16px Outfit'),
      document.fonts.load('500 24px "Cormorant Garamond"'),
      document.fonts.ready,
    ])
  }

  onProgress(1)
}
