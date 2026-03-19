import { NextRequest, NextResponse } from 'next/server'
import { getComics, saveComics } from '@/lib/data'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    const comics = await getComics()
    return NextResponse.json(comics)
  } catch (err) {
    console.error('GET /api/comics:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await getAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const comics = await getComics()
    const body = await request.json()
    const newComic = { ...body, id: Date.now().toString() }
    comics.push(newComic)
    await saveComics(comics)
    return NextResponse.json(newComic)
  } catch (err) {
    console.error('POST /api/comics:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
