import { NextRequest, NextResponse } from 'next/server'
import { getComics, saveComics } from '@/lib/data'
import { getAdminSession } from '@/lib/auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const comics = await getComics()
    const comic = comics.find(c => c.id === id)
    if (!comic) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(comic)
  } catch (err) {
    console.error('GET /api/comics/[id]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!await getAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const comics = await getComics()
    const index = comics.findIndex(c => c.id === id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const body = await request.json()
    comics[index] = { ...comics[index], ...body }
    await saveComics(comics)
    return NextResponse.json(comics[index])
  } catch (err) {
    console.error('PUT /api/comics/[id]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!await getAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const comics = await getComics()
    await saveComics(comics.filter(c => c.id !== id))
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/comics/[id]:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
