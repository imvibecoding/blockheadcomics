import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getArt } from '@/lib/data'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

const CATEGORIES = ['all', 'character', 'comic', 'landscape', 'fan art', 'general']

export default async function ArtPage() {
  const art = await getArt()
  const sorted = [...art].sort((a, b) => a.order - b.order)

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
              Original artwork from the creator of Blockhead Comics.
            </p>
          </div>
        </section>

        {/* Gallery */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          {sorted.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                background: '#ffffff',
                border: '4px solid #1A1A1A',
                borderRadius: '16px',
                boxShadow: '6px 6px 0 0 #1A1A1A',
              }}
            >
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎨</div>
              <h2
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  fontSize: '1.8rem',
                  color: '#1A1A1A',
                  margin: '0 0 0.75rem',
                }}
              >
                Coming Soon!
              </h2>
              <p style={{ color: '#5c5b59', fontSize: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                Original artwork is on the way. Check back soon!
              </p>
            </div>
          ) : (
            <>
              {/* Featured piece */}
              {sorted.find(a => a.featured) && (() => {
                const featured = sorted.find(a => a.featured)!
                return (
                  <div
                    className="comic-border"
                    style={{
                      background: '#1A1A1A',
                      borderRadius: '16px',
                      padding: '2.5rem',
                      marginBottom: '3rem',
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '2.5rem',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        aspectRatio: '4/3',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '4px solid #F2F0ED',
                        boxShadow: '6px 6px 0 0 rgba(0,0,0,0.4)',
                      }}
                    >
                      <Image
                        src={featured.image}
                        alt={featured.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        unoptimized={featured.image.startsWith('/') && !featured.image.startsWith('//')}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          display: 'inline-block',
                          background: '#3BBFED',
                          color: '#1A1A1A',
                          fontFamily: 'var(--font-headline)',
                          fontWeight: 900,
                          fontSize: '0.8rem',
                          padding: '0.2rem 0.7rem',
                          borderRadius: '999px',
                          border: '2px solid #F2F0ED',
                          marginBottom: '0.75rem',
                          letterSpacing: '0.05em',
                        }}
                      >
                        FEATURED
                      </div>
                      <h2
                        style={{
                          fontFamily: 'var(--font-headline)',
                          fontWeight: 900,
                          fontSize: '2.5rem',
                          color: '#F5C800',
                          margin: '0 0 0.5rem',
                          textShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                        }}
                      >
                        {featured.title}
                      </h2>
                      <div
                        style={{
                          display: 'inline-block',
                          background: '#2e2f2d',
                          color: '#aeadaa',
                          fontFamily: 'var(--font-headline)',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          padding: '0.15rem 0.6rem',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          marginBottom: '1rem',
                        }}
                      >
                        {featured.category}
                      </div>
                      {featured.description && (
                        <p style={{ color: '#e4e2df', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                          {featured.description}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })()}

              {/* Grid of remaining pieces */}
              {(() => {
                const rest = sorted.filter(a => !a.featured)
                if (rest.length === 0) return null
                return (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                      gap: '2rem',
                    }}
                  >
                    {rest.map((piece, i) => {
                      const rotations = [1.5, -1.5, 1, -1, 0.8]
                      const rot = rotations[i % rotations.length]
                      return (
                        <div
                          key={piece.id}
                          className="comic-border"
                          style={{
                            background: '#ffffff',
                            borderRadius: '14px',
                            overflow: 'hidden',
                            transform: `rotate(${rot}deg)`,
                            transition: 'transform 0.2s',
                          }}
                        >
                          {/* Image */}
                          <div style={{ position: 'relative', aspectRatio: '4/3', background: '#F2F0ED' }}>
                            <Image
                              src={piece.image}
                              alt={piece.title}
                              fill
                              style={{ objectFit: 'cover' }}
                              unoptimized={piece.image.startsWith('/') && !piece.image.startsWith('//')}
                            />
                            {/* Category badge */}
                            <div
                              style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                background: '#1A1A1A',
                                color: '#F5C800',
                                fontFamily: 'var(--font-headline)',
                                fontWeight: 800,
                                fontSize: '0.7rem',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '4px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                              }}
                            >
                              {piece.category}
                            </div>
                          </div>
                          {/* Info */}
                          <div style={{ padding: '1.25rem' }}>
                            <h3
                              style={{
                                fontFamily: 'var(--font-headline)',
                                fontWeight: 900,
                                fontSize: '1.3rem',
                                color: '#1A1A1A',
                                margin: '0 0 0.4rem',
                              }}
                            >
                              {piece.title}
                            </h3>
                            {piece.description && (
                              <p style={{ color: '#5c5b59', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                                {piece.description}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })()}
            </>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
