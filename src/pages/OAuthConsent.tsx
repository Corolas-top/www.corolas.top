import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Shield, Check, X, ExternalLink } from 'lucide-react';

interface AuthorizationDetails {
  client_id: string;
  client_name?: string;
  client_uri?: string;
  scope: string;
  user_id: string;
}

export default function OAuthConsent() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading } = useAuth();

  const [authDetails, setAuthDetails] = useState<AuthorizationDetails | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const authorizationId = searchParams.get('authorization_id');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      navigate(`/login?redirect=${returnUrl}`);
    }
  }, [user, isLoading, navigate]);

  // Fetch authorization details
  useEffect(() => {
    if (!authorizationId || !user) return;

    const fetchDetails = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const oauthApi = (supabase.auth as any).oauth;
        if (!oauthApi) {
          setError('OAuth API not available in this SDK version');
          setIsFetching(false);
          return;
        }
        const result = await oauthApi.getAuthorizationDetails(authorizationId);
        if (result.error) {
          setError(result.error.message || 'Failed to load authorization details');
        } else if (result.data) {
          setAuthDetails(result.data as unknown as AuthorizationDetails);
        }
      } catch {
        setError('Unable to retrieve authorization details');
      } finally {
        setIsFetching(false);
      }
    };

    fetchDetails();
  }, [authorizationId, user]);

  const handleApprove = async () => {
    if (!authorizationId) return;
    setIsProcessing(true);
    setError('');

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const oauthApi = (supabase.auth as any).oauth;
      if (!oauthApi) {
        setError('OAuth API not available');
        setIsProcessing(false);
        return;
      }
      const result = await oauthApi.approveAuthorization(authorizationId);

      if (result.error) {
        setError(result.error.message || 'Approval failed');
        setIsProcessing(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const redirect = (result.data as any)?.redirect_to;
      if (redirect) {
        window.location.href = redirect;
      }
    } catch {
      setError('Approval failed. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleDeny = async () => {
    if (!authorizationId) return;
    setIsProcessing(true);
    setError('');

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const oauthApi = (supabase.auth as any).oauth;
      if (!oauthApi) {
        setError('OAuth API not available');
        setIsProcessing(false);
        return;
      }
      const result = await oauthApi.denyAuthorization(authorizationId);

      if (result.error) {
        setError(result.error.message || 'Denial failed');
        setIsProcessing(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const redirect = (result.data as any)?.redirect_to;
      if (redirect) {
        window.location.href = redirect;
      }
    } catch {
      setError('Denial failed. Please try again.');
      setIsProcessing(false);
    }
  };

  // Parse scopes into human-readable labels
  const parseScopes = (scopeStr: string): string[] => {
    const scopeMap: Record<string, string> = {
      openid: 'Access your basic identity information',
      email: 'Access your email address',
      profile: 'Access your profile (name, avatar)',
      offline_access: 'Maintain access while you are offline',
    };
    return scopeStr.split(' ').map((s) => scopeMap[s] || `Access: ${s}`);
  };

  if (isLoading || isFetching) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: '#070708',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '40px', height: '40px',
          border: '2px solid rgba(255,255,255,0.1)', borderTop: '2px solid #c8a45c', borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error && !authDetails) {
    return (
      <div style={{
        minHeight: '100vh', backgroundColor: '#070708',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      }}>
        <div style={{ maxWidth: '420px', textAlign: 'center' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <X size={24} color="#ef4444" />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 400, color: '#ffffff' }}>Authorization Error</h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', marginTop: '12px' }}>{error}</p>
        </div>
      </div>
    );
  }

  const clientName = authDetails?.client_name || authDetails?.client_id || 'Unknown Application';
  const scopes = authDetails?.scope ? parseScopes(authDetails.scope) : [];

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#070708', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/images/corolas-logo-white.png" alt="Corolas" style={{ width: '56px', margin: '0 auto 16px' }} />
          <h1 style={{ fontSize: '20px', fontWeight: 400, color: '#ffffff' }}>
            Authorize {clientName}
          </h1>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginTop: '8px' }}>
            This application is requesting access to your Corolas account
          </p>
        </div>

        {/* Consent Card */}
        <div style={{
          backgroundColor: '#0e0e10',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}>
          {/* Client info */}
          <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '10px',
                backgroundColor: 'rgba(200,164,92,0.1)',
                border: '1px solid rgba(200,164,92,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Shield size={20} color="#c8a45c" />
              </div>
              <div>
                <p style={{ fontSize: '15px', fontWeight: 500, color: '#ffffff' }}>{clientName}</p>
                {authDetails?.client_uri && (
                  <a
                    href={authDetails.client_uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '12px', color: '#c8a45c', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    {authDetails.client_uri} <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Scopes */}
          {scopes.length > 0 && (
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '14px' }}>
                Requested Permissions
              </p>
              {scopes.map((scope, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: i < scopes.length - 1 ? '10px' : 0 }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(200,164,92,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                    <Check size={11} color="#c8a45c" />
                  </div>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>{scope}</span>
                </div>
              ))}
            </div>
          )}

          {/* User info */}
          <div style={{ padding: '16px 24px', backgroundColor: 'rgba(200,164,92,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)' }}>
              Signed in as <strong style={{ color: '#ffffff' }}>{user?.email}</strong>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ padding: '12px 24px', backgroundColor: 'rgba(239,68,68,0.06)' }}>
              <p style={{ fontSize: '13px', color: '#ef4444' }}>{error}</p>
            </div>
          )}

          {/* Actions */}
          <div style={{ padding: '20px 24px', display: 'flex', gap: '12px' }}>
            <button
              onClick={handleDeny}
              disabled={isProcessing}
              style={{
                flex: 1, height: '44px',
                backgroundColor: 'transparent', color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px',
                fontSize: '14px', fontWeight: 500, cursor: isProcessing ? 'wait' : 'pointer',
                transition: 'all 0.25s ease', opacity: isProcessing ? 0.6 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
              onMouseEnter={(e) => { if (!isProcessing) e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; }}
            >
              <X size={14} /> Deny
            </button>
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              style={{
                flex: 1, height: '44px',
                backgroundColor: '#ffffff', color: '#070708',
                border: 'none', borderRadius: '6px',
                fontSize: '14px', fontWeight: 500, cursor: isProcessing ? 'wait' : 'pointer',
                transition: 'opacity 0.25s ease', opacity: isProcessing ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}
            >
              <Check size={14} /> {isProcessing ? 'Processing...' : 'Approve'}
            </button>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '20px' }}>
          You can revoke this access at any time from your Account Settings.
        </p>
      </div>
    </main>
  );
}
