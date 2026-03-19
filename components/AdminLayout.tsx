'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/comics', label: 'Comics', icon: '📚', exact: false },
  { href: '/admin/characters', label: 'Characters', icon: '🎭', exact: false },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️', exact: false },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F2F0ED' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '240px',
          flexShrink: 0,
          background: '#1A1A1A',
          borderRight: '4px solid #1A1A1A',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '1.25rem 1rem',
            borderBottom: '3px solid #2e2f2d',
          }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div
              style={{
                fontFamily: 'var(--font-headline)',
                fontWeight: 900,
                fontStyle: 'italic',
                fontSize: '1.3rem',
                color: '#F5C800',
                letterSpacing: '-0.01em',
              }}
            >
              Blockhead
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.7rem',
                color: '#5c5b59',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Admin Panel
            </div>
          </Link>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {sidebarLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.875rem',
                  borderRadius: '0.5rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  transition: 'background 0.15s, color 0.15s',
                  ...(isActive
                    ? {
                        background: '#F5C800',
                        color: '#1A1A1A',
                        border: '2px solid #F5C800',
                        boxShadow: '3px 3px 0 0 rgba(245,200,0,0.3)',
                      }
                    : {
                        color: '#aeadaa',
                        border: '2px solid transparent',
                      }),
                }}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '1rem 0.75rem', borderTop: '2px solid #2e2f2d' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.6rem 0.875rem',
              borderRadius: '0.5rem',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '0.95rem',
              background: 'transparent',
              color: '#aeadaa',
              border: '2px solid transparent',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
            className="hover:bg-[#f95630] hover:text-white hover:border-[#f95630]"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
