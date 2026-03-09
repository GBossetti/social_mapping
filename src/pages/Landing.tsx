import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0c0c0c',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        position: 'relative',
      }}
    >
      {/* Grain texture overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Logo — triple size */}
        <div className="fade-up">
          <img
            src="/logo_home.png"
            alt="Social Emergency Map"
            style={{ width: 216, height: 'auto', display: 'block', opacity: 0.92 }}
          />
        </div>

        {/* Title — Outfit sans on dark */}
        <h1
          className="fade-up-delay"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 26,
            fontWeight: 300,
            fontStyle: 'normal',
            color: '#f0efec',
            letterSpacing: '0.04em',
            marginTop: 32,
            textAlign: 'center',
            lineHeight: 1.3,
          }}
        >
          Mapa de Emergencia Social
        </h1>

        {/* Hairline divider */}
        <div
          className="fade-up-delay"
          style={{
            width: 32,
            height: 1,
            background: 'rgba(255,255,255,0.1)',
            marginTop: 20,
          }}
        />

        {/* Tagline */}
        <p
          className="fade-up-delay"
          style={{
            fontSize: 13,
            fontWeight: 300,
            color: '#6b6560',
            marginTop: 16,
            textAlign: 'center',
            letterSpacing: '0.02em',
            maxWidth: 280,
            lineHeight: 1.7,
          }}
        >
          Recursos, instituciones y situaciones de riesgo en un solo lugar.
        </p>

        {/* CTA */}
        <button
          className="fade-up-delay-2"
          onClick={() => navigate('/map')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginTop: 48,
            fontSize: 12,
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 500,
            color: '#7a9e87',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            padding: '10px 0',
            borderBottom: '1px solid transparent',
            transition: 'border-color 0.25s ease, color 0.25s ease',
            outline: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderBottomColor = '#7a9e87'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderBottomColor = 'transparent'
          }}
        >
          Ingresar al mapa →
        </button>
      </div>
    </div>
  )
}
