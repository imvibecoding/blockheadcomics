import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { getSettings } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function StorePage() {
  const settings = await getSettings()
  const hasShopify = !!(settings.shopifyStoreUrl && settings.shopifyStorefrontToken)

  const categories = [
    {
      icon: '🖼️',
      title: 'Digital Downloads',
      description: 'High-resolution artwork, wallpapers, and printable comic panels available instantly.',
      color: '#F5C800',
      comingSoon: !hasShopify,
    },
    {
      icon: '🖨️',
      title: 'Prints & Posters',
      description: 'Museum-quality prints of your favourite Blockhead Comics panels, shipped to your door.',
      color: '#3BBFED',
      comingSoon: !hasShopify,
    },
    {
      icon: '🧱',
      title: '3D Printed Characters',
      description: 'Bring Blockhead, Sky, and Dusty to life as desktop-ready 3D printed figures.',
      color: '#f95630',
      comingSoon: !hasShopify,
    },
    {
      icon: '👕',
      title: 'Apparel & Merch',
      description: 'T-shirts, mugs, and more featuring the Blockhead crew. Print-on-demand, no minimum.',
      color: '#a855f7',
      comingSoon: !hasShopify,
    },
  ]

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
              transform: 'rotate(3deg)',
              boxShadow: '3px 3px 0 0 #1A1A1A',
            }}
          >
            🛒 Get the Goods!
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
              THE SHOP
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
              STORE
            </h1>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '1.1rem',
                color: '#1A1A1A',
                marginTop: '0.75rem',
                opacity: 0.75,
              }}
            >
              Prints, downloads, figures, and merch — straight from Blockhead HQ.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-6xl mx-auto px-4 md:px-8 py-16">
          {hasShopify ? (
            /* ── Shopify Buy Button embed area ─────────────────────────────── */
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  fontSize: '1.8rem',
                  color: '#1A1A1A',
                  margin: '0 0 2rem',
                }}
              >
                Shop All Products
              </h2>
              {/* Shopify storefront embed — rendered from admin-configured Buy Button script */}
              <div id="shopify-product-component" style={{ minHeight: '200px' }}>
                <p style={{ color: '#5c5b59' }}>Loading store...</p>
              </div>
            </div>
          ) : (
            /* ── Coming Soon state ────────────────────────────────────────── */
            <div>
              {/* Coming soon banner */}
              <div
                className="comic-border"
                style={{
                  background: '#1A1A1A',
                  borderRadius: '16px',
                  padding: '2.5rem',
                  marginBottom: '3rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                <h2
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontWeight: 900,
                    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                    color: '#F5C800',
                    margin: '0 0 0.75rem',
                    textShadow: '3px 3px 0 rgba(0,0,0,0.3)',
                  }}
                >
                  Opening Soon!
                </h2>
                <p style={{ color: '#aeadaa', fontSize: '1.05rem', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
                  The Blockhead Comics store is being stocked up. Follow us on social media to be the first to know when we open!
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {settings.socialLinks?.instagram && (
                    <a
                      href={settings.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        background: '#F5C800',
                        border: '3px solid #F2F0ED',
                        borderRadius: '8px',
                        padding: '0.6rem 1.4rem',
                        fontFamily: 'var(--font-headline)',
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        color: '#1A1A1A',
                        textDecoration: 'none',
                      }}
                    >
                      Follow on Instagram →
                    </a>
                  )}
                </div>
              </div>

              {/* Category preview cards */}
              <h2
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  fontSize: '1.6rem',
                  color: '#1A1A1A',
                  margin: '0 0 1.5rem',
                }}
              >
                What&apos;s Coming
              </h2>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {categories.map((cat, i) => {
                  const rotations = [1.5, -1.5, 1, -1]
                  const rot = rotations[i % rotations.length]
                  return (
                    <div
                      key={cat.title}
                      className="comic-border"
                      style={{
                        background: '#ffffff',
                        borderRadius: '14px',
                        padding: '2rem',
                        transform: `rotate(${rot}deg)`,
                        transition: 'transform 0.2s',
                        position: 'relative',
                        overflow: 'hidden',
                      }}
                    >
                      {/* Color accent */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '6px',
                          background: cat.color,
                        }}
                      />
                      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', marginTop: '0.5rem' }}>
                        {cat.icon}
                      </div>
                      <h3
                        style={{
                          fontFamily: 'var(--font-headline)',
                          fontWeight: 900,
                          fontSize: '1.3rem',
                          color: '#1A1A1A',
                          margin: '0 0 0.5rem',
                        }}
                      >
                        {cat.title}
                      </h3>
                      <p style={{ color: '#5c5b59', fontSize: '0.9rem', lineHeight: 1.5, margin: '0 0 1rem' }}>
                        {cat.description}
                      </p>
                      <div
                        style={{
                          display: 'inline-block',
                          background: cat.color,
                          color: '#1A1A1A',
                          fontFamily: 'var(--font-headline)',
                          fontWeight: 900,
                          fontSize: '0.7rem',
                          padding: '0.2rem 0.6rem',
                          borderRadius: '999px',
                          border: '2px solid #1A1A1A',
                          letterSpacing: '0.08em',
                        }}
                      >
                        COMING SOON
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
