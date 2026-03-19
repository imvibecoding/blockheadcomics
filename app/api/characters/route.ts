import { NextRequest, NextResponse } from 'next/server'
import { getCharacters, saveCharacters } from '@/lib/data'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    const characters = await getCharacters()
    return NextResponse.json(characters)
  } catch (err) {
    console.error('GET /api/characters:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await getAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const characters = await getCharacters()
    const body = await request.json()
    const newCharacter = { ...body, id: Date.now().toString() }
    characters.push(newCharacter)
    await saveCharacters(characters)
    return NextResponse.json(newCharacter)
  } catch (err) {
    console.error('POST /api/characters:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
