'use client'

import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

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

export default function NewCharacterPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    color: '#F5C800',
    shape: 'square',
    image: '/placeholder-character.svg',
    featured: false,
    order: '1',
  })

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    setForm(prev => ({ ...prev, name, slug: generateSlug(name) }))
  }

  async function uploadImage(file: File) {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setForm(p => ({ ...p, image: data.url }))
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { ...form, order: parseInt(form.order) || 1 }
      const res = await fetch('/api/characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        router.push('/admin/characters')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div style={{ maxWidth: '700px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link href="/admin/characters" style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.9rem', color: '#5c5b59', textDecoration: 'none' }}>
            ← Characters
          </Link>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '2rem', color: '#1A1A1A', margin: 0 }}>
            New Character
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Name *</label>
                <input style={inputStyle} value={form.name} onChange={handleNameChange} required placeholder="e.g. Blockhead" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Slug</label>
                <input style={{ ...inputStyle, background: '#F2F0ED', color: '#5c5b59' }} value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Tagline *</label>
                <input style={inputStyle} value={form.tagline} onChange={e => setForm(p => ({ ...p, tagline: e.target.value }))} required placeholder="e.g. 100% Sunny!" />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Description *</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  required
                  placeholder="Tell us about this character..."
                />
              </div>
              <div>
                <label style={labelStyle}>Color</label>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={form.color}
                    onChange={e => setForm(p => ({ ...p, color: e.target.value }))}
                    style={{ width: '50px', height: '44px', border: '3px solid #1A1A1A', borderRadius: '6px', cursor: 'pointer' }}
                  />
                  <input style={{ ...inputStyle, flex: 1 }} value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Shape</label>
                <select
                  style={{ ...inputStyle }}
                  value={form.shape}
                  onChange={e => setForm(p => ({ ...p, shape: e.target.value }))}
                >
                  <option value="square">Square</option>
                  <option value="circle">Circle</option>
                  <option value="rectangle">Rectangle</option>
                  <option value="triangle">Triangle</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Display Order</label>
                <input style={inputStyle} type="number" min="1" value={form.order} onChange={e => setForm(p => ({ ...p, order: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Image</label>
                {form.image && form.image !== '/placeholder-character.svg' && (
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      border: '2px solid #1A1A1A',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: form.color || '#F2F0ED',
                      marginBottom: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.image}
                      alt="Character preview"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (file) uploadImage(file)
                  }}
                  disabled={uploading}
                  style={{ fontSize: '0.85rem' }}
                />
                {uploading && <span style={{ fontSize: '0.78rem', color: '#5c5b59' }}>Uploading...</span>}
                {!uploading && form.image !== '/placeholder-character.svg' && (
                  <div style={{ fontSize: '0.78rem', color: '#22c55e', marginTop: '0.25rem' }}>✓ Image set</div>
                )}
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="featured" style={{ ...labelStyle, margin: 0, cursor: 'pointer' }}>
                  Main character (featured)
                </label>
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fff0ed', border: '2px solid #f95630', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f95630', fontWeight: 700, marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              type="submit"
              disabled={saving}
              className="wiggle-hover"
              style={{
                background: '#3BBFED',
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
              {saving ? 'Saving...' : 'Add Character →'}
            </button>
            <Link
              href="/admin/characters"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: '#F2F0ED',
                border: '3px solid #1A1A1A',
                borderRadius: '8px',
                padding: '0.75rem 1.25rem',
                fontFamily: 'var(--font-headline)',
                fontWeight: 800,
                fontSize: '0.95rem',
                color: '#1A1A1A',
                textDecoration: 'none',
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
