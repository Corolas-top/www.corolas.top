import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // PKCE flow: Supabase client automatically detects auth code in URL
        // and exchanges it for a session when detectSessionInUrl: true
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Auth callback error:', error);
          setStatus('error');
          return;
        }

        if (session) {
          setStatus('success');
          setTimeout(() => navigate('/'), 800);
        } else {
          // Wait briefly for session to be established
          setTimeout(async () => {
            const { data: { session: delayedSession } } = await supabase.auth.getSession();
            if (delayedSession) {
              setStatus('success');
              setTimeout(() => navigate('/'), 800);
            } else {
              setStatus('error');
            }
          }, 1500);
        }
      } catch {
        setStatus('error');
      }
    };

    handleCallback();
  }, [navigate]);

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    backgroundColor: '#070708',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: '20px',
    padding: '24px',
  };

  if (status === 'verifying') {
    return (
      <div style={containerStyle}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '2px solid rgba(255,255,255,0.1)',
          borderTop: '2px solid #c8a45c',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
          Verifying your session...
        </p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={containerStyle}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(74,222,128,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 500 }}>Authentication Successful</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Redirecting you...</p>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        backgroundColor: 'rgba(239,68,68,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
      <h2 style={{ color: '#ffffff', fontSize: '20px', fontWeight: 500 }}>Authentication Failed</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', textAlign: 'center', maxWidth: '400px' }}>
        The authentication link has expired or is invalid. Please try again.
      </p>
      <button
        onClick={() => navigate('/login')}
        style={{
          marginTop: '16px',
          padding: '12px 28px',
          border: '1px solid #ffffff',
          background: 'transparent',
          color: '#ffffff',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ffffff';
          e.currentTarget.style.color = '#070708';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = '#ffffff';
        }}
      >
        Back to Login
      </button>
    </div>
  );
}
