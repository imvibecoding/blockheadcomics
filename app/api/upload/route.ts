import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    if (!await getAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type — images and videos allowed
    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')
    if (!isImage && !isVideo) {
      return NextResponse.json({ error: 'Only image or video files are allowed' }, { status: 400 })
    }

    // Size limits: 10 MB for images, 200 MB for video
    const maxBytes = isVideo ? 200 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: `File too large (max ${isVideo ? '200' : '10'}MB)` },
        { status: 400 }
      )
    }

    // Use Vercel Blob when token is available (deployed), filesystem locally
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const { put } = await import('@vercel/blob')
      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const blob = await put(`comics/${Date.now()}-${safeName}`, file, {
        access: 'public',
      })
      return NextResponse.json({ url: blob.url })
    }

    // Local filesystem fallback
    const { writeFile, mkdir } = await import('fs/promises')
    const path = await import('path')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    await writeFile(path.join(uploadsDir, filename), buffer)
    return NextResponse.json({ url: `/uploads/${filename}` })

  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
