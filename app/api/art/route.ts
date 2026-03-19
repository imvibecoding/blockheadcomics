import { NextResponse } from 'next/server'
import { getArt, saveArt, ArtPiece } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const art = await getArt()
    return NextResponse.json(art)
  } catch (err) {
    console.error('GET /api/art error:', err)
    return NextResponse.json({ error: 'Failed to load art' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const art = await getArt()
    const newPiece: ArtPiece = {
      id: Date.now().toString(),
      title: body.title || 'Untitled',
      description: body.description || '',
      image: body.image || '/placeholder-character.svg',
      category: body.category || 'general',
      publishedAt: body.publishedAt || new Date().toISOString(),
      featured: body.featured ?? false,
      order: body.order ?? art.length + 1,
    }
    art.push(newPiece)
    await saveArt(art)
    return NextResponse.json(newPiece, { status: 201 })
  } catch (err) {
    console.error('POST /api/art error:', err)
    return NextResponse.json({ error: 'Failed to create art piece' }, { status: 500 })
  }
}
