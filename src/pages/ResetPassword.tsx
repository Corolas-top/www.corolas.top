import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const { error: authError } = await resetPassword(email);
    setIsSubmitting(false);

    if (authError) {
      setError(authError.message);
    } else {
      setSent(true);
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
    <main style={{ minHeight: '100vh', backgroundColor: '#070708', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/images/corolas-logo-white.png" alt="Corolas" style={{ width: '60px', margin: '0 auto' }} />
        </div>

        {!sent ? (
          <>
            <h1 style={{ fontSize: '24px', fontWeight: 400, color: '#ffffff', letterSpacing: '-0.02em', textAlign: 'center' }}>
              Reset Password
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '8px', textAlign: 'center' }}>
              Enter your email and we'll send you a reset link
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '28px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px' }}>
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
                  transition: 'opacity 0.25s ease', opacity: isSubmitting ? 0.7 : 1, marginTop: '4px',
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'rgba(200,164,92,0.1)', border: '1px solid rgba(200,164,92,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8a45c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 400, color: '#ffffff' }}>Check Your Email</h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', marginTop: '12px', lineHeight: 1.6 }}>
              We've sent a password reset link to <strong style={{ color: '#ffffff' }}>{email}</strong>.
            </p>
          </div>
        )}

        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '24px', textAlign: 'center' }}>
          Remember your password?{' '}
          <Link to="/login" style={{ color: '#c8a45c', textDecoration: 'none', fontWeight: 500 }}>Sign In</Link>
        </p>
      </div>
    </main>
  );
}
