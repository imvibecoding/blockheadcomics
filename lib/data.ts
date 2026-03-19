import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')

export function readData<T>(filename: string): T {
  const filePath = path.join(dataDir, filename)
  const content = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(content)
}

export function writeData<T>(filename: string, data: T): void {
  const filePath = path.join(dataDir, filename)
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
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

export type Panel = {
  id: string
  image: string
  caption: string
  order: number
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

export function getComics(): Comic[] {
  return readData<Comic[]>('comics.json')
}

export function getComic(slug: string): Comic | undefined {
  return getComics().find(c => c.slug === slug)
}

export function saveComics(comics: Comic[]): void {
  writeData('comics.json', comics)
}

export function getCharacters(): Character[] {
  return readData<Character[]>('characters.json')
}

export function saveCharacters(characters: Character[]): void {
  writeData('characters.json', characters)
}

export function getSettings(): SiteSettings {
  return readData<SiteSettings>('settings.json')
}

export function saveSettings(settings: SiteSettings): void {
  writeData('settings.json', settings)
}
