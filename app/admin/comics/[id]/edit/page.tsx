'use client'

import AdminLayout from '@/components/AdminLayout'
import Link from 'next/link'
import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'

type Panel = { id: string; image: string; caption: string; order: number }
type Comic = {
  id: string; slug: string; title: string; stripNumber: number
  publishedAt: string; series: string; panels: Panel[]
  tags: string[]; featured: boolean; animation?: string
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

const card: React.CSSProperties = {
  background: '#ffffff',
  border: '3px solid #1A1A1A',
  borderRadius: '12px',
  padding: '1.75rem',
  boxShadow: '4px 4px 0 0 #1A1A1A',
  marginBottom: '1.5rem',
}

export default function EditComicPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState<string | null>(null)
  const [uploadingAnim, setUploadingAnim] = useState(false)

  // Instagram state
  const [igConfigured, setIgConfigured] = useState(false)
  const [igCaption, setIgCaption] = useState('')
  const [igSelectedPanel, setIgSelectedPanel] = useState<number>(0)
  const [igPosting, setIgPosting] = useState(false)
  const [igStatus, setIgStatus] = useState<{ ok: boolean; message: string } | null>(null)

  const [form, setForm] = useState({
    title: '',
    slug: '',
    stripNumber: '',
    publishedAt: '',
    series: '',
    tags: '',
    featured: false,
    animation: '',
  })
  const [panels, setPanels] = useState<Panel[]>([])

  const loadComic = useCallback(async () => {
    try {
      const [comicRes, settingsRes] = await Promise.all([
        fetch(`/api/comics/${id}`),
        fetch('/api/settings'),
      ])
      if (!comicRes.ok) { router.push('/admin/comics'); return }
      const comic: Comic = await comicRes.json()
      const settings = await settingsRes.json()

      setForm({
        title: comic.title,
        slug: comic.slug,
        stripNumber: comic.stripNumber.toString(),
        publishedAt: comic.publishedAt,
        series: comic.series,
        tags: comic.tags.join(', '),
        featured: comic.featured,
        animation: comic.animation || '',
      })
      setPanels(comic.panels.sort((a, b) => a.order - b.order))
      setIgConfigured(!!(settings.instagramUserId && settings.instagramAccessToken))
      setIgCaption(`${comic.title} — Strip #${comic.stripNumber}\n\n${comic.tags.map((t: string) => `#${t}`).join(' ')} #blockheadcomics`)
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

  async function uploadAnimation(file: File) {
    setUploadingAnim(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) setForm(p => ({ ...p, animation: data.url }))
      else alert(data.error || 'Upload failed')
    } finally {
      setUploadingAnim(false)
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

  async function postToInstagram(type: 'single' | 'carousel') {
    setIgPosting(true)
    setIgStatus(null)
    try {
      const realPanels = panels.filter(p => p.image && !p.image.includes('placeholder'))
      const imageUrls = type === 'single'
        ? [realPanels[igSelectedPanel]?.image].filter(Boolean)
        : realPanels.map(p => p.image)

      if (!imageUrls.length) {
        setIgStatus({ ok: false, message: 'No panel images available to post.' })
        return
      }

      const res = await fetch('/api/instagram/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, imageUrls, caption: igCaption }),
      })
      const data = await res.json()
      if (res.ok) {
        setIgStatus({
          ok: true,
          message: type === 'carousel'
            ? `✓ Posted ${data.panels}-panel carousel to Instagram!`
            : '✓ Posted to Instagram!',
        })
      } else {
        setIgStatus({ ok: false, message: data.error || 'Failed to post' })
      }
    } finally {
      setIgPosting(false)
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

  const realPanels = panels.filter(p => p.image && !p.image.includes('placeholder'))

  return (
    <AdminLayout>
      <div style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <Link href="/admin/comics" style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.9rem', color: '#5c5b59', textDecoration: 'none' }}>
            ← Comics
          </Link>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '2rem', color: '#1A1A1A', margin: 0 }}>
            Edit Comic
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div style={card}>
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
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                <label htmlFor="featured" style={{ ...labelStyle, margin: 0, cursor: 'pointer' }}>Featured</label>
              </div>
            </div>
          </div>

          {/* Panels */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.1rem', margin: 0, color: '#1A1A1A' }}>
                Panels ({panels.length})
              </h2>
              <button
                type="button"
                onClick={addPanel}
                style={{ background: '#F5C800', border: '2px solid #1A1A1A', borderRadius: '6px', padding: '0.4rem 0.875rem', fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', boxShadow: '2px 2px 0 0 #1A1A1A' }}
              >
                + Add Panel
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#5c5b59', margin: '0 0 1rem' }}>
              Panels are displayed one at a time in <strong>4:5 portrait format</strong> (Instagram-ready). Draw at 1080×1350px for best results.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {panels.map((panel, i) => (
                <div key={panel.id} style={{ border: '2px solid #e4e2df', borderRadius: '8px', padding: '1.25rem', background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '0.9rem', color: '#1A1A1A' }}>Panel {i + 1}</span>
                    {panels.length > 1 && (
                      <button type="button" onClick={() => removePanel(panel.id)} style={{ background: 'transparent', border: '2px solid #f95630', borderRadius: '4px', padding: '0.15rem 0.5rem', color: '#f95630', fontFamily: 'var(--font-headline)', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>
                        Remove
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {panel.image && panel.image !== '/placeholder-panel.svg' && (
                      <div style={{ gridColumn: 'span 2' }}>
                        <div style={{ width: '100%', maxHeight: '160px', border: '2px solid #1A1A1A', borderRadius: '6px', overflow: 'hidden', background: '#F2F0ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={panel.image} alt={`Panel ${i + 1} preview`} style={{ maxWidth: '100%', maxHeight: '160px', objectFit: 'contain', display: 'block' }} />
                        </div>
                      </div>
                    )}
                    <div>
                      <label style={labelStyle}>Image URL</label>
                      <input style={{ ...inputStyle, boxShadow: 'none' }} value={panel.image} onChange={e => updatePanel(panel.id, 'image', e.target.value)} />
                    </div>
                    <div>
                      <label style={labelStyle}>Upload Image</label>
                      <input type="file" accept="image/*" onChange={e => { const file = e.target.files?.[0]; if (file) uploadPanelImage(panel.id, file) }} style={{ fontSize: '0.85rem' }} disabled={uploading === panel.id} />
                      {uploading === panel.id && <span style={{ fontSize: '0.78rem', color: '#5c5b59' }}>Uploading...</span>}
                      {uploading !== panel.id && panel.image && panel.image !== '/placeholder-panel.svg' && (
                        <span style={{ fontSize: '0.78rem', color: '#22c55e' }}>✓ Image set</span>
                      )}
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Caption</label>
                      <input style={{ ...inputStyle, boxShadow: 'none' }} value={panel.caption} onChange={e => updatePanel(panel.id, 'caption', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Animation */}
          <div style={card}>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '1.1rem', margin: '0 0 0.5rem', color: '#1A1A1A' }}>
              Animation (Optional)
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#5c5b59', margin: '0 0 1rem', lineHeight: 1.5 }}>
              Upload an animated version of this strip made in ToonBoom, FlipAClip, or any other tool.
              Supports <strong>MP4</strong> and <strong>WebM</strong>. Shown below the panel reader on the comic page.
            </p>

            {form.animation && (
              <div style={{ marginBottom: '1rem' }}>
                <video
                  src={form.animation}
                  controls
                  style={{ width: '100%', maxHeight: '200px', border: '2px solid #1A1A1A', borderRadius: '8px', background: '#000', display: 'block' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.78rem', color: '#22c55e', fontWeight: 700 }}>✓ Animation set</span>
                  <button
                    type="button"
                    onClick={() => setForm(p => ({ ...p, animation: '' }))}
                    style={{ background: 'transparent', border: '1px solid #f95630', borderRadius: '4px', padding: '0.1rem 0.5rem', color: '#f95630', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={labelStyle}>Upload Video</label>
                <input
                  type="file"
                  accept="video/mp4,video/webm,video/*"
                  onChange={e => { const file = e.target.files?.[0]; if (file) uploadAnimation(file) }}
                  disabled={uploadingAnim}
                  style={{ fontSize: '0.85rem' }}
                />
                {uploadingAnim && <span style={{ fontSize: '0.78rem', color: '#5c5b59' }}>Uploading video... (may take a moment)</span>}
              </div>
              <div>
                <label style={labelStyle}>Or paste video URL</label>
                <input
                  style={{ ...inputStyle, boxShadow: 'none' }}
                  value={form.animation}
                  onChange={e => setForm(p => ({ ...p, animation: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {error && (
            <div style={{ background: '#fff0ed', border: '2px solid #f95630', borderRadius: '8px', padding: '0.75rem 1rem', color: '#f95630', fontWeight: 700, marginBottom: '1rem' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '3rem' }}>
            <button type="submit" disabled={saving} className="wiggle-hover" style={{ background: '#F5C800', border: '3px solid #1A1A1A', borderRadius: '8px', padding: '0.75rem 1.75rem', fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '1rem', color: '#1A1A1A', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '4px 4px 0 0 #1A1A1A', opacity: saving ? 0.7 : 1 }}>
              {saving ? 'Saving...' : 'Save Changes →'}
            </button>
            <Link href="/admin/comics" style={{ display: 'inline-flex', alignItems: 'center', background: '#F2F0ED', border: '3px solid #1A1A1A', borderRadius: '8px', padding: '0.75rem 1.25rem', fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.95rem', color: '#1A1A1A', textDecoration: 'none' }}>
              Cancel
            </Link>
          </div>
        </form>

        {/* ── Publish to Instagram ──────────────────────────────────────────── */}
        <div
          style={{
            background: '#1A1A1A',
            border: '4px solid #1A1A1A',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '6px 6px 0 0 rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '1.5rem' }}>📸</span>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '1.3rem', color: '#F5C800', margin: 0 }}>
              Publish to Instagram
            </h2>
          </div>

          {!igConfigured ? (
            <div style={{ background: '#2e2f2d', borderRadius: '8px', padding: '1.25rem' }}>
              <p style={{ color: '#aeadaa', fontSize: '0.9rem', margin: '0 0 0.75rem' }}>
                Instagram is not configured. Add your User ID and Access Token in Settings to enable posting.
              </p>
              <Link
                href="/admin/settings"
                style={{ color: '#F5C800', fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.85rem', textDecoration: 'none' }}
              >
                Go to Settings →
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Panel thumbnails */}
              {realPanels.length > 0 ? (
                <div>
                  <p style={{ color: '#aeadaa', fontSize: '0.8rem', fontFamily: 'var(--font-body)', marginBottom: '0.75rem' }}>
                    Select a panel to post individually, or post all as a carousel:
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {realPanels.map((panel, i) => (
                      <button
                        key={panel.id}
                        type="button"
                        onClick={() => setIgSelectedPanel(i)}
                        style={{
                          border: igSelectedPanel === i ? '3px solid #F5C800' : '3px solid #5c5b59',
                          borderRadius: '6px',
                          padding: 0,
                          background: 'transparent',
                          cursor: 'pointer',
                          position: 'relative',
                          overflow: 'hidden',
                          width: '72px',
                          height: '90px',
                          flexShrink: 0,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={panel.image} alt={`Panel ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        {igSelectedPanel === i && (
                          <div style={{ position: 'absolute', inset: 0, background: 'rgba(245,200,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.2rem' }}>✓</span>
                          </div>
                        )}
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '0.65rem', textAlign: 'center', fontWeight: 700, padding: '2px' }}>
                          {i + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ color: '#aeadaa', fontSize: '0.85rem', margin: 0 }}>
                  No panel images uploaded yet. Save panel images first.
                </p>
              )}

              {/* Caption */}
              <div>
                <label style={{ ...labelStyle, color: '#aeadaa' }}>Caption</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '100px', resize: 'vertical', background: '#2e2f2d', color: '#e4e2df', border: '2px solid #5c5b59', boxShadow: 'none' }}
                  value={igCaption}
                  onChange={e => setIgCaption(e.target.value)}
                />
              </div>

              {/* Post buttons */}
              {realPanels.length > 0 && (
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => postToInstagram('single')}
                    disabled={igPosting}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#F5C800', border: '3px solid #F5C800', borderRadius: '8px', padding: '0.65rem 1.25rem', fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '0.9rem', color: '#1A1A1A', cursor: igPosting ? 'not-allowed' : 'pointer', opacity: igPosting ? 0.6 : 1 }}
                  >
                    {igPosting ? '⏳ Posting...' : `📸 Post Panel ${igSelectedPanel + 1}`}
                  </button>
                  {realPanels.length >= 2 && (
                    <button
                      type="button"
                      onClick={() => postToInstagram('carousel')}
                      disabled={igPosting}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'transparent', border: '3px solid #F5C800', borderRadius: '8px', padding: '0.65rem 1.25rem', fontFamily: 'var(--font-headline)', fontWeight: 900, fontSize: '0.9rem', color: '#F5C800', cursor: igPosting ? 'not-allowed' : 'pointer', opacity: igPosting ? 0.6 : 1 }}
                    >
                      {igPosting ? '⏳ Posting...' : `🎠 Post All ${realPanels.length} as Carousel`}
                    </button>
                  )}
                </div>
              )}

              {/* Status */}
              {igStatus && (
                <div
                  style={{
                    background: igStatus.ok ? '#f0fff4' : '#fff0ed',
                    border: `2px solid ${igStatus.ok ? '#22c55e' : '#f95630'}`,
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    color: igStatus.ok ? '#166534' : '#f95630',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                  }}
                >
                  {igStatus.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
