import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User, Settings, LogOut, ChevronDown } from 'lucide-react';

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, profile, isAuthenticated, signOut } = useAuth();

  const displayName = profile?.username || user?.user_metadata?.username || user?.email?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url;

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
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDark = location.pathname === '/' ? overDark : true;
  const isAuthPage = ['/login', '/register', '/reset-password'].includes(location.pathname);

  // Hide header on auth pages
  if (isAuthPage) return null;

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: isCompact ? '64px' : '72px',
          backgroundColor: isDark ? 'transparent' : 'rgba(7,7,8,0.92)',
          backdropFilter: isDark ? 'none' : 'blur(16px)',
          WebkitBackdropFilter: isDark ? 'none' : 'blur(16px)',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.06)'}`,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 clamp(20px, 4vw, 60px)',
          transition: 'height 0.4s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', zIndex: 101 }}>
          <img
            src="/images/corolas-logo-white.png"
            alt="Corolas"
            style={{ height: isCompact ? '28px' : '32px', transition: 'height 0.4s ease' }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="hidden md:flex">
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
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {item.label}
              </Link>
            );
          })}

          {/* Auth section */}
          {isAuthenticated ? (
            <div ref={userMenuRef} style={{ position: 'relative', marginLeft: '8px' }}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 10px 6px 6px',
                  backgroundColor: userMenuOpen ? 'rgba(255,255,255,0.08)' : 'transparent',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '100px',
                  cursor: 'pointer',
                  transition: 'background-color 0.25s ease',
                }}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  backgroundColor: avatarUrl ? 'transparent' : 'rgba(200,164,92,0.2)',
                  overflow: 'hidden',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <User size={14} color="#c8a45c" />
                  )}
                </div>
                <span style={{ fontSize: '12px', fontWeight: 500, color: '#ffffff', letterSpacing: '0.02em' }}>
                  {displayName}
                </span>
                <ChevronDown
                  size={12}
                  color="rgba(255,255,255,0.4)"
                  style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
                />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    width: '200px',
                    backgroundColor: '#0e0e10',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '6px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    animation: 'fadeIn 0.15s ease',
                  }}
                >
                  <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                  <div style={{ padding: '8px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '4px' }}>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#ffffff' }}>{displayName}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '2px', wordBreak: 'break-all' }}>{user?.email}</p>
                  </div>
                  <Link
                    to="/account"
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px',
                      padding: '8px 10px', fontSize: '13px', color: 'rgba(255,255,255,0.75)',
                      textDecoration: 'none', borderRadius: '6px', transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#ffffff'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                  >
                    <Settings size={14} /> Account Settings
                  </Link>
                  <button
                    onClick={async () => { await signOut(); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                      padding: '8px 10px', fontSize: '13px', color: 'rgba(255,255,255,0.75)',
                      background: 'none', border: 'none', cursor: 'pointer', borderRadius: '6px',
                      transition: 'background-color 0.2s ease', fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#ef4444'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
              <Link
                to="/login"
                style={{
                  padding: '8px 18px',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  transition: 'background-color 0.25s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  padding: '8px 18px',
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#070708',
                  backgroundColor: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  transition: 'opacity 0.25s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', zIndex: 101, padding: '8px' }}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(7,7,8,0.98)',
            backdropFilter: 'blur(20px)',
            zIndex: 99,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '28px', padding: '24px',
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
                  fontSize: '22px', fontWeight: 300,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: isActive ? '#c8a45c' : '#ffffff',
                  textDecoration: 'none', transition: 'color 0.25s ease',
                }}
              >
                {item.label}
              </Link>
            );
          })}

          <div style={{ width: '40px', height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '8px 0' }} />

          {isAuthenticated ? (
            <>
              <Link
                to="/account"
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: '18px', fontWeight: 300, letterSpacing: '0.06em', color: '#ffffff', textDecoration: 'none' }}
              >
                Account
              </Link>
              <button
                onClick={async () => { await signOut(); setMobileOpen(false); }}
                style={{ fontSize: '18px', fontWeight: 300, letterSpacing: '0.06em', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: '18px', fontWeight: 300, letterSpacing: '0.06em', color: '#ffffff', textDecoration: 'none' }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                style={{ fontSize: '18px', fontWeight: 300, letterSpacing: '0.06em', color: '#c8a45c', textDecoration: 'none' }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </>
  );
}
