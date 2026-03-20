'use client'

import { useEffect, useState } from 'react'

type SocialLinks = {
  instagram?: string
  twitter?: string
  facebook?: string
}

const btnBase: React.CSSProperties = {
  width: '40px',
  height: '40px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  fontWeight: 800,
  fontSize: '0.75rem',
}

export default function FooterSocialLinks() {
  const [links, setLinks] = useState<SocialLinks | null>(null)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => setLinks(data?.socialLinks ?? {}))
      .catch(() => setLinks({}))
  }, [])

  if (!links) return null

  const { instagram, twitter, facebook } = links
  if (!instagram && !twitter && !facebook) return null

  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
      {instagram && (
        <a
          href={instagram}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...btnBase, background: '#F5C800', border: '3px solid #F5C800', color: '#1A1A1A' }}
          aria-label="Instagram"
        >
          IG
        </a>
      )}
      {twitter && (
        <a
          href={twitter}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...btnBase, background: '#3BBFED', border: '3px solid #3BBFED', color: '#1A1A1A' }}
          aria-label="Twitter / X"
        >
          X
        </a>
      )}
      {facebook && (
        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          style={{ ...btnBase, background: '#4267B2', border: '3px solid #4267B2', color: '#fff' }}
          aria-label="Facebook"
        >
          FB
        </a>
      )}
    </div>
  )
}
