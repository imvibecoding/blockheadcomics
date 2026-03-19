import { NextRequest, NextResponse } from 'next/server'
import { getCharacters, saveCharacters } from '@/lib/data'
import { getAdminSession } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const characters = getCharacters()
    const character = characters.find(c => c.id === id)
    if (!character) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(character)
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
    const characters = getCharacters()
    const index = characters.findIndex(c => c.id === id)
    if (index === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const body = await request.json()
    characters[index] = { ...characters[index], ...body }
    saveCharacters(characters)
    return NextResponse.json(characters[index])
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
    const characters = getCharacters()
    const filtered = characters.filter(c => c.id !== id)
    saveCharacters(filtered)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
