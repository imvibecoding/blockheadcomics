'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

type ArtPiece = {
  id: string
  title: string
  description: string
  image: string
  category: string
  featured: boolean
  order: number
}

interface ArtLightboxProps {
  art: ArtPiece[]
}

function isGif(url: string) {
  return url.toLowerCase().includes('.gif')
}
function isSvg(url: string) {
  return url.toLowerCase().includes('.svg')
}

export default function ArtLightbox({ art }: ArtLightboxProps) {
  const sorted = [...art].sort((a, b) => a.order - b.order)
  const [selected, setSelected] = useState<ArtPiece | null>(null)
  const [selectedIdx, setSelectedIdx] = useState<number>(-1)

  const openPiece = useCallback((piece: ArtPiece, idx: number) => {
    setSelected(piece)
    setSelectedIdx(idx)
  }, [])

  const close = useCallback(() => {
    setSelected(null)
    setSelectedIdx(-1)
  }, [])

  const navigate = useCallback((dir: 1 | -1) => {
    const next = selectedIdx + dir
    if (next < 0 || next >= sorted.length) return
    setSelected(sorted[next])
    setSelectedIdx(next)
  }, [selectedIdx, sorted])

  // Keyboard navigation
  useEffect(() => {
    if (!selected) return
    function handler(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') navigate(1)
      if (e.key === 'ArrowLeft') navigate(-1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, navigate, close])

  // Prevent body scroll when modal open
  useEffect(() => {
    if (selected) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [selected])

  // Only the first featured piece gets the hero slot — all others go in the grid
  const featured = sorted.find(a => a.featured)
  const rest = sorted.filter(a => a.id !== featured?.id)

  return (
    <>
      {sorted.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: '#ffffff',
            border: '4px solid #1A1A1A',
            borderRadius: '16px',
            boxShadow: '6px 6px 0 0 #1A1A1A',
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎨</div>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '1.8rem', color: '#1A1A1A', margin: '0 0 0.75rem' }}>
            Coming Soon!
          </h2>
          <p style={{ color: '#5c5b59', fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>
            Original artwork is on the way. Check back soon!
          </p>
        </div>
      ) : (
        <>
          {/* Featured piece */}
          {featured && (
            <div
              className="comic-border"
              style={{
                background: '#1A1A1A',
                borderRadius: '16px',
                padding: '2.5rem',
                marginBottom: '3rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '2.5rem',
                alignItems: 'center',
              }}
            >
              <button
                onClick={() => openPiece(featured, sorted.indexOf(featured))}
                style={{
                  position: 'relative',
                  aspectRatio: '4/3',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '4px solid #F2F0ED',
                  boxShadow: '6px 6px 0 0 rgba(0,0,0,0.4)',
                  cursor: 'zoom-in',
                  background: '#2e2f2d',
                  padding: 0,
                  display: 'block',
                  width: '100%',
                  transition: 'transform 0.15s',
                }}
                aria-label={`View full size: ${featured.title}`}
              >
                {isGif(featured.image) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={featured.image} alt={featured.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                ) : (
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    unoptimized={isSvg(featured.image)}
                  />
                )}
                {/* Zoom hint */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    borderRadius: '6px',
                    padding: '0.2rem 0.5rem',
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    backdropFilter: 'blur(4px)',
                  }}
                >
                  🔍 Click to view
                </div>
              </button>

              <div>
                <div style={{ display: 'inline-block', background: '#3BBFED', color: '#1A1A1A', fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '0.8rem', padding: '0.2rem 0.7rem', borderRadius: '999px', border: '2px solid #F2F0ED', marginBottom: '0.75rem', letterSpacing: '0.05em' }}>
                  FEATURED
                </div>
                <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '2.5rem', color: '#F5C800', margin: '0 0 0.5rem', textShadow: '3px 3px 0 rgba(0,0,0,0.3)' }}>
                  {featured.title}
                </h2>
                <div style={{ display: 'inline-block', background: '#2e2f2d', color: '#aeadaa', fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '0.75rem', padding: '0.15rem 0.6rem', borderRadius: '4px', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '1rem' }}>
                  {featured.category}
                </div>
                {featured.description && (
                  <p style={{ color: '#e4e2df', fontSize: '1rem', lineHeight: 1.7, margin: '0 0 1.25rem' }}>
                    {featured.description}
                  </p>
                )}
                <button
                  onClick={() => openPiece(featured, sorted.indexOf(featured))}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#F5C800', border: '3px solid #F2F0ED', borderRadius: '8px', padding: '0.6rem 1.25rem', fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '0.9rem', color: '#1A1A1A', cursor: 'pointer' }}
                >
                  🔍 View Full Size
                </button>
              </div>
            </div>
          )}

          {/* Grid of remaining pieces */}
          {rest.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {rest.map((piece, i) => {
                const rotations = [1.5, -1.5, 1, -1, 0.8]
                const rot = rotations[i % rotations.length]
                const sortedIdx = sorted.indexOf(piece)
                return (
                  <button
                    key={piece.id}
                    className="comic-border"
                    onClick={() => openPiece(piece, sortedIdx)}
                    style={{
                      background: '#ffffff',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      transform: `rotate(${rot}deg)`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'zoom-in',
                      display: 'block',
                      padding: 0,
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    {/* Image */}
                    <div style={{ position: 'relative', aspectRatio: '4/3', background: '#F2F0ED' }}>
                      {isGif(piece.image) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={piece.image} alt={piece.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                      ) : (
                        <Image
                          src={piece.image}
                          alt={piece.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          unoptimized={isSvg(piece.image)}
                        />
                      )}
                      {/* Category badge */}
                      <div style={{ position: 'absolute', top: '10px', left: '10px', background: '#1A1A1A', color: '#F5C800', fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase' as const, letterSpacing: '0.08em' }}>
                        {piece.category}
                      </div>
                      {/* Zoom hint on hover */}
                      <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.55)', color: '#fff', borderRadius: '5px', padding: '0.15rem 0.4rem', fontSize: '0.65rem', fontFamily: 'var(--font-headline)', fontWeight: 700 }}>
                        🔍
                      </div>
                    </div>
                    {/* Info */}
                    <div style={{ padding: '1.25rem' }}>
                      <h3 style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '1.3rem', color: '#1A1A1A', margin: '0 0 0.4rem' }}>
                        {piece.title}
                      </h3>
                      {piece.description && (
                        <p style={{ color: '#5c5b59', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                          {piece.description}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ── Lightbox overlay ─────────────────────────────────────────────── */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(0, 0, 0, 0.92)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
          onClick={close}
        >
          {/* Content — stop click propagation so clicking image doesn't close */}
          <div
            onClick={e => e.stopPropagation()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              maxWidth: 'min(90vw, 900px)',
              maxHeight: '90vh',
              width: '100%',
            }}
          >
            {/* Top bar: title + close */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '1rem' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', color: '#F5C800' }}>
                  {selected.title}
                </div>
                <div style={{ display: 'inline-block', background: '#2e2f2d', color: '#aeadaa', fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '3px', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginTop: '0.2rem' }}>
                  {selected.category}
                </div>
              </div>
              <button
                onClick={close}
                aria-label="Close"
                style={{ background: '#2e2f2d', border: '2px solid #5c5b59', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#F2F0ED', fontSize: '1.1rem', flexShrink: 0 }}
              >
                ✕
              </button>
            </div>

            {/* Image */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                maxHeight: 'calc(90vh - 160px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: '10px',
                border: '3px solid #5c5b59',
              }}
            >
              {isGif(selected.image) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.image}
                  alt={selected.title}
                  style={{ maxWidth: '100%', maxHeight: 'calc(90vh - 160px)', objectFit: 'contain', display: 'block', borderRadius: '8px' }}
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={selected.image}
                  alt={selected.title}
                  style={{ maxWidth: '100%', maxHeight: 'calc(90vh - 160px)', objectFit: 'contain', display: 'block', borderRadius: '8px' }}
                />
              )}
            </div>

            {/* Description + navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {selected.description && (
                  <p style={{ color: '#aeadaa', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                    {selected.description}
                  </p>
                )}
              </div>

              {/* Prev / Next */}
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  onClick={() => navigate(-1)}
                  disabled={selectedIdx <= 0}
                  aria-label="Previous artwork"
                  style={{ background: '#2e2f2d', border: '2px solid #5c5b59', borderRadius: '8px', padding: '0.5rem 1rem', color: selectedIdx <= 0 ? '#5c5b59' : '#F2F0ED', fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.9rem', cursor: selectedIdx <= 0 ? 'default' : 'pointer' }}
                >
                  ← Prev
                </button>
                <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '0.8rem', color: '#5c5b59', display: 'flex', alignItems: 'center' }}>
                  {selectedIdx + 1} / {sorted.length}
                </div>
                <button
                  onClick={() => navigate(1)}
                  disabled={selectedIdx >= sorted.length - 1}
                  aria-label="Next artwork"
                  style={{ background: '#2e2f2d', border: '2px solid #5c5b59', borderRadius: '8px', padding: '0.5rem 1rem', color: selectedIdx >= sorted.length - 1 ? '#5c5b59' : '#F2F0ED', fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.9rem', cursor: selectedIdx >= sorted.length - 1 ? 'default' : 'pointer' }}
                >
                  Next →
                </button>
              </div>
            </div>
          </div>

          {/* Click backdrop hint */}
          <p style={{ position: 'absolute', bottom: '1rem', color: '#5c5b59', fontSize: '0.75rem', fontFamily: 'var(--font-body)' }}>
            Click outside or press Esc to close
          </p>
        </div>
      )}
    </>
  )
}
