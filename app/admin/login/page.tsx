'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Invalid password')
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#1A1A1A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        backgroundImage: 'radial-gradient(circle, #F5C800 1px, transparent 1px)',
        backgroundSize: '32px 32px',
        backgroundPosition: '0 0',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-headline)',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: '2.5rem',
              color: '#F5C800',
              textShadow: '4px 4px 0 #000000',
              lineHeight: 1,
              marginBottom: '0.25rem',
            }}
          >
            Blockhead
          </div>
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '0.8rem',
              color: '#5c5b59',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
            }}
          >
            Admin Panel
          </div>
        </div>

        {/* Login card */}
        <div
          style={{
            background: '#F2F0ED',
            border: '4px solid #F5C800',
            boxShadow: '8px 8px 0 0 #F5C800',
            borderRadius: '14px',
            padding: '2.5rem',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-headline)',
              fontWeight: 900,
              fontSize: '1.8rem',
              color: '#1A1A1A',
              margin: '0 0 0.25rem',
            }}
          >
            Welcome back!
          </h1>
          <p style={{ color: '#5c5b59', fontSize: '0.9rem', margin: '0 0 2rem' }}>
            Enter your password to access the admin panel.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#1A1A1A',
                  marginBottom: '0.5rem',
                }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  border: '3px solid #1A1A1A',
                  borderRadius: '8px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '1rem',
                  color: '#1A1A1A',
                  background: '#ffffff',
                  outline: 'none',
                  boxShadow: '3px 3px 0 0 #1A1A1A',
                  transition: 'box-shadow 0.15s',
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  background: '#fff0ed',
                  border: '2px solid #f95630',
                  borderRadius: '6px',
                  padding: '0.6rem 0.875rem',
                  color: '#f95630',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="wiggle-hover"
              style={{
                background: '#F5C800',
                border: '3px solid #1A1A1A',
                boxShadow: '5px 5px 0 0 #1A1A1A',
                borderRadius: '8px',
                padding: '0.85rem',
                fontFamily: 'var(--font-headline)',
                fontWeight: 900,
                fontSize: '1.1rem',
                color: '#1A1A1A',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              {loading ? 'Checking...' : 'Enter Admin →'}
            </button>
          </form>
        </div>

        {/* Back to site link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            href="/"
            style={{
              color: '#5c5b59',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            ← Back to Site
          </Link>
        </div>
      </div>
    </div>
  )
}
