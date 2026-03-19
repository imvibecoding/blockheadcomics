import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
  const settings = await getSettings()
  return (
    <>
      <Navigation />
      <main>
        {/* Header */}
        <section
          style={{
            background: '#3BBFED',
            borderBottom: '4px solid #1A1A1A',
            padding: '3rem 0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, #1A1A1A 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              opacity: 0.06,
              pointerEvents: 'none',
            }}
          />
          <div className="max-w-4xl mx-auto px-4 md:px-8" style={{ position: 'relative' }}>
            <div
              style={{
                display: 'inline-block',
                background: '#1A1A1A',
                color: '#3BBFED',
                fontFamily: 'var(--font-headline)',
                fontWeight: 800,
                fontSize: '0.8rem',
                padding: '0.2rem 0.7rem',
                borderRadius: '4px',
                letterSpacing: '0.1em',
                marginBottom: '0.75rem',
              }}
            >
              OUR STORY
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-headline)',
                fontWeight: 900,
                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                color: '#1A1A1A',
                margin: 0,
                textShadow: '4px 4px 0 rgba(255,255,255,0.3)',
              }}
            >
              ABOUT
            </h1>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 md:px-8 py-16">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '2rem',
            }}
          >
            {/* Main about card */}
            <div
              className="comic-border"
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '2.5rem',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  fontSize: '2rem',
                  color: '#1A1A1A',
                  margin: '0 0 1.5rem',
                  borderBottom: '4px solid #F5C800',
                  paddingBottom: '0.75rem',
                }}
              >
                What is Blockhead Comics?
              </h2>
              {settings.aboutIntro.split('\n\n').map((para, i, arr) => (
                <p
                  key={i}
                  style={{
                    fontSize: '1.1rem',
                    lineHeight: 1.8,
                    color: '#2e2f2d',
                    margin: i < arr.length - 1 ? '0 0 1.25rem' : '0',
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {/* The Characters card */}
              <div
                className="comic-border-sm"
                style={{
                  background: '#F5C800',
                  borderRadius: '12px',
                  padding: '1.75rem',
                  transform: 'rotate(-1.5deg)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    color: '#1A1A1A',
                    margin: '0 0 0.75rem',
                  }}
                >
                  The Characters
                </h3>
                <p
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    color: '#3d2f00',
                    margin: 0,
                  }}
                >
                  Meet Blockhead (100% sunny), Sky (the fastest thing in the strip), and Dusty
                  (who has been standing in that exact spot since 1998). Plus a cast of
                  supporting shapes who drop in when least expected.
                </p>
              </div>

              {/* Creator Note card */}
              <div
                className="comic-border-sm"
                style={{
                  background: '#1A1A1A',
                  borderRadius: '12px',
                  padding: '1.75rem',
                  transform: 'rotate(1deg)',
                }}
              >
                <h3
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 900,
                    fontSize: '1.4rem',
                    color: '#F5C800',
                    margin: '0 0 0.75rem',
                  }}
                >
                  Why Blockhead?
                </h3>
                <p
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: 1.7,
                    color: '#aeadaa',
                    margin: 0,
                  }}
                >
                  {settings.creatorNote}
                </p>
              </div>
            </div>

            {/* Fan art section */}
            <div
              className="comic-border"
              style={{
                background: '#F2F0ED',
                borderRadius: '16px',
                padding: '2.5rem',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎨</div>
              <h2
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  fontSize: '2rem',
                  color: '#1A1A1A',
                  margin: '0 0 1rem',
                }}
              >
                Submit Fan Art!
              </h2>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  color: '#5c5b59',
                  margin: '0 0 1.5rem',
                  maxWidth: '480px',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                Draw your own version of Blockhead, Sky, or Dusty! The best fan art gets
                featured right here on the site. Squares, circles, and grumpy rectangles
                all welcome.
              </p>
              <a
                href={`mailto:${settings.fanArtEmail || 'fan@blockheadcomics.com'}`}
                className="wiggle-hover"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#F5C800',
                  border: '4px solid #1A1A1A',
                  boxShadow: '5px 5px 0 0 #1A1A1A',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  fontSize: '1rem',
                  color: '#1A1A1A',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                }}
              >
                Send Your Art ✉️
              </a>
            </div>

            {/* Quick links */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                href="/comics"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#1A1A1A',
                  border: '3px solid #1A1A1A',
                  borderRadius: '8px',
                  padding: '0.65rem 1.5rem',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: '#F5C800',
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0 0 #1A1A1A',
                }}
                className="wiggle-hover"
              >
                Read Comics →
              </Link>
              <Link
                href="/characters"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#3BBFED',
                  border: '3px solid #1A1A1A',
                  borderRadius: '8px',
                  padding: '0.65rem 1.5rem',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: '#1A1A1A',
                  textDecoration: 'none',
                  boxShadow: '3px 3px 0 0 #1A1A1A',
                }}
                className="wiggle-hover"
              >
                Meet the Cast →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
