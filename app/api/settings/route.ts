import { NextRequest, NextResponse } from 'next/server'
import { getSettings, saveSettings } from '@/lib/data'
import { getAdminSession } from '@/lib/auth'

export async function GET() {
  try {
    const settings = await getSettings()
    return NextResponse.json(settings)
  } catch (err) {
    console.error('GET /api/settings:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    if (!await getAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    await saveSettings(body)
    return NextResponse.json(body)
  } catch (err) {
    console.error('PUT /api/settings:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
