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

const ART_CATEGORIES = ['character', 'comic', 'landscape', 'fan art', 'general']

export default function NewArtPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    image: '',
    category: 'general',
    publishedAt: new Date().toISOString().split('T')[0],
    featured: false,
    order: '1',
  })

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
    if (!form.image) {
      setError('Please upload an image.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        order: parseInt(form.order) || 1,
        publishedAt: new Date(form.publishedAt).toISOString(),
      }
      const res = await fetch('/api/art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        router.push('/admin/art')
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
          <Link href="/admin/art" style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.9rem', color: '#5c5b59', textDecoration: 'none' }}>
            ← Art Gallery
          </Link>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '2rem', color: '#1A1A1A', margin: 0 }}>
            Upload Art
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              {/* Image upload — prominent */}
              <div>
                <label style={labelStyle}>Artwork Image *</label>
                {form.image ? (
                  <div style={{ marginBottom: '0.75rem' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.image}
                      alt="Preview"
                      style={{
                        width: '100%',
                        maxHeight: '300px',
                        objectFit: 'contain',
                        border: '3px solid #1A1A1A',
                        borderRadius: '8px',
                        background: '#F2F0ED',
                        display: 'block',
                      }}
                    />
                    <div style={{ fontSize: '0.8rem', color: '#22c55e', marginTop: '0.4rem', fontWeight: 700 }}>✓ Image uploaded</div>
                  </div>
                ) : (
                  <div
                    style={{
                      border: '3px dashed #1A1A1A',
                      borderRadius: '12px',
                      padding: '2rem',
                      textAlign: 'center',
                      background: '#F2F0ED',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🖼️</div>
                    <p style={{ color: '#5c5b59', fontSize: '0.9rem', margin: 0 }}>Upload your artwork below</p>
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
              </div>

              <div>
                <label style={labelStyle}>Title *</label>
                <input
                  style={inputStyle}
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  required
                  placeholder="e.g. Blockhead in the Rain"
                />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '90px', resize: 'vertical' }}
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="A short description of this piece..."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Category</label>
                  <select
                    style={inputStyle}
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                  >
                    {ART_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Date</label>
                  <input
                    style={inputStyle}
                    type="date"
                    value={form.publishedAt}
                    onChange={e => setForm(p => ({ ...p, publishedAt: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Display Order</label>
                <input
                  style={{ ...inputStyle, width: '120px' }}
                  type="number"
                  min="1"
                  value={form.order}
                  onChange={e => setForm(p => ({ ...p, order: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="featured" style={{ ...labelStyle, margin: 0, cursor: 'pointer' }}>
                  Featured (shown as hero piece on the art page)
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
              disabled={saving || uploading}
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
                cursor: (saving || uploading) ? 'not-allowed' : 'pointer',
                boxShadow: '4px 4px 0 0 #1A1A1A',
                opacity: (saving || uploading) ? 0.7 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Upload Piece →'}
            </button>
            <Link
              href="/admin/art"
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
