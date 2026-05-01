import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Header() {
  const [isCompact, setIsCompact] = useState(false);
  const [overDark, setOverDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsCompact(y > 80);
      setOverDark(y < window.innerHeight * 0.85 || location.pathname !== '/');
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isDark = location.pathname === '/' ? overDark : true;

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: isCompact ? '64px' : '80px',
          backgroundColor: isDark ? 'transparent' : 'rgba(7,7,8,0.88)',
          backdropFilter: isDark ? 'none' : 'blur(12px)',
          WebkitBackdropFilter: isDark ? 'none' : 'blur(12px)',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)'}`,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(20px, 4vw, 60px)',
          transition: 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', zIndex: 101 }}>
          <img
            src="/images/corolas-logo-white.png"
            alt="Corolas"
            style={{ height: isCompact ? '30px' : '36px', transition: 'height 0.4s ease' }}
          />
        </Link>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px' }} className="hidden md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 400,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: isActive ? '#c8a45c' : '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  transition: 'background-color 0.25s ease, color 0.25s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            zIndex: 101,
            padding: '8px',
          }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(7,7,8,0.97)',
            backdropFilter: 'blur(20px)',
            zIndex: 99,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '32px',
          }}
        >
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: '24px',
                  fontWeight: 300,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: isActive ? '#c8a45c' : '#ffffff',
                  textDecoration: 'none',
                  transition: 'color 0.25s ease',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
