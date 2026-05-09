import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Shield, Eye, EyeOff, AlertTriangle } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAdminAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const { error: loginError } = await login(username, password);
    setIsSubmitting(false);

    if (loginError) {
      setError(loginError);
    } else {
      navigate('/admin');
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
    <div style={{ minHeight: '100vh', backgroundColor: '#070708', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '16px',
            backgroundColor: 'rgba(200,164,92,0.1)',
            border: '1px solid rgba(200,164,92,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Shield size={32} color="#c8a45c" />
          </div>
          <img src="/images/corolas-logo-white.png" alt="Corolas" style={{ width: '48px', margin: '0 auto 16px', opacity: 0.8 }} />
          <h1 style={{ fontSize: '22px', fontWeight: 400, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Corolas Console
          </h1>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', marginTop: '8px' }}>
            Authorized personnel only. No public registration.
          </p>
        </div>

        {/* Login Form */}
        <div style={{
          backgroundColor: '#0e0e10',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          padding: '32px',
        }}>
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px', marginBottom: '20px',
              backgroundColor: 'rgba(239,68,68,0.08)',
              borderRadius: '6px', border: '1px solid rgba(239,68,68,0.15)',
            }}>
              <AlertTriangle size={16} color="#ef4444" />
              <span style={{ fontSize: '13px', color: '#ef4444' }}>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
                display: 'block', marginBottom: '8px',
              }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="Enter admin username"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(200,164,92,0.4)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>

            <div>
              <label style={{
                fontSize: '11px', fontWeight: 500, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
                display: 'block', marginBottom: '8px',
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
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

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%', height: '48px', marginTop: '8px',
                backgroundColor: '#c8a45c', color: '#070708',
                fontSize: '14px', fontWeight: 600, letterSpacing: '0.08em',
                border: 'none', borderRadius: '6px',
                cursor: isSubmitting ? 'wait' : 'pointer',
                transition: 'opacity 0.25s ease', opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Console'}
            </button>
          </form>

          <div style={{
            marginTop: '20px', paddingTop: '20px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
              Passwords are hashed with bcrypt. No plaintext storage.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
