import { NextRequest, NextResponse } from 'next/server'
import { getSettings, saveSettings } from '@/lib/data'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    return NextResponse.json(getSettings())
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!await getAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    saveSettings(body)
    return NextResponse.json(body)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
