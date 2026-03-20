import Link from 'next/link'
import FooterSocialLinks from './FooterSocialLinks'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        borderTop: '4px solid #1A1A1A',
        background: '#1A1A1A',
        color: '#F2F0ED',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Character peeking over top edge */}
      <div
        style={{
          position: 'absolute',
          top: '-48px',
          right: '10%',
          zIndex: 10,
        }}
      >
        <div style={{ position: 'relative', width: '64px', height: '64px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              background: '#F5C800',
              border: '4px solid #1A1A1A',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {/* Eyes */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  background: '#1A1A1A',
                  borderRadius: '50%',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    width: '4px',
                    height: '4px',
                    background: 'white',
                    borderRadius: '50%',
                  }}
                />
              </div>
              <div
                style={{
                  width: '12px',
                  height: '12px',
                  background: '#1A1A1A',
                  borderRadius: '50%',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '2px',
                    left: '2px',
                    width: '4px',
                    height: '4px',
                    background: 'white',
                    borderRadius: '50%',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: 'var(--font-headline)',
                fontWeight: 900,
                fontStyle: 'italic',
                fontSize: '1.8rem',
                color: '#F5C800',
                textShadow: '3px 3px 0 rgba(255,255,255,0.1)',
                marginBottom: '0.5rem',
              }}
            >
              Blockhead Comics
            </div>
            <p style={{ color: '#aeadaa', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Follow the adventures of Blockhead and friends in this daily comic strip full of sunshine, chaos, and coffee.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-headline)',
                fontWeight: 800,
                fontSize: '1rem',
                color: '#F5C800',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Explore
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { href: '/comics', label: 'Comics Archive' },
                { href: '/characters', label: 'Characters' },
                { href: '/art', label: 'Art Gallery' },
                { href: '/about', label: 'About' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      color: '#aeadaa',
                      textDecoration: 'none',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      transition: 'color 0.15s',
                    }}
                    className="hover:text-[#F5C800]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3
              style={{
                fontFamily: 'var(--font-headline)',
                fontWeight: 800,
                fontSize: '1rem',
                color: '#F5C800',
                marginBottom: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Follow Along
            </h3>
            <FooterSocialLinks />
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '2px solid #2e2f2d',
            paddingTop: '1.5rem',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <p style={{ color: '#5c5b59', fontSize: '0.85rem', margin: 0 }}>
            &copy; {year} Blockhead Comics. All rights reserved.
          </p>
          <Link
            href="/admin"
            style={{
              color: '#5c5b59',
              fontSize: '0.75rem',
              textDecoration: 'none',
              opacity: 0.5,
            }}
            className="hover:opacity-100 transition-opacity"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
