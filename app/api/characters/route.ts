import { NextRequest, NextResponse } from 'next/server'
import { getCharacters, saveCharacters } from '@/lib/data'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    const characters = getCharacters()
    return NextResponse.json(characters)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!await getAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const characters = getCharacters()
    const body = await request.json()
    const newCharacter = { ...body, id: Date.now().toString() }
    characters.push(newCharacter)
    saveCharacters(characters)
    return NextResponse.json(newCharacter)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
