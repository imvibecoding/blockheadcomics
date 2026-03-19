'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'

type Panel = {
  id: string
  image: string
  caption: string
  order: number
}

interface ComicReaderProps {
  panels: Panel[]
  title: string
}

function isGif(url: string) {
  return url.toLowerCase().includes('.gif')
}
function isSvg(url: string) {
  return url.toLowerCase().includes('.svg')
}
function isPlaceholder(url: string) {
  return url.includes('placeholder')
}

export default function ComicReader({ panels, title }: ComicReaderProps) {
  const [displayed, setDisplayed] = useState(0)
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle')
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [downloading, setDownloading] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const swipeStartX = useRef<number | null>(null)

  const total = panels.length

  const navigate = useCallback(
    (target: number) => {
      if (phase !== 'idle') return
      if (target < 0 || target >= total) return
      const dir = target > displayed ? 'next' : 'prev'
      setDirection(dir)
      setPhase('out')

      timerRef.current = setTimeout(() => {
        setDisplayed(target)
        setPhase('in')
        timerRef.current = setTimeout(() => {
          setPhase('idle')
        }, 210)
      }, 210)
    },
    [displayed, phase, total]
  )

  // Keyboard navigation
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') navigate(displayed + 1)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') navigate(displayed - 1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [displayed, navigate])

  // Timer cleanup
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  // Download current panel as Instagram-ready 4:5 PNG (1080×1350)
  async function downloadPanel() {
    const panel = panels[displayed]
    if (!panel?.image || isSvg(panel.image) || isPlaceholder(panel.image)) return
    setDownloading(true)
    try {
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = panel.image
      })

      const W = 1080
      const H = 1350
      const canvas = document.createElement('canvas')
      canvas.width = W
      canvas.height = H
      const ctx = canvas.getContext('2d')!

      // White background
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, W, H)

      // objectFit: contain — no cropping, letterbox if needed
      const imgRatio = img.naturalWidth / img.naturalHeight
      const boxRatio = W / H
      let dw: number, dh: number, dx: number, dy: number
      if (imgRatio > boxRatio) {
        dw = W
        dh = W / imgRatio
        dx = 0
        dy = (H - dh) / 2
      } else {
        dh = H
        dw = H * imgRatio
        dx = (W - dw) / 2
        dy = 0
      }
      ctx.drawImage(img, dx, dy, dw, dh)

      await new Promise<void>((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve()
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `panel-${displayed + 1}-instagram.png`
            a.click()
            URL.revokeObjectURL(url)
            resolve()
          },
          'image/png'
        )
      })
    } catch (e) {
      console.error('Download failed:', e)
    } finally {
      setDownloading(false)
    }
  }

  // Animation class for the panel wrapper
  function animClass() {
    if (phase === 'out') return direction === 'next' ? 'panel-flip-out' : 'panel-flip-out-rev'
    if (phase === 'in') return direction === 'next' ? 'panel-flip-in' : 'panel-flip-in-rev'
    return ''
  }

  const panel = panels[displayed]
  if (!panel) return null

  const canGoNext = displayed < total - 1
  const canGoPrev = displayed > 0

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem',
        width: '100%',
        userSelect: 'none',
      }}
    >
      {/* Panel — 4:5 Instagram portrait format */}
      <div
        className="comic-reader-perspective"
        onPointerDown={(e) => {
          swipeStartX.current = e.clientX
        }}
        onPointerUp={(e) => {
          if (swipeStartX.current === null) return
          const delta = swipeStartX.current - e.clientX
          swipeStartX.current = null
          if (Math.abs(delta) > 40) {
            if (delta > 0) navigate(displayed + 1)
            else navigate(displayed - 1)
          }
        }}
        style={{
          width: '100%',
          maxWidth: '480px',
          position: 'relative',
          cursor: phase === 'idle' ? 'grab' : 'wait',
          touchAction: 'pan-y',
        }}
      >
        {/* The panel frame */}
        <div
          className={animClass()}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '4 / 5',
            background: '#ffffff',
            border: '4px solid #1A1A1A',
            boxShadow: '8px 8px 0 0 #1A1A1A',
            overflow: 'hidden',
          }}
        >
          {isGif(panel.image) ? (
            // GIF: standard img tag — Next.js Image kills animation
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={panel.image}
              alt={panel.caption || title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                display: 'block',
              }}
            />
          ) : (
            <Image
              src={panel.image}
              alt={panel.caption || title}
              fill
              style={{ objectFit: 'contain' }}
              unoptimized={isSvg(panel.image)}
              priority={displayed === 0}
            />
          )}
        </div>

        {/* Tap zones — invisible left/right strip hints */}
        {canGoPrev && (
          <button
            onClick={() => navigate(displayed - 1)}
            aria-label="Previous panel"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '20%',
              height: '100%',
              background: 'transparent',
              border: 'none',
              cursor: 'w-resize',
              zIndex: 10,
            }}
          />
        )}
        {canGoNext && (
          <button
            onClick={() => navigate(displayed + 1)}
            aria-label="Next panel"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '20%',
              height: '100%',
              background: 'transparent',
              border: 'none',
              cursor: 'e-resize',
              zIndex: 10,
            }}
          />
        )}
      </div>

      {/* Caption speech bubble */}
      {panel.caption && (
        <div
          style={{
            width: '100%',
            maxWidth: '480px',
            background: '#ffffff',
            border: '3px solid #1A1A1A',
            borderRadius: '14px',
            padding: '0.75rem 1.1rem',
            fontFamily: 'var(--font-headline)',
            fontWeight: 700,
            fontSize: '0.95rem',
            color: '#1A1A1A',
            position: 'relative',
            boxShadow: '4px 4px 0 0 #1A1A1A',
            lineHeight: 1.4,
          }}
        >
          {/* Bubble tail */}
          <span
            style={{
              position: 'absolute',
              top: '-13px',
              left: '24px',
              width: 0,
              height: 0,
              borderLeft: '9px solid transparent',
              borderRight: '9px solid transparent',
              borderBottom: '13px solid #1A1A1A',
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: '-8px',
              left: '27px',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '10px solid #ffffff',
            }}
          />
          {panel.caption}
        </div>
      )}

      {/* Navigation dots + counter */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        {total > 1 && (
          <div
            style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
            role="tablist"
            aria-label="Panel navigation"
          >
            {panels.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === displayed}
                aria-label={`Panel ${i + 1}`}
                onClick={() => navigate(i)}
                disabled={phase !== 'idle'}
                style={{
                  width: i === displayed ? '28px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  background: i === displayed ? '#1A1A1A' : '#aeadaa',
                  border: 'none',
                  padding: 0,
                  cursor: phase === 'idle' ? 'pointer' : 'default',
                  transition: 'width 0.25s, background 0.25s',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        )}

        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.78rem',
            color: '#5c5b59',
            letterSpacing: '0.03em',
          }}
        >
          {displayed + 1} / {total}
          {total > 1 && (
            <span style={{ opacity: 0.55, marginLeft: '0.5rem' }}>
              swipe or ← →
            </span>
          )}
        </div>
      </div>

      {/* Download Instagram-ready panel */}
      <button
        onClick={downloadPanel}
        disabled={downloading || isSvg(panel.image) || isPlaceholder(panel.image)}
        title="Downloads this panel at 1080×1350px (Instagram 4:5 portrait)"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: '#F2F0ED',
          border: '2px solid #1A1A1A',
          borderRadius: '8px',
          padding: '0.45rem 1rem',
          fontFamily: 'var(--font-headline)',
          fontWeight: 800,
          fontSize: '0.8rem',
          color: '#1A1A1A',
          cursor: downloading ? 'wait' : 'pointer',
          boxShadow: '2px 2px 0 0 #1A1A1A',
          opacity: downloading ? 0.6 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        {downloading ? '⏳ Exporting...' : '⬇ Download Panel (Instagram 4:5)'}
      </button>
    </div>
  )
}
