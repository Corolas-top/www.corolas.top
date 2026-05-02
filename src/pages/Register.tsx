import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Check, X } from 'lucide-react';

export default function Register() {
  const { signUpWithEmail } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  // Password strength checks
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  const strengthScore = [hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;

  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (strengthScore < 3) {
      setError('Please choose a stronger password.');
      return;
    }

    setIsSubmitting(true);
    const { error: authError, needsEmailConfirmation } = await signUpWithEmail(email, password, username);
    setIsSubmitting(false);

    if (authError) {
      const msg = authError.message || 'An unexpected error occurred';
      if (msg.includes('500') || msg.includes('Internal Server Error') || msg.includes('internal')) {
        setError(
          'Email signup is temporarily unavailable. This may be due to SMTP configuration. Please try again later or contact hello@corolas.top.'
        );
      } else {
        setError(msg);
      }
    } else if (needsEmailConfirmation) {
      setNeedsConfirmation(true);
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

  // Email confirmation success state
  if (needsConfirmation) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#070708', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '420px', textAlign: 'center' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            backgroundColor: 'rgba(200,164,92,0.1)',
            border: '1px solid rgba(200,164,92,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c8a45c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 400, color: '#ffffff' }}>
            Verify Your Email
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', marginTop: '12px', lineHeight: 1.6 }}>
            We've sent a confirmation link to <strong style={{ color: '#ffffff' }}>{email}</strong>.
            Please check your inbox and click the link to activate your account.
          </p>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginTop: '20px' }}>
            Didn't receive it? Check your spam folder or{' '}
            <ResendLink email={email} />
          </p>
          <Link
            to="/login"
            style={{
              display: 'inline-block', marginTop: '32px',
              fontSize: '13px', fontWeight: 500, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: '#c8a45c', textDecoration: 'none',
            }}
          >
            Back to Sign In &rarr;
          </Link>
        </div>
      </main>
    );
  }

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
            Join Corolas
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '16px', lineHeight: 1.6 }}>
            Create an account to start building with us.
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px, 4vw, 48px)' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div className="lg:hidden" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <img src="/images/corolas-logo-white.png" alt="Corolas" style={{ width: '60px', margin: '0 auto' }} />
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 400, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Create Account
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '8px' }}>
            Fill in your details to get started
          </p>

          {/* Registration Form */}
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '28px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px' }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Choose a username"
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(200,164,92,0.4)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>

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

            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '8px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a strong password"
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(200,164,92,0.4)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '4px' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {password.length > 0 && (
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1, height: '3px', borderRadius: '2px',
                          backgroundColor: i <= strengthScore ? strengthColors[strengthScore - 1] : 'rgba(255,255,255,0.08)',
                          transition: 'background-color 0.3s ease',
                        }}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '11px', color: strengthScore > 0 ? strengthColors[strengthScore - 1] : 'rgba(255,255,255,0.35)', fontWeight: 500 }}>
                    {strengthLabels[strengthScore - 1] || 'Enter password'}
                  </span>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 16px', marginTop: '8px' }}>
                    <StrengthCheck label="8+ characters" passed={hasMinLength} />
                    <StrengthCheck label="Uppercase letter" passed={hasUppercase} />
                    <StrengthCheck label="Lowercase letter" passed={hasLowercase} />
                    <StrengthCheck label="Number" passed={hasNumber} />
                    <StrengthCheck label="Special character" passed={hasSpecial} />
                  </div>
                </div>
              )}
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
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', marginTop: '24px', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#c8a45c', textDecoration: 'none', fontWeight: 500 }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

/* ─── Sub-components ─── */

function StrengthCheck({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
      {passed
        ? <Check size={12} color="#22c55e" />
        : <X size={12} color="rgba(255,255,255,0.25)" />
      }
      <span style={{ fontSize: '11px', color: passed ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)' }}>{label}</span>
    </div>
  );
}

function ResendLink({ email }: { email: string }) {
  const { resendConfirmation } = useAuth();
  const [sent, setSent] = useState(false);

  const handleResend = async () => {
    const { error } = await resendConfirmation(email);
    if (!error) setSent(true);
  };

  if (sent) return <span style={{ color: '#22c55e' }}>Sent!</span>;

  return (
    <button
      onClick={handleResend}
      style={{ background: 'none', border: 'none', color: '#c8a45c', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: '3px', fontSize: 'inherit', padding: 0 }}
    >
      resend
    </button>
  );
}
