import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getCharacters } from '@/lib/data'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function CharactersPage() {
  const characters = await getCharacters()
  const featured = characters.find(c => c.featured)
  const others = characters.filter(c => !c.featured)

  return (
    <>
      <Navigation />
      <main>
        {/* Header */}
        <section
          style={{
            borderBottom: '4px solid #1A1A1A',
            background: '#F5C800',
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
          {/* Floating speech bubble decoration */}
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
              transform: 'rotate(5deg)',
              boxShadow: '3px 3px 0 0 #1A1A1A',
            }}
          >
            ✨ Keep Smiling!
          </div>
          <div className="max-w-6xl mx-auto px-4 md:px-8" style={{ position: 'relative' }}>
            <div
              style={{
                display: 'inline-block',
                background: '#1A1A1A',
                color: '#F5C800',
                fontFamily: 'var(--font-headline)',
                fontWeight: 800,
                fontSize: '0.8rem',
                padding: '0.2rem 0.7rem',
                borderRadius: '4px',
                letterSpacing: '0.1em',
                marginBottom: '0.75rem',
              }}
            >
              THE CAST
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
              CHARACTERS
            </h1>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          {/* Featured character - big card */}
          {featured && (
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
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Decorative circle */}
              <div
                style={{
                  position: 'absolute',
                  right: '-60px',
                  bottom: '-60px',
                  width: '250px',
                  height: '250px',
                  background: '#F5C800',
                  borderRadius: '50%',
                  opacity: 0.12,
                }}
              />

              {/* Character visual */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ position: 'relative' }}>
                  {/* Shadow */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      width: '160px',
                      height: '160px',
                      background: '#000000',
                      borderRadius: '14px',
                      opacity: 0.5,
                    }}
                  />
                  <div
                    style={{
                      width: '160px',
                      height: '160px',
                      background: featured.color,
                      border: '5px solid #F2F0ED',
                      borderRadius: featured.shape === 'circle' ? '50%' : '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {featured.image && featured.image !== '/placeholder-character.svg' ? (
                      <Image
                        src={featured.image}
                        alt={featured.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        unoptimized={featured.image.startsWith('/') && !featured.image.startsWith('//')}
                      />
                    ) : (
                      <>
                        {/* Eyes */}
                        <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                          <div style={{ width: '22px', height: '22px', background: '#1A1A1A', borderRadius: '50%', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '4px', left: '4px', width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} />
                          </div>
                          <div style={{ width: '22px', height: '22px', background: '#1A1A1A', borderRadius: '50%', position: 'relative' }}>
                            <div style={{ position: 'absolute', top: '4px', left: '4px', width: '8px', height: '8px', background: 'white', borderRadius: '50%' }} />
                          </div>
                        </div>
                        {/* Smile */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: '38px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '60px',
                            height: '22px',
                            borderBottom: '5px solid #1A1A1A',
                            borderRadius: '0 0 30px 30px',
                          }}
                        />
                      </>
                    )}
                  </div>
                  {/* Star badge */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '-10px',
                      width: '40px',
                      height: '40px',
                      background: '#F5C800',
                      border: '3px solid #F2F0ED',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                    }}
                  >
                    ⭐
                  </div>
                </div>
              </div>

              {/* Character info */}
              <div>
                <div
                  style={{
                    display: 'inline-block',
                    background: featured.color,
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
                  MAIN CHARACTER
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 900,
                    fontSize: '3rem',
                    color: '#F5C800',
                    margin: '0 0 0.25rem',
                    textShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                  }}
                >
                  {featured.name}
                </h2>
                <div
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    color: '#aeadaa',
                    marginBottom: '1rem',
                    fontStyle: 'italic',
                  }}
                >
                  &ldquo;{featured.tagline}&rdquo;
                </div>
                <p style={{ color: '#e4e2df', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
                  {featured.description}
                </p>
              </div>
            </div>
          )}

          {/* Other characters - asymmetric grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {others.map((char, i) => {
              const rotations = [2, -2, 1.5]
              const rot = rotations[i % rotations.length]
              return (
                <div
                  key={char.id}
                  className="comic-border"
                  style={{
                    background: '#ffffff',
                    borderRadius: '14px',
                    padding: '2rem',
                    transform: `rotate(${rot}deg)`,
                    transition: 'transform 0.2s',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '1.25rem',
                    position: 'relative',
                  }}
                >
                  {/* Floating speech bubble */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-18px',
                      right: '12px',
                      background: char.color,
                      border: '2px solid #1A1A1A',
                      borderRadius: '999px',
                      padding: '0.15rem 0.75rem',
                      fontFamily: 'var(--font-headline)',
                      fontWeight: 900,
                      fontSize: '0.75rem',
                      color: char.color === '#F5C800' ? '#1A1A1A' : '#F2F0ED',
                      boxShadow: '2px 2px 0 0 #1A1A1A',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {char.tagline}
                  </div>

                  {/* Character visual */}
                  <div
                    style={{
                      width: '110px',
                      height: '110px',
                      background: char.color,
                      border: '4px solid #1A1A1A',
                      boxShadow: '5px 5px 0 0 #1A1A1A',
                      borderRadius: char.shape === 'circle' ? '50%' : '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {char.image && char.image !== '/placeholder-character.svg' ? (
                      <Image
                        src={char.image}
                        alt={char.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        unoptimized={char.image.startsWith('/') && !char.image.startsWith('//')}
                      />
                    ) : (
                      /* Eyes */
                      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                        <div style={{ width: '16px', height: '16px', background: '#1A1A1A', borderRadius: '50%', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '3px', left: '3px', width: '6px', height: '6px', background: 'white', borderRadius: '50%' }} />
                        </div>
                        <div style={{ width: '16px', height: '16px', background: '#1A1A1A', borderRadius: '50%', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '3px', left: '3px', width: '6px', height: '6px', background: 'white', borderRadius: '50%' }} />
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-headline)',
                        fontWeight: 900,
                        fontSize: '1.8rem',
                        color: '#1A1A1A',
                        margin: '0 0 0.5rem',
                      }}
                    >
                      {char.name}
                    </h3>
                    <p style={{ color: '#5c5b59', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
                      {char.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA */}
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link
              href="/comics"
              className="wiggle-hover"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#F5C800',
                border: '4px solid #1A1A1A',
                boxShadow: '6px 6px 0 0 #1A1A1A',
                fontFamily: 'var(--font-headline)',
                fontWeight: 900,
                fontSize: '1.1rem',
                color: '#1A1A1A',
                padding: '0.875rem 2rem',
                borderRadius: '10px',
                textDecoration: 'none',
              }}
            >
              See Them in Action →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
