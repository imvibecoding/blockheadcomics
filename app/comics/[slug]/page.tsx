import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import ComicPanel from '@/components/ComicPanel'
import { getComics, getComic } from '@/lib/data'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function ComicReaderPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const comic = await getComic(slug)
  if (!comic) notFound()

  const allComics = (await getComics()).sort((a, b) => a.stripNumber - b.stripNumber)
  const currentIndex = allComics.findIndex(c => c.slug === slug)
  const prevComic = currentIndex > 0 ? allComics[currentIndex - 1] : null
  const nextComic = currentIndex < allComics.length - 1 ? allComics[currentIndex + 1] : null
  const totalComics = allComics.length

  const panelRotations = [-1.5, 1, -0.5, 1.5, -1, 0.8]

  return (
    <>
      <Navigation />
      <main>
        {/* Header */}
        <section
          style={{
            borderBottom: '4px solid #1A1A1A',
            background: '#1A1A1A',
            padding: '2rem 0 1.5rem',
          }}
        >
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      background: '#F5C800',
                      color: '#1A1A1A',
                      fontFamily: 'var(--font-headline)',
                      fontWeight: 900,
                      fontSize: '0.9rem',
                      padding: '0.2rem 0.7rem',
                      borderRadius: '6px',
                    }}
                  >
                    #{comic.stripNumber}
                  </span>
                  <span
                    style={{
                      background: '#3BBFED',
                      color: '#1A1A1A',
                      fontFamily: 'var(--font-headline)',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                      padding: '0.15rem 0.6rem',
                      borderRadius: '4px',
                    }}
                  >
                    {comic.series}
                  </span>
                </div>
                <h1
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 900,
                    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                    color: '#F5C800',
                    margin: 0,
                    textShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                  }}
                >
                  {comic.title}
                </h1>
                <p style={{ color: '#aeadaa', margin: '0.4rem 0 0', fontSize: '0.9rem' }}>
                  {new Date(comic.publishedAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              {/* Strip counter */}
              <div
                style={{
                  background: '#2e2f2d',
                  border: '3px solid #5c5b59',
                  borderRadius: '10px',
                  padding: '1rem 1.5rem',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 900,
                    fontSize: '1.6rem',
                    color: '#F5C800',
                    lineHeight: 1,
                  }}
                >
                  {comic.stripNumber} / {totalComics}
                </div>
                <div style={{ color: '#aeadaa', fontSize: '0.75rem', fontWeight: 600, marginTop: '0.25rem' }}>
                  STRIPS
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comic panels */}
        <section
          style={{
            background: '#ffffff',
            borderBottom: '4px solid #1A1A1A',
            padding: '3rem 0',
          }}
        >
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.min(comic.panels.length, 4)}, 1fr)`,
                gap: '2rem',
              }}
            >
              {comic.panels
                .sort((a, b) => a.order - b.order)
                .map((panel, i) => (
                  <ComicPanel
                    key={panel.id}
                    image={panel.image}
                    caption={panel.caption}
                    panelNumber={i + 1}
                    rotate={panelRotations[i % panelRotations.length]}
                  />
                ))}
            </div>

            {/* Tags */}
            {comic.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, color: '#5c5b59', fontSize: '0.9rem', alignSelf: 'center' }}>Tags:</span>
                {comic.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      background: '#F2F0ED',
                      border: '2px solid #1A1A1A',
                      borderRadius: '6px',
                      padding: '0.2rem 0.6rem',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      color: '#1A1A1A',
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Prev / Next navigation */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-8">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
            {prevComic ? (
              <Link
                href={`/comics/${prevComic.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#F2F0ED',
                  border: '3px solid #1A1A1A',
                  borderRadius: '8px',
                  padding: '0.75rem 1.25rem',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: '#1A1A1A',
                  boxShadow: '3px 3px 0 0 #1A1A1A',
                  flex: 1,
                  maxWidth: '45%',
                }}
              >
                <span>←</span>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#5c5b59', fontWeight: 600, textTransform: 'uppercase' }}>Previous</div>
                  <div style={{ fontSize: '0.9rem' }}>#{prevComic.stripNumber}: {prevComic.title}</div>
                </div>
              </Link>
            ) : (
              <div style={{ flex: 1 }} />
            )}

            <Link
              href="/comics"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                background: '#1A1A1A',
                border: '3px solid #1A1A1A',
                borderRadius: '8px',
                padding: '0.75rem 1.25rem',
                textDecoration: 'none',
                fontFamily: 'var(--font-headline)',
                fontWeight: 800,
                fontSize: '0.85rem',
                color: '#F5C800',
                flexShrink: 0,
              }}
            >
              Archive
            </Link>

            {nextComic ? (
              <Link
                href={`/comics/${nextComic.slug}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.5rem',
                  background: '#F2F0ED',
                  border: '3px solid #1A1A1A',
                  borderRadius: '8px',
                  padding: '0.75rem 1.25rem',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  color: '#1A1A1A',
                  boxShadow: '3px 3px 0 0 #1A1A1A',
                  flex: 1,
                  maxWidth: '45%',
                  textAlign: 'right',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#5c5b59', fontWeight: 600, textTransform: 'uppercase' }}>Next</div>
                  <div style={{ fontSize: '0.9rem' }}>#{nextComic.stripNumber}: {nextComic.title}</div>
                </div>
                <span>→</span>
              </Link>
            ) : (
              <div style={{ flex: 1 }} />
            )}
          </div>
        </section>

        {/* Browse Archive bento section */}
        <section
          style={{
            borderTop: '4px solid #1A1A1A',
            background: '#1A1A1A',
            padding: '3rem 0',
          }}
        >
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <h2
              style={{
                fontFamily: 'var(--font-headline)',
                fontWeight: 900,
                fontSize: '1.8rem',
                color: '#F5C800',
                margin: '0 0 1.5rem',
              }}
            >
              More from the Archive
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '1rem',
              }}
            >
              {allComics
                .filter(c => c.slug !== slug)
                .slice(0, 4)
                .map(c => {
                  const firstPanel = c.panels[0]
                  return (
                    <Link
                      key={c.id}
                      href={`/comics/${c.slug}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <div
                        style={{
                          background: '#2e2f2d',
                          border: '3px solid #5c5b59',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          transition: 'border-color 0.15s, transform 0.15s',
                        }}
                      >
                        <div style={{ position: 'relative', aspectRatio: '4/3' }}>
                          {firstPanel && (
                            <Image
                              src={firstPanel.image}
                              alt={c.title}
                              fill
                              style={{ objectFit: 'cover', opacity: 0.7 }}
                              unoptimized={firstPanel.image.endsWith('.svg')}
                            />
                          )}
                        </div>
                        <div style={{ padding: '0.75rem' }}>
                          <div style={{ fontFamily: 'var(--font-headline)', fontWeight: 800, fontSize: '0.9rem', color: '#F5C800' }}>
                            #{c.stripNumber}: {c.title}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
            </div>
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <Link
                href="/comics"
                className="wiggle-hover"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: '#F5C800',
                  border: '3px solid #F5C800',
                  borderRadius: '8px',
                  padding: '0.65rem 1.5rem',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  color: '#1A1A1A',
                  textDecoration: 'none',
                }}
              >
                View Full Archive →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
