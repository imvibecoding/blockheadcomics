import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ComicPanel from '@/components/ComicPanel'
import { getComics, getCharacters } from '@/lib/data'
import Link from 'next/link'

export default async function HomePage() {
  const comics = getComics()
  const characters = getCharacters()
  const latestComic = comics[comics.length - 1] ?? comics[0]
  const featuredComic = comics.find(c => c.featured) ?? comics[0]

  return (
    <>
      <Navigation />
      <main>
        {/* ===== HERO SECTION ===== */}
        <section
          style={{
            background: '#1A1A1A',
            borderBottom: '4px solid #1A1A1A',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Halftone dots decoration */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle, #F5C800 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              opacity: 0.08,
              pointerEvents: 'none',
            }}
          />

          <div className="max-w-6xl mx-auto px-4 md:px-8 py-20 md:py-28">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1.5rem' }}>
              {/* Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#F5C800',
                  border: '3px solid #F5C800',
                  borderRadius: '999px',
                  padding: '0.3rem 1rem',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  color: '#1A1A1A',
                  letterSpacing: '0.05em',
                }}
              >
                <span style={{ fontSize: '1rem' }}>⭐</span>
                NEW STRIP EVERY WEEK!
              </div>

              {/* Main headline */}
              <h1
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  fontSize: 'clamp(3rem, 10vw, 6.5rem)',
                  lineHeight: 0.95,
                  color: '#F5C800',
                  textShadow: '6px 6px 0 #000000',
                  letterSpacing: '-0.02em',
                  margin: 0,
                  maxWidth: '900px',
                }}
              >
                MEET
                <br />
                BLOCKHEAD!
              </h1>

              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.2rem',
                  color: '#aeadaa',
                  maxWidth: '520px',
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Follow the adventures of a square-headed optimist, a speedy blue circle, and a very grumpy grey block.
              </p>

              {/* CTA Button */}
              <Link
                href={`/comics/${featuredComic?.slug ?? ''}`}
                className="wiggle-hover"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#F5C800',
                  border: '4px solid #F5C800',
                  boxShadow: '6px 6px 0 0 rgba(245,200,0,0.3)',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  fontSize: '1.1rem',
                  color: '#1A1A1A',
                  padding: '0.8rem 2rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                  letterSpacing: '0.03em',
                  marginTop: '0.5rem',
                }}
              >
                READ THE LATEST COMIC
                <span style={{ fontSize: '1.2rem' }}>→</span>
              </Link>
            </div>

            {/* Hero character art */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                marginTop: '3rem',
                flexWrap: 'wrap',
              }}
            >
              {characters.map((char, i) => {
                const rotations = [-6, 0, 5]
                const rot = rotations[i % rotations.length]
                return (
                  <div
                    key={char.id}
                    style={{
                      transform: `rotate(${rot}deg)`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <div
                      style={{
                        width: '90px',
                        height: '90px',
                        background: char.color,
                        border: '4px solid #F2F0ED',
                        boxShadow: '4px 4px 0 0 rgba(242,240,237,0.3)',
                        borderRadius: char.shape === 'circle' ? '50%' : '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      {/* Eyes */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <div style={{ width: '12px', height: '12px', background: '#1A1A1A', borderRadius: '50%', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '2px', left: '2px', width: '4px', height: '4px', background: 'white', borderRadius: '50%' }} />
                        </div>
                        <div style={{ width: '12px', height: '12px', background: '#1A1A1A', borderRadius: '50%', position: 'relative' }}>
                          <div style={{ position: 'absolute', top: '2px', left: '2px', width: '4px', height: '4px', background: 'white', borderRadius: '50%' }} />
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        background: '#F2F0ED',
                        border: '2px solid #F2F0ED',
                        borderRadius: '6px',
                        padding: '0.2rem 0.6rem',
                        fontFamily: 'var(--font-headline)',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: '#1A1A1A',
                      }}
                    >
                      {char.name}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ===== BENTO FEATURE PANELS ===== */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {/* Daily Strips - wide panel */}
            <div
              className="comic-border"
              style={{
                background: '#1A1A1A',
                borderRadius: '12px',
                padding: '2rem',
                gridColumn: 'span 2',
                minHeight: '200px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '160px',
                  height: '160px',
                  background: '#F5C800',
                  borderRadius: '50%',
                  opacity: 0.15,
                }}
              />
              <div
                style={{
                  display: 'inline-block',
                  background: '#F5C800',
                  color: '#1A1A1A',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  letterSpacing: '0.08em',
                  marginBottom: '0.75rem',
                }}
              >
                FEATURED
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  fontSize: '2rem',
                  color: '#F5C800',
                  margin: '0 0 0.5rem',
                }}
              >
                Daily Strips
              </h2>
              <p style={{ color: '#aeadaa', margin: '0 0 1.5rem', fontSize: '0.95rem' }}>
                New comics every week. Sunshine, chaos, and questionable life choices.
              </p>
              <Link
                href="/comics"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#F5C800',
                  color: '#1A1A1A',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  border: '3px solid #F5C800',
                }}
                className="wiggle-hover"
              >
                Browse All →
              </Link>
            </div>

            {/* Fan Art panel */}
            <div
              className="comic-border"
              style={{
                background: '#F5C800',
                borderRadius: '12px',
                padding: '2rem',
                minHeight: '200px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  bottom: '-30px',
                  right: '-30px',
                  width: '120px',
                  height: '120px',
                  background: '#1A1A1A',
                  borderRadius: '50%',
                  opacity: 0.08,
                }}
              />
              <div
                style={{
                  display: 'inline-block',
                  background: '#1A1A1A',
                  color: '#F5C800',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '4px',
                  letterSpacing: '0.08em',
                  marginBottom: '0.75rem',
                }}
              >
                COMMUNITY
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  fontSize: '2rem',
                  color: '#1A1A1A',
                  margin: '0 0 0.5rem',
                }}
              >
                Fan Art
              </h2>
              <p style={{ color: '#6f5900', margin: '0 0 1.5rem', fontSize: '0.95rem' }}>
                See how fans around the world draw Blockhead and friends!
              </p>
              <Link
                href="/about"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#1A1A1A',
                  color: '#F5C800',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  border: '3px solid #1A1A1A',
                }}
                className="wiggle-hover"
              >
                Learn More →
              </Link>
            </div>

            {/* Meet the Characters panel */}
            <div
              className="comic-border"
              style={{
                background: '#3BBFED',
                borderRadius: '12px',
                padding: '2rem',
                minHeight: '180px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  fontSize: '1.6rem',
                  color: '#1A1A1A',
                  margin: '0 0 0.5rem',
                }}
              >
                Meet the Cast
              </h2>
              <p style={{ color: '#004f69', margin: '0 0 1.5rem', fontSize: '0.95rem', fontWeight: 600 }}>
                Blockhead, Sky, Dusty and more!
              </p>
              <Link
                href="/characters"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  background: '#1A1A1A',
                  color: '#F2F0ED',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  border: '3px solid #1A1A1A',
                }}
                className="wiggle-hover"
              >
                Meet Them →
              </Link>
            </div>

            {/* Strip count panel */}
            <div
              className="comic-border"
              style={{
                background: '#F2F0ED',
                borderRadius: '12px',
                padding: '2rem',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  fontSize: '3rem',
                  color: '#F5C800',
                  textShadow: '4px 4px 0 #1A1A1A',
                  lineHeight: 1,
                  marginBottom: '0.5rem',
                }}
              >
                {comics.length}+
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-body)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  color: '#1A1A1A',
                }}
              >
                Comic Strips
              </div>
            </div>
          </div>
        </section>

        {/* ===== LATEST COMIC SECTION ===== */}
        <section
          style={{
            background: '#ffffff',
            borderTop: '4px solid #1A1A1A',
            borderBottom: '4px solid #1A1A1A',
          }}
          className="py-16"
        >
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    color: '#F5C800',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    background: '#1A1A1A',
                    display: 'inline-block',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    marginBottom: '0.5rem',
                  }}
                >
                  Latest Strip
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 900,
                    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                    color: '#1A1A1A',
                    margin: 0,
                  }}
                >
                  {latestComic?.title ?? 'The Latest Adventure'}
                </h2>
              </div>
              <Link
                href="/comics"
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  color: '#1A1A1A',
                  textDecoration: 'none',
                  border: '3px solid #1A1A1A',
                  padding: '0.4rem 1rem',
                  borderRadius: '6px',
                  boxShadow: '3px 3px 0 0 #1A1A1A',
                }}
              >
                View All →
              </Link>
            </div>

            {/* Comic panels grid */}
            {latestComic && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${Math.min(latestComic.panels.length, 4)}, 1fr)`,
                  gap: '1.5rem',
                }}
              >
                {latestComic.panels.map((panel, i) => {
                  const rotations = [-1.5, 1, -0.5, 1.5]
                  return (
                    <ComicPanel
                      key={panel.id}
                      image={panel.image}
                      caption={panel.caption}
                      panelNumber={i + 1}
                      rotate={rotations[i % rotations.length]}
                    />
                  )
                })}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link
                href={`/comics/${latestComic?.slug ?? ''}`}
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
                  fontSize: '1rem',
                  color: '#1A1A1A',
                  padding: '0.75rem 1.75rem',
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                }}
              >
                Read Full Strip →
              </Link>
            </div>
          </div>
        </section>

        {/* ===== CHARACTERS SECTION ===== */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-20">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2
              style={{
                fontFamily: 'var(--font-headline)',
                fontWeight: 900,
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                color: '#1A1A1A',
                margin: '0 0 0.75rem',
                textShadow: '4px 4px 0 #F5C800',
              }}
            >
              THE GANG
            </h2>
            <p style={{ color: '#5c5b59', fontSize: '1.05rem', margin: 0 }}>
              A square, a circle, and a very stubborn grey block walk into a comic strip...
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
            }}
          >
            {characters.map((char, i) => {
              const rotations = [-2, 0, 2]
              return (
                <div
                  key={char.id}
                  className="comic-border"
                  style={{
                    background: '#ffffff',
                    borderRadius: '12px',
                    padding: '2rem',
                    transform: `rotate(${rotations[i % rotations.length]}deg)`,
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    gap: '1rem',
                  }}
                >
                  {/* Character shape */}
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      background: char.color,
                      border: '4px solid #1A1A1A',
                      boxShadow: '4px 4px 0 0 #1A1A1A',
                      borderRadius: char.shape === 'circle' ? '50%' : '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                  >
                    {/* Eyes */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                      <div style={{ width: '14px', height: '14px', background: '#1A1A1A', borderRadius: '50%', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '3px', left: '3px', width: '5px', height: '5px', background: 'white', borderRadius: '50%' }} />
                      </div>
                      <div style={{ width: '14px', height: '14px', background: '#1A1A1A', borderRadius: '50%', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '3px', left: '3px', width: '5px', height: '5px', background: 'white', borderRadius: '50%' }} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3
                      style={{
                        fontFamily: 'var(--font-headline)',
                        fontWeight: 900,
                        fontSize: '1.5rem',
                        color: '#1A1A1A',
                        margin: '0 0 0.25rem',
                      }}
                    >
                      {char.name}
                    </h3>
                    <div
                      style={{
                        display: 'inline-block',
                        background: char.color,
                        border: '2px solid #1A1A1A',
                        borderRadius: '999px',
                        padding: '0.15rem 0.75rem',
                        fontFamily: 'var(--font-headline)',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        color: char.color === '#F5C800' ? '#1A1A1A' : '#F2F0ED',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {char.tagline}
                    </div>
                    <p style={{ color: '#5c5b59', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                      {char.description}
                    </p>
                  </div>

                  <Link
                    href="/characters"
                    style={{
                      fontFamily: 'var(--font-headline)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      color: '#1A1A1A',
                      textDecoration: 'none',
                      border: '2px solid #1A1A1A',
                      padding: '0.3rem 0.9rem',
                      borderRadius: '6px',
                      boxShadow: '2px 2px 0 0 #1A1A1A',
                    }}
                  >
                    Learn More
                  </Link>
                </div>
              )
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
