'use client'

import AdminLayout from '@/components/AdminLayout'
import { useState, useEffect } from 'react'

type SiteSettings = {
  siteTitle: string
  tagline: string
  description: string
  socialLinks: { instagram: string; twitter: string; facebook: string }
  copyrightYear: string
  aboutIntro: string
  creatorNote: string
  fanArtEmail: string
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 1rem',
  border: '3px solid #1A1A1A',
  borderRadius: '8px',
  fontFamily: 'var(--font-body)',
  fontSize: '0.95rem',
  color: '#1A1A1A',
  background: '#ffffff',
  outline: 'none',
  boxShadow: '3px 3px 0 0 #1A1A1A',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontWeight: 700,
  fontSize: '0.9rem',
  color: '#1A1A1A',
  marginBottom: '0.5rem',
}

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: '',
    tagline: '',
    description: '',
    socialLinks: { instagram: '', twitter: '', facebook: '' },
    copyrightYear: '',
    aboutIntro: '',
    creatorNote: '',
    fanArtEmail: '',
  })

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => {
        setSettings(data)
        setLoading(false)
      })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save settings')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '3rem', textAlign: 'center', color: '#5c5b59', fontFamily: 'var(--font-headline)', fontWeight: 800 }}>
          Loading...
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: '700px' }}>
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
            Settings
          </h1>
          <p style={{ color: '#5c5b59', margin: 0, fontSize: '0.95rem' }}>
            Manage your site settings and information.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Site Info */}
          <div
            style={{
              background: '#ffffff',
              border: '3px solid #1A1A1A',
              borderRadius: '12px',
              padding: '1.75rem',
              boxShadow: '4px 4px 0 0 #1A1A1A',
              marginBottom: '1.5rem',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 1.25rem', color: '#1A1A1A' }}>
              Site Info
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Site Title</label>
                <input
                  style={inputStyle}
                  value={settings.siteTitle}
                  onChange={e => setSettings(p => ({ ...p, siteTitle: e.target.value }))}
                  placeholder="Blockhead Comics"
                />
              </div>
              <div>
                <label style={labelStyle}>Tagline</label>
                <input
                  style={inputStyle}
                  value={settings.tagline}
                  onChange={e => setSettings(p => ({ ...p, tagline: e.target.value }))}
                  placeholder="Keep Smiling!"
                />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                  value={settings.description}
                  onChange={e => setSettings(p => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div>
                <label style={labelStyle}>Copyright Year</label>
                <input
                  style={inputStyle}
                  value={settings.copyrightYear}
                  onChange={e => setSettings(p => ({ ...p, copyrightYear: e.target.value }))}
                  placeholder="2024"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div
            style={{
              background: '#ffffff',
              border: '3px solid #1A1A1A',
              borderRadius: '12px',
              padding: '1.75rem',
              boxShadow: '4px 4px 0 0 #1A1A1A',
              marginBottom: '1.5rem',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 1.25rem', color: '#1A1A1A' }}>
              Social Links
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/...' },
                { key: 'twitter', label: 'Twitter/X URL', placeholder: 'https://twitter.com/...' },
                { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/...' },
              ].map(field => (
                <div key={field.key}>
                  <label style={labelStyle}>{field.label}</label>
                  <input
                    style={inputStyle}
                    type="url"
                    value={settings.socialLinks[field.key as keyof typeof settings.socialLinks]}
                    onChange={e => setSettings(p => ({
                      ...p,
                      socialLinks: { ...p.socialLinks, [field.key]: e.target.value }
                    }))}
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* About Page */}
          <div
            style={{
              background: '#ffffff',
              border: '3px solid #1A1A1A',
              borderRadius: '12px',
              padding: '1.75rem',
              boxShadow: '4px 4px 0 0 #1A1A1A',
              marginBottom: '1.5rem',
            }}
          >
            <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 1.25rem', color: '#1A1A1A' }}>
              About Page
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>About Intro</label>
                <p style={{ fontSize: '0.8rem', color: '#5c5b59', margin: '0 0 0.5rem' }}>
                  Separate paragraphs with a blank line. This is the main &ldquo;What is Blockhead Comics?&rdquo; text.
                </p>
                <textarea
                  style={{ ...inputStyle, minHeight: '140px', resize: 'vertical' }}
                  value={settings.aboutIntro}
                  onChange={e => setSettings(p => ({ ...p, aboutIntro: e.target.value }))}
                  placeholder="Blockhead Comics is a weekly comic strip..."
                />
              </div>
              <div>
                <label style={labelStyle}>Creator Note</label>
                <p style={{ fontSize: '0.8rem', color: '#5c5b59', margin: '0 0 0.5rem' }}>
                  The &ldquo;Why Blockhead?&rdquo; card on the about page.
                </p>
                <textarea
                  style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                  value={settings.creatorNote}
                  onChange={e => setSettings(p => ({ ...p, creatorNote: e.target.value }))}
                  placeholder="Because everyone needs a little more sunshine..."
                />
              </div>
              <div>
                <label style={labelStyle}>Fan Art Email</label>
                <input
                  style={inputStyle}
                  type="email"
                  value={settings.fanArtEmail}
                  onChange={e => setSettings(p => ({ ...p, fanArtEmail: e.target.value }))}
                  placeholder="fan@blockheadcomics.com"
                />
              </div>
            </div>
          </div>

          {/* Feedback */}
          {saved && (
            <div
              style={{
                background: '#f0fff4',
                border: '2px solid #22c55e',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                color: '#166534',
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>✓</span> Settings saved successfully!
            </div>
          )}
          {error && (
            <div style={{ background: '#fff0ed', border: '2px solid #f95630', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f95630', fontWeight: 700, marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="wiggle-hover"
            style={{
              background: '#F5C800',
              border: '3px solid #1A1A1A',
              borderRadius: '8px',
              padding: '0.75rem 1.75rem',
              fontFamily: 'var(--font-headline)',
              fontWeight: 900,
              fontSize: '1rem',
              color: '#1A1A1A',
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: '4px 4px 0 0 #1A1A1A',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Saving...' : 'Save Settings →'}
          </button>
        </form>
      </div>
    </AdminLayout>
  )
}
