'use client'

import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Comic = { id: string; title: string; stripNumber: number; publishedAt: string; series: string }
type Character = { id: string; name: string }

function StatCard({ label, value, color, icon }: { label: string; value: string | number; color: string; icon: string }) {
  return (
    <div
      style={{
        background: '#ffffff',
        border: '3px solid #1A1A1A',
        borderRadius: '10px',
        padding: '1.5rem',
        boxShadow: '4px 4px 0 0 #1A1A1A',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <div style={{ fontSize: '1.8rem' }}>{icon}</div>
      <div
        style={{
          fontFamily: 'var(--font-headline)',
          fontWeight: 900,
          fontSize: '2.5rem',
          color,
          lineHeight: 1,
          textShadow: '3px 3px 0 #1A1A1A',
        }}
      >
        {value}
      </div>
      <div style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.9rem', color: '#5c5b59' }}>
        {label}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [comics, setComics] = useState<Comic[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [isVercel, setIsVercel] = useState(false)

  useEffect(() => {
    fetch('/api/comics').then(r => r.json()).then(setComics)
    fetch('/api/characters').then(r => r.json()).then(setCharacters)
    // Detect Vercel by checking hostname
    setIsVercel(
      window.location.hostname.endsWith('.vercel.app') ||
      window.location.hostname === 'www.blockheadcomics.com' ||
      window.location.hostname === 'blockheadcomics.com'
    )
  }, [])

  const recentComics = [...comics]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 5)

  return (
    <AdminLayout>
      <div style={{ maxWidth: '900px' }}>
        {/* Vercel notice */}
        {isVercel && (
          <div
            style={{
              background: '#fffbeb',
              border: '2px solid #F5C800',
              borderRadius: '10px',
              padding: '1rem 1.25rem',
              marginBottom: '1.75rem',
              display: 'flex',
              gap: '0.75rem',
              alignItems: 'flex-start',
            }}
          >
            <span style={{ fontSize: '1.25rem', flexShrink: 0, lineHeight: 1.4 }}>⚠️</span>
            <div>
              <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.95rem', color: '#1A1A1A', marginBottom: '0.2rem' }}>
                Running on Vercel — changes won&apos;t persist
              </div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.85rem', color: '#5c5b59', lineHeight: 1.5 }}>
                The file-based storage can&apos;t write on Vercel. To update content: edit the JSON files locally, add images to{' '}
                <code style={{ background: '#F2F0ED', padding: '0.1rem 0.3rem', borderRadius: '3px', fontSize: '0.8rem' }}>public/uploads/</code>, then{' '}
                <code style={{ background: '#F2F0ED', padding: '0.1rem 0.3rem', borderRadius: '3px', fontSize: '0.8rem' }}>git push</code> to deploy.{' '}
                Ask about Supabase integration when you&apos;re ready for live editing.
              </div>
            </div>
          </div>
        )}

        {/* Page title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1
            style={{
              fontFamily: 'var(--font-headline)',
              fontWeight: 900,
              fontSize: '2.2rem',
              color: '#1A1A1A',
              margin: '0 0 0.25rem',
            }}
          >
            Dashboard
          </h1>
          <p style={{ color: '#5c5b59', margin: 0, fontSize: '0.95rem' }}>
            Welcome back! Here&apos;s what&apos;s going on with Blockhead Comics.
          </p>
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2.5rem',
          }}
        >
          <StatCard label="Total Comics" value={comics.length} color="#F5C800" icon="📚" />
          <StatCard label="Characters" value={characters.length} color="#3BBFED" icon="🎭" />
          <StatCard
            label="Latest Strip"
            value={comics.length > 0 ? `#${Math.max(...comics.map(c => c.stripNumber))}` : '--'}
            color="#1A1A1A"
            icon="⭐"
          />
          <StatCard
            label="Series"
            value={Array.from(new Set(comics.map(c => c.series))).length}
            color="#f95630"
            icon="🗂️"
          />
        </div>

        {/* Quick actions */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h2
            style={{
              fontFamily: 'var(--font-headline)',
              fontWeight: 800,
              fontSize: '1.2rem',
              color: '#1A1A1A',
              margin: '0 0 1rem',
            }}
          >
            Quick Actions
          </h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {[
              { href: '/admin/comics/new', label: '+ New Comic', bg: '#F5C800', color: '#1A1A1A' },
              { href: '/admin/characters/new', label: '+ New Character', bg: '#3BBFED', color: '#1A1A1A' },
              { href: '/admin/comics', label: 'Manage Comics', bg: '#ffffff', color: '#1A1A1A' },
              { href: '/admin/settings', label: 'Settings', bg: '#1A1A1A', color: '#F5C800' },
            ].map(action => (
              <Link
                key={action.href}
                href={action.href}
                className="wiggle-hover"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: action.bg,
                  color: action.color,
                  border: '3px solid #1A1A1A',
                  borderRadius: '8px',
                  padding: '0.6rem 1.25rem',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0 0 #1A1A1A',
                }}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent comics */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2
              style={{
                fontFamily: 'var(--font-headline)',
                fontWeight: 800,
                fontSize: '1.2rem',
                color: '#1A1A1A',
                margin: 0,
              }}
            >
              Recent Comics
            </h2>
            <Link
              href="/admin/comics"
              style={{
                fontFamily: 'var(--font-headline)',
                fontWeight: 800,
                fontSize: '0.85rem',
                color: '#1A1A1A',
                textDecoration: 'none',
                border: '2px solid #1A1A1A',
                padding: '0.25rem 0.75rem',
                borderRadius: '6px',
              }}
            >
              View All →
            </Link>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '3px solid #1A1A1A',
              borderRadius: '10px',
              boxShadow: '4px 4px 0 0 #1A1A1A',
              overflow: 'hidden',
            }}
          >
            {recentComics.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#5c5b59', fontWeight: 600 }}>
                No comics yet. <Link href="/admin/comics/new" style={{ color: '#F5C800' }}>Add the first one!</Link>
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F2F0ED', borderBottom: '2px solid #1A1A1A' }}>
                    {['#', 'Title', 'Series', 'Published', 'Actions'].map(h => (
                      <th
                        key={h}
                        style={{
                          padding: '0.75rem 1rem',
                          fontFamily: 'var(--font-headline)',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          color: '#1A1A1A',
                          textAlign: 'left',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentComics.map((comic, i) => (
                    <tr
                      key={comic.id}
                      style={{
                        borderBottom: i < recentComics.length - 1 ? '1px solid #e4e2df' : 'none',
                      }}
                    >
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span
                          style={{
                            background: '#F5C800',
                            border: '1.5px solid #1A1A1A',
                            borderRadius: '4px',
                            padding: '0.1rem 0.4rem',
                            fontFamily: 'var(--font-headline)',
                            fontWeight: 900,
                            fontSize: '0.8rem',
                          }}
                        >
                          {comic.stripNumber}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: 700, fontSize: '0.9rem' }}>{comic.title}</td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#5c5b59' }}>{comic.series}</td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.85rem', color: '#5c5b59' }}>
                        {new Date(comic.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <Link
                          href={`/admin/comics/${comic.id}/edit`}
                          style={{
                            fontFamily: 'var(--font-headline)',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            color: '#1A1A1A',
                            textDecoration: 'none',
                            border: '2px solid #1A1A1A',
                            padding: '0.15rem 0.6rem',
                            borderRadius: '4px',
                          }}
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
