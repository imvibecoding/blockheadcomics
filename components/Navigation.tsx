'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const navLinks = [
  { href: '/comics', label: 'Comics' },
  { href: '/characters', label: 'Characters' },
  { href: '/about', label: 'About' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      style={{ borderBottom: '4px solid #1A1A1A' }}
      className="sticky top-0 z-50 bg-[#F2F0ED] px-4 md:px-8"
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span
            style={{
              fontFamily: 'var(--font-headline)',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: '1.6rem',
              color: '#F5C800',
              textShadow: '3px 3px 0 #1A1A1A',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            Blockhead
          </span>
          <span
            style={{
              fontFamily: 'var(--font-headline)',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: '1.6rem',
              color: '#1A1A1A',
              lineHeight: 1,
            }}
          >
            Comics
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#1A1A1A',
                  padding: '0.3rem 0.9rem',
                  borderRadius: '0.5rem',
                  textDecoration: 'none',
                  position: 'relative',
                  transition: 'background 0.15s',
                  ...(isActive ? {
                    background: '#F5C800',
                    borderBottom: '3px solid #1A1A1A',
                  } : {}),
                }}
                className="hover:bg-[#F5C800] transition-colors"
              >
                {link.label}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-2px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '60%',
                      height: '3px',
                      background: '#1A1A1A',
                      borderRadius: '2px',
                    }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        {/* Join Club button + hamburger */}
        <div className="flex items-center gap-3">
          <Link
            href="/comics"
            className="hidden md:inline-flex items-center wiggle-hover"
            style={{
              background: '#F5C800',
              border: '3px solid #1A1A1A',
              boxShadow: '4px 4px 0 #1A1A1A',
              fontFamily: 'var(--font-headline)',
              fontWeight: 800,
              fontSize: '0.9rem',
              color: '#1A1A1A',
              padding: '0.45rem 1.1rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              letterSpacing: '0.02em',
            }}
          >
            Join Club
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              style={{
                display: 'block',
                width: '24px',
                height: '3px',
                background: '#1A1A1A',
                borderRadius: '2px',
                transition: 'transform 0.2s',
                transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '24px',
                height: '3px',
                background: '#1A1A1A',
                borderRadius: '2px',
                transition: 'opacity 0.2s',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: '24px',
                height: '3px',
                background: '#1A1A1A',
                borderRadius: '2px',
                transition: 'transform 0.2s',
                transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            borderTop: '3px solid #1A1A1A',
            background: '#F5C800',
          }}
          className="md:hidden py-4 px-4 flex flex-col gap-2"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 700,
                fontSize: '1.1rem',
                color: '#1A1A1A',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
              }}
              className="hover:bg-[#1A1A1A] hover:text-[#F5C800] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/comics"
            onClick={() => setMenuOpen(false)}
            style={{
              background: '#1A1A1A',
              color: '#F5C800',
              fontFamily: 'var(--font-headline)',
              fontWeight: 800,
              fontSize: '1rem',
              padding: '0.6rem 1rem',
              borderRadius: '0.5rem',
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: '0.5rem',
            }}
          >
            Join Club
          </Link>
        </div>
      )}
    </nav>
  )
}
