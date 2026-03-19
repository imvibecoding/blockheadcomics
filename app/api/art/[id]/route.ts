import { NextResponse } from 'next/server'
import { getArt, saveArt } from '@/lib/data'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const art = await getArt()
    const piece = art.find(a => a.id === id)
    if (!piece) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(piece)
  } catch (err) {
    console.error('GET /api/art/[id] error:', err)
    return NextResponse.json({ error: 'Failed to load art piece' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const art = await getArt()
    const idx = art.findIndex(a => a.id === id)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    art[idx] = { ...art[idx], ...body, id }
    await saveArt(art)
    return NextResponse.json(art[idx])
  } catch (err) {
    console.error('PUT /api/art/[id] error:', err)
    return NextResponse.json({ error: 'Failed to update art piece' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const art = await getArt()
    const updated = art.filter(a => a.id !== id)
    if (updated.length === art.length) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await saveArt(updated)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('DELETE /api/art/[id] error:', err)
    return NextResponse.json({ error: 'Failed to delete art piece' }, { status: 500 })
  }
}
