'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'

type Panel = { id: string; image: string; caption: string; order: number }
type Comic = {
  id: string; slug: string; title: string; stripNumber: number
  publishedAt: string; series: string; panels: Panel[]
  tags: string[]; featured: boolean
}

export default function ComicsArchivePage() {
  const [comics, setComics] = useState<Comic[]>([])
  const [search, setSearch] = useState('')
  const [activeSeries, setActiveSeries] = useState('All')

  useEffect(() => {
    fetch('/api/comics').then(r => r.json()).then(setComics)
  }, [])

  const allSeries = ['All', ...Array.from(new Set(comics.map(c => c.series)))]

  const filtered = comics.filter(c => {
    const matchSeries = activeSeries === 'All' || c.series === activeSeries
    const q = search.toLowerCase()
    const matchSearch = !q ||
      c.title.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    return matchSeries && matchSearch
  })

  return (
    <>
      <Navigation />
      <main className="max-w-6xl mx-auto px-4 md:px-8 py-12">
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div
            style={{
              display: 'inline-block',
              background: '#1A1A1A',
              color: '#F5C800',
              fontFamily: 'var(--font-headline)',
              fontWeight: 800,
              fontSize: '0.8rem',
              padding: '0.2rem 0.7rem',
              borderRadius: '4px',
              letterSpacing: '0.1em',
              marginBottom: '0.75rem',
            }}
          >
            ARCHIVE
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-headline)',
              fontWeight: 900,
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              color: '#1A1A1A',
              margin: '0 0 0.5rem',
              textShadow: '4px 4px 0 #F5C800',
            }}
          >
            COMICS
          </h1>
          <p style={{ color: '#5c5b59', fontSize: '1rem', margin: 0 }}>
            {comics.length} strips and counting. Start from the beginning or dive right in!
          </p>
        </div>

        {/* Search + Filter bar */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          {/* Search input */}
          <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
            <span
              style={{
                position: 'absolute',
                left: '0.875rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '1.1rem',
                pointerEvents: 'none',
              }}
            >
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search comics..."
              style={{
                width: '100%',
                padding: '0.65rem 1rem 0.65rem 2.5rem',
                border: '3px solid #1A1A1A',
                borderRadius: '8px',
                background: '#ffffff',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#1A1A1A',
                outline: 'none',
                boxShadow: '3px 3px 0 0 #1A1A1A',
              }}
            />
          </div>

          {/* Series filter buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {allSeries.map(series => (
              <button
                key={series}
                onClick={() => setActiveSeries(series)}
                style={{
                  padding: '0.5rem 1rem',
                  border: '3px solid #1A1A1A',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  ...(activeSeries === series
                    ? { background: '#F5C800', color: '#1A1A1A', boxShadow: '3px 3px 0 0 #1A1A1A' }
                    : { background: '#ffffff', color: '#1A1A1A', boxShadow: '2px 2px 0 0 #1A1A1A' }),
                }}
              >
                {series}
              </button>
            ))}
          </div>
        </div>

        {/* Comics grid */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              fontFamily: 'var(--font-headline)',
              fontWeight: 800,
              fontSize: '1.5rem',
              color: '#5c5b59',
            }}
          >
            No comics found. Try a different search!
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {filtered.map((comic, i) => {
              const rotations = [-1, 0.5, -0.5, 1, 0]
              const rot = rotations[i % rotations.length]
              const firstPanel = comic.panels[0]
              return (
                <Link
                  key={comic.id}
                  href={`/comics/${comic.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <article
                    className="comic-border"
                    style={{
                      background: '#ffffff',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      transform: `rotate(${rot}deg)`,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'pointer',
                    }}
                  >
                    {/* Panel preview */}
                    <div
                      style={{
                        position: 'relative',
                        aspectRatio: '4/3',
                        background: '#F2F0ED',
                        borderBottom: '3px solid #1A1A1A',
                      }}
                    >
                      {firstPanel && (
                        <Image
                          src={firstPanel.image}
                          alt={comic.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          unoptimized={firstPanel.image.endsWith('.svg')}
                        />
                      )}
                      {/* Strip number badge */}
                      <div
                        style={{
                          position: 'absolute',
                          top: '8px',
                          left: '8px',
                          background: '#F5C800',
                          border: '2px solid #1A1A1A',
                          borderRadius: '4px',
                          padding: '0.1rem 0.5rem',
                          fontFamily: 'var(--font-headline)',
                          fontWeight: 900,
                          fontSize: '0.75rem',
                          color: '#1A1A1A',
                        }}
                      >
                        #{comic.stripNumber}
                      </div>
                      {/* Panel count */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          background: '#1A1A1A',
                          borderRadius: '4px',
                          padding: '0.1rem 0.5rem',
                          fontFamily: 'var(--font-headline)',
                          fontWeight: 700,
                          fontSize: '0.7rem',
                          color: '#F5C800',
                        }}
                      >
                        {comic.panels.length} panels
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <h2
                          style={{
                            fontFamily: 'var(--font-headline)',
                            fontWeight: 900,
                            fontSize: '1.1rem',
                            color: '#1A1A1A',
                            margin: 0,
                            flex: 1,
                          }}
                        >
                          {comic.title}
                        </h2>
                        {comic.featured && (
                          <span style={{ fontSize: '1.1rem' }} title="Featured">⭐</span>
                        )}
                      </div>
                      <div
                        style={{
                          marginTop: '0.5rem',
                          display: 'flex',
                          gap: '0.4rem',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            background: '#3BBFED',
                            border: '1.5px solid #1A1A1A',
                            borderRadius: '4px',
                            padding: '0.1rem 0.5rem',
                            fontFamily: 'var(--font-body)',
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            color: '#1A1A1A',
                          }}
                        >
                          {comic.series}
                        </span>
                        <span style={{ color: '#aeadaa', fontSize: '0.78rem', fontWeight: 600 }}>
                          {new Date(comic.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      {comic.tags.length > 0 && (
                        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                          {comic.tags.map(tag => (
                            <span
                              key={tag}
                              style={{
                                background: '#F2F0ED',
                                border: '1.5px solid #aeadaa',
                                borderRadius: '4px',
                                padding: '0.05rem 0.45rem',
                                fontFamily: 'var(--font-body)',
                                fontSize: '0.7rem',
                                color: '#5c5b59',
                                fontWeight: 600,
                              }}
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
