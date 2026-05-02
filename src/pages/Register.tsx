import { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, Check, X } from 'lucide-react';

export default function Register() {
  const { signUpWithEmail, signInWithOAuth } = useAuth();
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
      // Show Supabase error message; if it's a 500, suggest OAuth as fallback
      const msg = authError.message || 'An unexpected error occurred';
      if (msg.includes('500') || msg.includes('Internal Server Error') || msg.includes('internal')) {
        setError(
          'Email signup is temporarily unavailable. Please try signing up with Google, Discord, or GitHub instead.'
        );
      } else {
        setError(msg);
      }
    } else if (needsEmailConfirmation) {
      setNeedsConfirmation(true);
    }
  };

  const handleOAuth = async (provider: 'google' | 'discord' | 'github') => {
    setError('');
    const { error: oauthError } = await signInWithOAuth(provider);
    if (oauthError) setError(oauthError.message);
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

          {/* OAuth */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '28px' }}>
            <OAuthButton provider="google" onClick={() => handleOAuth('google')} />
            <OAuthButton provider="discord" onClick={() => handleOAuth('discord')} />
            <OAuthButton provider="github" onClick={() => handleOAuth('github')} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '28px 0' }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>or</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

function OAuthButton({ provider, onClick }: { provider: 'google' | 'discord' | 'github'; onClick: () => void }) {
  const config = {
    google: { label: 'Continue with Google', icon: GoogleIcon },
    discord: { label: 'Continue with Discord', icon: DiscordIcon },
    github: { label: 'Continue with GitHub', icon: GitHubIcon },
  };
  const { label, icon: Icon } = config[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%', height: '44px', backgroundColor: '#0e0e10', color: '#ffffff',
        border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', fontSize: '14px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
        cursor: 'pointer', transition: 'all 0.25s ease', fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.backgroundColor = '#0e0e10'; }}
    >
      <Icon />
      <span>{label}</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#5865F2">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
      <path d="M12 1C5.925 1 1 5.925 1 12c0 4.86 3.152 8.983 7.523 10.437.55.102.753-.238.753-.53 0-.26-.009-.952-.014-1.87-3.06.665-3.705-1.475-3.705-1.475-.5-1.27-1.222-1.61-1.222-1.61-.998-.683.076-.669.076-.669 1.104.078 1.685 1.133 1.685 1.133.98 1.68 2.572 1.195 3.2.914.098-.71.384-1.196.698-1.47-2.442-.278-5.01-1.222-5.01-5.437 0-1.2.428-2.183 1.132-2.95-.114-.278-.491-1.397.107-2.915 0 0 .92-.295 3.015 1.127A10.464 10.464 0 0112 5.73c.935.004 1.876.126 2.756.37 2.093-1.422 3.012-1.127 3.012-1.127.6 1.518.223 2.637.109 2.915.705.767 1.13 1.75 1.13 2.95 0 4.226-2.572 5.156-5.022 5.428.395.34.747 1.01.747 2.037 0 1.47-.014 2.657-.014 3.017 0 .295.2.637.76.53C19.85 20.98 23 16.858 23 12c0-6.075-4.925-11-11-11z" />
    </svg>
  );
}
