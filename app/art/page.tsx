import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ArtLightbox from '@/components/ArtLightbox'
import { getArt } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function ArtPage() {
  const art = await getArt()

  return (
    <>
      <Navigation />
      <main>
        {/* Header */}
        <section
          style={{
            borderBottom: '4px solid #1A1A1A',
            background: '#3BBFED',
            padding: '3rem 0',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background dots */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, #1A1A1A 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
              opacity: 0.07,
              pointerEvents: 'none',
            }}
          />
          {/* Floating speech bubble */}
          <div
            style={{
              position: 'absolute',
              top: '1.5rem',
              right: '8%',
              background: '#ffffff',
              border: '3px solid #1A1A1A',
              borderRadius: '16px',
              padding: '0.5rem 1rem',
              fontFamily: 'var(--font-headline)',
              fontWeight: 900,
              fontSize: '1rem',
              color: '#1A1A1A',
              transform: 'rotate(-4deg)',
              boxShadow: '3px 3px 0 0 #1A1A1A',
            }}
          >
            🎨 Original Art!
          </div>
          <div className="max-w-6xl mx-auto px-4 md:px-8" style={{ position: 'relative' }}>
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
              THE GALLERY
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-headline)',
                fontWeight: 900,
                fontSize: 'clamp(2.5rem, 7vw, 5rem)',
                color: '#1A1A1A',
                margin: 0,
                textShadow: '4px 4px 0 rgba(0,0,0,0.15)',
              }}
            >
              ART
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.1rem',
                color: '#1A1A1A',
                marginTop: '0.75rem',
                opacity: 0.8,
              }}
            >
              Original artwork from the creator of Blockhead Comics. Click any piece to view full size.
            </p>
          </div>
        </section>

        {/* Gallery — client component handles clicks + lightbox */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <ArtLightbox art={art} />
        </section>
      </main>
      <Footer />
    </>
  )
}
