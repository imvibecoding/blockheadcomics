'use client'

import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import { useState, useEffect } from 'react'

type ArtPiece = {
  id: string
  title: string
  description: string
  image: string
  category: string
  publishedAt: string
  featured: boolean
  order: number
}

export default function AdminArtPage() {
  const [art, setArt] = useState<ArtPiece[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/art')
      .then(r => r.json())
      .then(data => {
        setArt(Array.isArray(data) ? data.sort((a: ArtPiece, b: ArtPiece) => a.order - b.order) : [])
        setLoading(false)
      })
  }, [])

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await fetch(`/api/art/${id}`, { method: 'DELETE' })
      setArt(prev => prev.filter(a => a.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  return (
    <AdminLayout>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '2.2rem', color: '#1A1A1A', margin: '0 0 0.25rem' }}>
              Art Gallery
            </h1>
            <p style={{ color: '#5c5b59', margin: 0, fontSize: '0.95rem' }}>
              {art.length} piece{art.length !== 1 ? 's' : ''} uploaded
            </p>
          </div>
          <Link
            href="/admin/art/new"
            className="wiggle-hover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#3BBFED',
              border: '3px solid #1A1A1A',
              borderRadius: '8px',
              padding: '0.65rem 1.5rem',
              fontFamily: 'var(--font-headline)',
              fontWeight: 900,
              fontSize: '0.95rem',
              color: '#1A1A1A',
              textDecoration: 'none',
              boxShadow: '4px 4px 0 0 #1A1A1A',
            }}
          >
            + Upload Art
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#5c5b59', fontFamily: 'var(--font-headline)', fontWeight: 800 }}>
            Loading...
          </div>
        ) : art.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: '#ffffff',
              border: '3px solid #1A1A1A',
              borderRadius: '12px',
              boxShadow: '4px 4px 0 0 #1A1A1A',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '1.5rem', color: '#1A1A1A', margin: '0 0 0.5rem' }}>
              No art uploaded yet
            </h2>
            <p style={{ color: '#5c5b59', marginBottom: '1.5rem' }}>Upload your first piece to get started.</p>
            <Link
              href="/admin/art/new"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#3BBFED',
                border: '3px solid #1A1A1A',
                borderRadius: '8px',
                padding: '0.65rem 1.5rem',
                fontFamily: 'var(--font-headline)',
                fontWeight: 900,
                fontSize: '0.95rem',
                color: '#1A1A1A',
                textDecoration: 'none',
                boxShadow: '3px 3px 0 0 #1A1A1A',
              }}
            >
              Upload First Piece →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {art.map(piece => (
              <div
                key={piece.id}
                style={{
                  background: '#ffffff',
                  border: '3px solid #1A1A1A',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '4px 4px 0 0 #1A1A1A',
                }}
              >
                {/* Thumbnail */}
                <div style={{ position: 'relative', aspectRatio: '4/3', background: '#F2F0ED' }}>
                  {piece.image && piece.image !== '/placeholder-character.svg' ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={piece.image}
                      alt={piece.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem' }}>
                      🖼️
                    </div>
                  )}
                  {piece.featured && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: '#F5C800',
                        border: '2px solid #1A1A1A',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.9rem',
                      }}
                    >
                      ⭐
                    </div>
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      background: '#1A1A1A',
                      color: '#F5C800',
                      fontFamily: 'var(--font-headline)',
                      fontWeight: 800,
                      fontSize: '0.65rem',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '3px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {piece.category}
                  </div>
                </div>

                {/* Info + actions */}
                <div style={{ padding: '0.875rem 1rem' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontWeight: 900,
                      fontSize: '1rem',
                      color: '#1A1A1A',
                      marginBottom: '0.25rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {piece.title}
                  </div>
                  {piece.description && (
                    <p
                      style={{
                        color: '#5c5b59',
                        fontSize: '0.8rem',
                        margin: '0 0 0.75rem',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {piece.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link
                      href={`/admin/art/${piece.id}/edit`}
                      style={{
                        flex: 1,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#F5C800',
                        border: '2px solid #1A1A1A',
                        borderRadius: '6px',
                        padding: '0.4rem 0.75rem',
                        fontFamily: 'var(--font-headline)',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: '#1A1A1A',
                        textDecoration: 'none',
                        boxShadow: '2px 2px 0 0 #1A1A1A',
                      }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(piece.id, piece.title)}
                      disabled={deleting === piece.id}
                      style={{
                        background: '#fff0ed',
                        border: '2px solid #f95630',
                        borderRadius: '6px',
                        padding: '0.4rem 0.75rem',
                        fontFamily: 'var(--font-headline)',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: '#f95630',
                        cursor: deleting === piece.id ? 'not-allowed' : 'pointer',
                        opacity: deleting === piece.id ? 0.6 : 1,
                      }}
                    >
                      {deleting === piece.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
