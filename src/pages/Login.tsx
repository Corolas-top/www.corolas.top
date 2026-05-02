import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { signInWithEmail } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const { error: authError } = await signInWithEmail(email, password);

    setIsSubmitting(false);

    if (authError) {
      setError(authError.message);
    } else {
      navigate('/');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '48px',
    backgroundColor: '#0e0e10',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '6px',
    padding: '0 16px',
    fontSize: '14px',
    color: '#ffffff',
    outline: 'none',
    transition: 'border-color 0.25s ease',
    fontFamily: 'inherit',
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#070708', display: 'flex' }}>
      {/* Left side - decorative */}
      <div
        className="hidden lg:flex"
        style={{
          flex: 1,
          backgroundColor: '#0e0e10',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '32px',
          padding: '48px',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <img src="/images/corolas-logo-white.png" alt="Corolas" style={{ width: '120px', opacity: 0.9 }} />
        <div style={{ textAlign: 'center', maxWidth: '320px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: 300, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Welcome Back
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '16px', lineHeight: 1.6 }}>
            Sign in to access your Corolas account and manage your projects.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
          {['Curiosity', 'Creativity', 'Courage'].map((tag) => (
            <span
              key={tag}
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                padding: '6px 14px',
                fontSize: '10px',
                fontWeight: 500,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.4)',
                borderRadius: '100px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right side - form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(24px, 4vw, 48px)',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="/images/corolas-logo-white.png" alt="Corolas" style={{ width: '60px', margin: '0 auto' }} />
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 400, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Sign In
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '8px' }}>
            Enter your credentials to continue
          </p>

          {/* Email Form */}
          <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '28px' }}>
            <div>
              <label style={{
                fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
                display: 'block', marginBottom: '8px',
              }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(200,164,92,0.4)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <label style={{
                  fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
                }}>
                  Password
                </label>
                <Link
                  to="/reset-password"
                  style={{ fontSize: '12px', color: '#c8a45c', textDecoration: 'none' }}
                >
                  Forgot?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(200,164,92,0.4)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer', padding: '4px',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p style={{ fontSize: '13px', color: '#ef4444', padding: '10px 14px', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.15)' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%', height: '48px', backgroundColor: '#ffffff', color: '#070708',
                fontSize: '14px', fontWeight: 500, letterSpacing: '0.08em',
                border: 'none', borderRadius: '6px', cursor: isSubmitting ? 'wait' : 'pointer',
                transition: 'opacity 0.25s ease', opacity: isSubmitting ? 0.7 : 1,
                marginTop: '4px',
              }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '24px', textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#c8a45c', textDecoration: 'none', fontWeight: 500 }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
