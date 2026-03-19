'use client'

import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'

type Panel = { id: string; image: string; caption: string; order: number }
type Comic = {
  id: string; slug: string; title: string; stripNumber: number
  publishedAt: string; series: string; panels: Panel[]
  tags: string[]; featured: boolean
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

export default function EditComicPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState<string | null>(null)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    stripNumber: '',
    publishedAt: '',
    series: '',
    tags: '',
    featured: false,
  })
  const [panels, setPanels] = useState<Panel[]>([])

  const loadComic = useCallback(async () => {
    try {
      const res = await fetch(`/api/comics/${id}`)
      if (!res.ok) { router.push('/admin/comics'); return }
      const comic: Comic = await res.json()
      setForm({
        title: comic.title,
        slug: comic.slug,
        stripNumber: comic.stripNumber.toString(),
        publishedAt: comic.publishedAt,
        series: comic.series,
        tags: comic.tags.join(', '),
        featured: comic.featured,
      })
      setPanels(comic.panels.sort((a, b) => a.order - b.order))
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => { loadComic() }, [loadComic])

  function addPanel() {
    const newId = Date.now().toString()
    setPanels(prev => [...prev, { id: newId, image: '/placeholder-panel.svg', caption: '', order: prev.length + 1 }])
  }

  function removePanel(pid: string) {
    if (panels.length <= 1) return
    setPanels(prev => prev.filter(p => p.id !== pid).map((p, i) => ({ ...p, order: i + 1 })))
  }

  function updatePanel(pid: string, field: keyof Panel, value: string) {
    setPanels(prev => prev.map(p => p.id === pid ? { ...p, [field]: value } : p))
  }

  async function uploadPanelImage(panelId: string, file: File) {
    setUploading(panelId)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) updatePanel(panelId, 'image', data.url)
    } finally {
      setUploading(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        stripNumber: parseInt(form.stripNumber) || 1,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        panels: panels.map((p, i) => ({ ...p, order: i + 1 })),
      }
      const res = await fetch(`/api/comics/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        router.push('/admin/comics')
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save')
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
      <div style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link
            href="/admin/comics"
            style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.9rem', color: '#5c5b59', textDecoration: 'none' }}
          >
            ← Comics
          </Link>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '2rem', color: '#1A1A1A', margin: 0 }}>
            Edit Comic
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
            <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 1.25rem', color: '#1A1A1A' }}>
              Basic Info
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Title *</label>
                <input style={inputStyle} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Slug</label>
                <input style={inputStyle} value={form.slug} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Strip Number *</label>
                <input style={inputStyle} type="number" min="1" value={form.stripNumber} onChange={e => setForm(p => ({ ...p, stripNumber: e.target.value }))} required />
              </div>
              <div>
                <label style={labelStyle}>Published Date *</label>
                <input style={inputStyle} type="date" value={form.publishedAt} onChange={e => setForm(p => ({ ...p, publishedAt: e.target.value }))} required />
              </div>
              <div>
                <label style={labelStyle}>Series</label>
                <input style={inputStyle} value={form.series} onChange={e => setForm(p => ({ ...p, series: e.target.value }))} />
              </div>
              <div>
                <label style={labelStyle}>Tags (comma-separated)</label>
                <input style={inputStyle} value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} />
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <label htmlFor="featured" style={{ ...labelStyle, margin: 0, cursor: 'pointer' }}>Featured</label>
              </div>
            </div>
          </div>

          {/* Panels */}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.1rem', margin: 0, color: '#1A1A1A' }}>
                Panels ({panels.length})
              </h2>
              <button
                type="button"
                onClick={addPanel}
                style={{
                  background: '#F5C800',
                  border: '2px solid #1A1A1A',
                  borderRadius: '6px',
                  padding: '0.4rem 0.875rem',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '2px 2px 0 0 #1A1A1A',
                }}
              >
                + Add Panel
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {panels.map((panel, i) => (
                <div
                  key={panel.id}
                  style={{ border: '2px solid #e4e2df', borderRadius: '8px', padding: '1.25rem', background: '#fafafa' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '0.9rem', color: '#1A1A1A' }}>
                      Panel {i + 1}
                    </span>
                    {panels.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePanel(panel.id)}
                        style={{
                          background: 'transparent',
                          border: '2px solid #f95630',
                          borderRadius: '4px',
                          padding: '0.15rem 0.5rem',
                          color: '#f95630',
                          fontFamily: 'var(--font-headline)',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={labelStyle}>Image URL</label>
                      <input
                        style={{ ...inputStyle, boxShadow: 'none' }}
                        value={panel.image}
                        onChange={e => updatePanel(panel.id, 'image', e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Upload Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) uploadPanelImage(panel.id, file)
                        }}
                        style={{ fontSize: '0.85rem' }}
                        disabled={uploading === panel.id}
                      />
                      {uploading === panel.id && <span style={{ fontSize: '0.78rem', color: '#5c5b59' }}>Uploading...</span>}
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Caption</label>
                      <input
                        style={{ ...inputStyle, boxShadow: 'none' }}
                        value={panel.caption}
                        onChange={e => updatePanel(panel.id, 'caption', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
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
              {saving ? 'Saving...' : 'Save Changes →'}
            </button>
            <Link
              href="/admin/comics"
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
