'use client'

import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Comic = {
  id: string; slug: string; title: string; stripNumber: number
  publishedAt: string; series: string; panels: unknown[]; tags: string[]; featured: boolean
}

export default function AdminComicsPage() {
  const [comics, setComics] = useState<Comic[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/comics').then(r => r.json()).then(setComics)
  }, [])

  async function deleteComic(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await fetch(`/api/comics/${id}`, { method: 'DELETE' })
      setComics(prev => prev.filter(c => c.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  const sorted = [...comics].sort((a, b) => b.stripNumber - a.stripNumber)

  return (
    <AdminLayout>
      <div style={{ maxWidth: '900px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-headline)',
                fontWeight: 900,
                fontSize: '2.2rem',
                color: '#1A1A1A',
                margin: '0 0 0.25rem',
              }}
            >
              Comics
            </h1>
            <p style={{ color: '#5c5b59', margin: 0, fontSize: '0.95rem' }}>
              {comics.length} comic{comics.length !== 1 ? 's' : ''} in the archive
            </p>
          </div>
          <Link
            href="/admin/comics/new"
            className="wiggle-hover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#F5C800',
              border: '3px solid #1A1A1A',
              borderRadius: '8px',
              padding: '0.65rem 1.25rem',
              fontFamily: 'var(--font-headline)',
              fontWeight: 900,
              fontSize: '0.95rem',
              color: '#1A1A1A',
              textDecoration: 'none',
              boxShadow: '4px 4px 0 0 #1A1A1A',
            }}
          >
            + New Comic
          </Link>
        </div>

        {/* Table */}
        <div
          style={{
            background: '#ffffff',
            border: '3px solid #1A1A1A',
            borderRadius: '12px',
            boxShadow: '5px 5px 0 0 #1A1A1A',
            overflow: 'hidden',
          }}
        >
          {sorted.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#5c5b59' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📭</div>
              <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.2rem', margin: '0 0 0.5rem', color: '#1A1A1A' }}>
                No comics yet!
              </p>
              <Link href="/admin/comics/new" style={{ color: '#F5C800', fontWeight: 700 }}>
                Add your first strip →
              </Link>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F2F0ED', borderBottom: '2px solid #1A1A1A' }}>
                  {['Strip', 'Title', 'Series', 'Published', 'Panels', 'Actions'].map(h => (
                    <th
                      key={h}
                      style={{
                        padding: '0.875rem 1rem',
                        fontFamily: 'var(--font-headline)',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        color: '#1A1A1A',
                        textAlign: 'left',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((comic, i) => (
                  <tr
                    key={comic.id}
                    style={{
                      borderBottom: i < sorted.length - 1 ? '1px solid #e4e2df' : 'none',
                      background: comic.featured ? '#fffdf0' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <span
                        style={{
                          background: '#F5C800',
                          border: '2px solid #1A1A1A',
                          borderRadius: '4px',
                          padding: '0.1rem 0.5rem',
                          fontFamily: 'var(--font-headline)',
                          fontWeight: 900,
                          fontSize: '0.8rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        #{comic.stripNumber}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{comic.title}</span>
                        {comic.featured && <span title="Featured">⭐</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#aeadaa', marginTop: '0.1rem' }}>/{comic.slug}</div>
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#5c5b59' }}>{comic.series}</td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#5c5b59', whiteSpace: 'nowrap' }}>
                      {new Date(comic.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#5c5b59', textAlign: 'center' }}>
                      {comic.panels.length}
                    </td>
                    <td style={{ padding: '0.75rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'nowrap' }}>
                        <Link
                          href={`/comics/${comic.slug}`}
                          target="_blank"
                          style={{
                            fontFamily: 'var(--font-headline)',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            color: '#1A1A1A',
                            textDecoration: 'none',
                            border: '2px solid #aeadaa',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/comics/${comic.id}/edit`}
                          style={{
                            fontFamily: 'var(--font-headline)',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            color: '#1A1A1A',
                            textDecoration: 'none',
                            border: '2px solid #1A1A1A',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            background: '#F2F0ED',
                          }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteComic(comic.id, comic.title)}
                          disabled={deleting === comic.id}
                          style={{
                            fontFamily: 'var(--font-headline)',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            color: '#f95630',
                            border: '2px solid #f95630',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '4px',
                            background: 'transparent',
                            cursor: 'pointer',
                            opacity: deleting === comic.id ? 0.5 : 1,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {deleting === comic.id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
