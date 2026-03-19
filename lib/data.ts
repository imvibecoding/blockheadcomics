import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
const USE_BLOB = !!process.env.BLOB_READ_WRITE_TOKEN

// ─── Types ───────────────────────────────────────────────────────────────────

export type Panel = {
  id: string
  image: string
  caption: string
  order: number
}

export type Comic = {
  id: string
  slug: string
  title: string
  stripNumber: number
  publishedAt: string
  series: string
  panels: Panel[]
  tags: string[]
  featured: boolean
}

export type Character = {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  color: string
  shape: string
  image: string
  featured: boolean
  order: number
}

export type SiteSettings = {
  siteTitle: string
  tagline: string
  description: string
  socialLinks: { instagram: string; twitter: string; facebook: string }
  copyrightYear: string
  aboutIntro: string
  creatorNote: string
  fanArtEmail: string
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

/**
 * Read JSON data.
 * On Vercel (BLOB_READ_WRITE_TOKEN present): reads from Vercel Blob, falls back
 * to the bundled JSON file if the blob doesn't exist yet (first deploy).
 * Locally: reads from data/ directory.
 */
async function readDataAsync<T>(filename: string): Promise<T> {
  if (USE_BLOB) {
    try {
      // Use get() rather than head()+fetch() — goes through the authenticated
      // Blob API, bypassing CDN caching entirely so reads are always fresh.
      const { get } = await import('@vercel/blob')
      const result = await get(`data/${filename}`, { access: 'public' })
      if (result?.stream) {
        return new Response(result.stream).json() as Promise<T>
      }
    } catch {
      // Blob doesn't exist yet — seed from the bundled JSON file
    }
  }
  const content = fs.readFileSync(path.join(dataDir, filename), 'utf-8')
  return JSON.parse(content) as T
}

/**
 * Write JSON data.
 * On Vercel: writes to Vercel Blob (overwrites the same pathname each time).
 * Locally: writes to data/ directory.
 */
async function writeDataAsync<T>(filename: string, data: T): Promise<void> {
  if (USE_BLOB) {
    const { put } = await import('@vercel/blob')
    await put(`data/${filename}`, JSON.stringify(data, null, 2), {
      access: 'public',
      allowOverwrite: true,
      contentType: 'application/json',
    })
    return
  }
  fs.writeFileSync(
    path.join(dataDir, filename),
    JSON.stringify(data, null, 2)
  )
}

// ─── Comics ───────────────────────────────────────────────────────────────────

export async function getComics(): Promise<Comic[]> {
  return readDataAsync<Comic[]>('comics.json')
}

export async function getComic(slug: string): Promise<Comic | undefined> {
  const comics = await getComics()
  return comics.find(c => c.slug === slug)
}

export async function saveComics(comics: Comic[]): Promise<void> {
  return writeDataAsync('comics.json', comics)
}

// ─── Characters ───────────────────────────────────────────────────────────────

export async function getCharacters(): Promise<Character[]> {
  return readDataAsync<Character[]>('characters.json')
}

export async function saveCharacters(characters: Character[]): Promise<void> {
  return writeDataAsync('characters.json', characters)
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<SiteSettings> {
  return readDataAsync<SiteSettings>('settings.json')
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  return writeDataAsync('settings.json', settings)
}
