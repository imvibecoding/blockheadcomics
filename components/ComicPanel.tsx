import Image from 'next/image'

interface ComicPanelProps {
  image: string
  caption?: string
  panelNumber?: number
  rotate?: number
  className?: string
}

export default function ComicPanel({
  image,
  caption,
  panelNumber,
  rotate = 0,
  className = '',
}: ComicPanelProps) {
  return (
    <div
      className={className}
      style={{
        transform: `rotate(${rotate}deg)`,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      {/* Panel number */}
      {panelNumber !== undefined && (
        <div
          style={{
            width: '28px',
            height: '28px',
            background: '#1A1A1A',
            color: '#F5C800',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-headline)',
            fontWeight: 900,
            fontSize: '0.8rem',
            flexShrink: 0,
          }}
        >
          {panelNumber}
        </div>
      )}

      {/* Image panel */}
      <div
        style={{
          border: '4px solid #1A1A1A',
          boxShadow: '6px 6px 0 0 #1A1A1A',
          background: '#ffffff',
          overflow: 'hidden',
          position: 'relative',
          aspectRatio: '4/3',
        }}
        className="panel-wobble"
      >
        <Image
          src={image}
          alt={caption || `Panel ${panelNumber ?? ''}`}
          fill
          style={{ objectFit: 'cover' }}
          unoptimized={image.endsWith('.svg')}
        />
      </div>

      {/* Caption speech bubble */}
      {caption && (
        <div
          style={{
            background: '#ffffff',
            border: '3px solid #1A1A1A',
            borderRadius: '12px',
            padding: '0.5rem 0.75rem',
            fontFamily: 'var(--font-headline)',
            fontWeight: 700,
            fontSize: '0.85rem',
            color: '#1A1A1A',
            position: 'relative',
            boxShadow: '3px 3px 0 0 #1A1A1A',
          }}
        >
          {/* Speech bubble tail */}
          <span
            style={{
              position: 'absolute',
              top: '-12px',
              left: '16px',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderBottom: '12px solid #1A1A1A',
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: '-8px',
              left: '19px',
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderBottom: '9px solid #ffffff',
            }}
          />
          {caption}
        </div>
      )}
    </div>
  )
}
