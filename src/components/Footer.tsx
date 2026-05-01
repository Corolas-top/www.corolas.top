import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#070708',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '64px clamp(24px, 5vw, 72px) 48px',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '48px',
        }}
      >
        <div>
          <img
            src="/images/corolas-logo-white.png"
            alt="Corolas"
            style={{ height: '56px', marginBottom: '16px' }}
          />
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.6 }}>
            &copy; 2026 Corolas. All rights reserved.
          </p>
        </div>

        <div>
          <h4
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '20px',
            }}
          >
            Navigation
          </h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { label: 'Home', path: '/' },
              { label: 'Projects', path: '/projects' },
              { label: 'About', path: '/about' },
              { label: 'Contact', path: '/contact' },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.6)',
                  textDecoration: 'none',
                  transition: 'color 0.25s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h4
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '20px',
            }}
          >
            Legal
          </h4>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link
              to="/terms"
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                transition: 'color 0.25s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >
              Terms of Service
            </Link>
            <Link
              to="/privacy"
              style={{
                fontSize: '14px',
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                transition: 'color 0.25s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
            >
              Privacy Policy
            </Link>
          </nav>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1280px',
          margin: '48px auto 0',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          paddingTop: '24px',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
          Crafted with curiosity.
        </p>
      </div>
    </footer>
  );
}
