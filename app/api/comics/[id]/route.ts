import { NextRequest, NextResponse } from 'next/server'
import { getComics, saveComics } from '@/lib/data'
import { getAdminSession } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const comics = getComics()
    const comic = comics.find(c => c.id === id)
    if (!comic) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(comic)
  } catch {
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
    const comics = getComics()
    const index = comics.findIndex(c => c.id === id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const body = await request.json()
    comics[index] = { ...comics[index], ...body }
    saveComics(comics)
    return NextResponse.json(comics[index])
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!await getAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id } = await params
    const comics = getComics()
    const filtered = comics.filter(c => c.id !== id)
    saveComics(filtered)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
