import { NextRequest, NextResponse } from 'next/server'
import { getSettings } from '@/lib/data'
import { getAdminSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

const GRAPH = 'https://graph.facebook.com/v19.0'

export async function POST(request: NextRequest) {
  try {
    if (!await getAdminSession()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const settings = await getSettings()
    const userId = settings.instagramUserId?.trim()
    const token = settings.instagramAccessToken?.trim()

    if (!userId || !token) {
      return NextResponse.json(
        { error: 'Instagram is not configured. Add your User ID and Access Token in Settings.' },
        { status: 400 }
      )
    }

    const body = await request.json() as {
      type: 'single' | 'carousel'
      imageUrls: string[]
      caption: string
    }

    const { type, imageUrls, caption } = body

    if (!imageUrls?.length) {
      return NextResponse.json({ error: 'No image URLs provided' }, { status: 400 })
    }

    // ── Single image post ──────────────────────────────────────────────────
    if (type === 'single') {
      const mediaRes = await fetch(
        `${GRAPH}/${userId}/media?image_url=${encodeURIComponent(imageUrls[0])}&caption=${encodeURIComponent(caption)}&access_token=${token}`,
        { method: 'POST' }
      )
      const mediaData = await mediaRes.json()
      if (!mediaRes.ok || !mediaData.id) {
        console.error('Instagram create media error:', mediaData)
        return NextResponse.json(
          { error: mediaData.error?.message || 'Failed to create media on Instagram' },
          { status: 502 }
        )
      }

      const publishRes = await fetch(
        `${GRAPH}/${userId}/media_publish?creation_id=${mediaData.id}&access_token=${token}`,
        { method: 'POST' }
      )
      const publishData = await publishRes.json()
      if (!publishRes.ok || !publishData.id) {
        console.error('Instagram publish error:', publishData)
        return NextResponse.json(
          { error: publishData.error?.message || 'Failed to publish to Instagram' },
          { status: 502 }
        )
      }

      return NextResponse.json({ ok: true, mediaId: publishData.id, type: 'single' })
    }

    // ── Carousel post (multiple panels) ───────────────────────────────────
    if (type === 'carousel') {
      if (imageUrls.length < 2) {
        return NextResponse.json({ error: 'Carousel requires at least 2 images' }, { status: 400 })
      }

      // Step 1: create a media item for each image
      const itemIds: string[] = []
      for (const url of imageUrls) {
        const res = await fetch(
          `${GRAPH}/${userId}/media?image_url=${encodeURIComponent(url)}&is_carousel_item=true&access_token=${token}`,
          { method: 'POST' }
        )
        const data = await res.json()
        if (!res.ok || !data.id) {
          console.error('Instagram carousel item error:', data)
          return NextResponse.json(
            { error: data.error?.message || 'Failed to create carousel item' },
            { status: 502 }
          )
        }
        itemIds.push(data.id)
      }

      // Step 2: create the carousel container
      const childrenParam = itemIds.join(',')
      const carouselRes = await fetch(
        `${GRAPH}/${userId}/media?media_type=CAROUSEL&caption=${encodeURIComponent(caption)}&children=${childrenParam}&access_token=${token}`,
        { method: 'POST' }
      )
      const carouselData = await carouselRes.json()
      if (!carouselRes.ok || !carouselData.id) {
        console.error('Instagram carousel container error:', carouselData)
        return NextResponse.json(
          { error: carouselData.error?.message || 'Failed to create carousel' },
          { status: 502 }
        )
      }

      // Step 3: publish
      const publishRes = await fetch(
        `${GRAPH}/${userId}/media_publish?creation_id=${carouselData.id}&access_token=${token}`,
        { method: 'POST' }
      )
      const publishData = await publishRes.json()
      if (!publishRes.ok || !publishData.id) {
        console.error('Instagram publish carousel error:', publishData)
        return NextResponse.json(
          { error: publishData.error?.message || 'Failed to publish carousel' },
          { status: 502 }
        )
      }

      return NextResponse.json({ ok: true, mediaId: publishData.id, type: 'carousel', panels: itemIds.length })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })

  } catch (err) {
    console.error('Instagram post error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
