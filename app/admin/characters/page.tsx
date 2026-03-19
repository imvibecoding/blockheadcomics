'use client'

import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Character = {
  id: string; slug: string; name: string; tagline: string
  description: string; color: string; shape: string
  image: string; featured: boolean; order: number
}

export default function AdminCharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/characters').then(r => r.json()).then(setCharacters)
  }, [])

  async function deleteCharacter(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await fetch(`/api/characters/${id}`, { method: 'DELETE' })
      setCharacters(prev => prev.filter(c => c.id !== id))
    } finally {
      setDeleting(null)
    }
  }

  const sorted = [...characters].sort((a, b) => a.order - b.order)

  return (
    <AdminLayout>
      <div style={{ maxWidth: '800px' }}>
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
              Characters
            </h1>
            <p style={{ color: '#5c5b59', margin: 0, fontSize: '0.95rem' }}>
              {characters.length} character{characters.length !== 1 ? 's' : ''} in the cast
            </p>
          </div>
          <Link
            href="/admin/characters/new"
            className="wiggle-hover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#3BBFED',
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
            + New Character
          </Link>
        </div>

        {/* Character cards */}
        {sorted.length === 0 ? (
          <div
            style={{
              background: '#ffffff',
              border: '3px solid #1A1A1A',
              borderRadius: '12px',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '4px 4px 0 0 #1A1A1A',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎭</div>
            <p style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.2rem', margin: '0 0 0.5rem', color: '#1A1A1A' }}>
              No characters yet!
            </p>
            <Link href="/admin/characters/new" style={{ color: '#F5C800', fontWeight: 700 }}>
              Add the first character →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {sorted.map(char => (
              <div
                key={char.id}
                style={{
                  background: '#ffffff',
                  border: '3px solid #1A1A1A',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  boxShadow: '4px 4px 0 0 #1A1A1A',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                }}
              >
                {/* Character shape preview */}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    background: char.color,
                    border: '3px solid #1A1A1A',
                    borderRadius: char.shape === 'circle' ? '50%' : '8px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#1A1A1A', borderRadius: '50%' }} />
                    <div style={{ width: '8px', height: '8px', background: '#1A1A1A', borderRadius: '50%' }} />
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: '160px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '1.1rem', color: '#1A1A1A' }}>
                      {char.name}
                    </span>
                    {char.featured && <span title="Featured">⭐</span>}
                  </div>
                  <div style={{ color: '#5c5b59', fontSize: '0.85rem', fontStyle: 'italic' }}>&ldquo;{char.tagline}&rdquo;</div>
                  <div style={{ color: '#aeadaa', fontSize: '0.78rem', marginTop: '0.2rem' }}>{char.shape} &bull; Order: {char.order}</div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <Link
                    href={`/admin/characters/${char.id}/edit`}
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      color: '#1A1A1A',
                      textDecoration: 'none',
                      border: '2px solid #1A1A1A',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      background: '#F2F0ED',
                    }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteCharacter(char.id, char.name)}
                    disabled={deleting === char.id}
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      color: '#f95630',
                      border: '2px solid #f95630',
                      padding: '0.3rem 0.75rem',
                      borderRadius: '6px',
                      background: 'transparent',
                      cursor: 'pointer',
                      opacity: deleting === char.id ? 0.5 : 1,
                    }}
                  >
                    {deleting === char.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
