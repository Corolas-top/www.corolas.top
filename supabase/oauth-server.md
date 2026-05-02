# Corolas OAuth 2.1 Server — Implementation Guide

Supabase OAuth 2.1 Server allows your Corolas project to act as an **Identity Provider** (IdP), letting third-party applications authenticate users through their Corolas accounts.

---

## Architecture

```
Third-Party App (e.g., Platonic)
  |
  |  1. Redirect to Corolas authorize endpoint
  v
Supabase Auth (/auth/v1/oauth/authorize)
  |
  |  2. User signs in (if not already)
  |  3. Redirect to Consent Screen
  v
Corolas Consent Screen (/oauth/consent)
  |
  |  4. User approves/denies
  v
Supabase Auth (approval/denial API)
  |
  |  5. Authorization code + redirect back
  v
Third-Party App (callback handler)
  |
  |  6. Exchange code for tokens
  v
Supabase Token Endpoint (/auth/v1/oauth/token)
  |
  |  7. Access token + ID token
  v
Third-Party App (authenticated)
```

---

## Supabase Dashboard Configuration

### 1. Enable OAuth Server (already done)

From your screenshot, you've already enabled it:
- Project Settings → OAuth Server → Enable OAuth Server: **ON**
- Site URL: `https://www.corolas.top`
- Authorization Path: `/oauth/consent` (matches our page)

### 2. Register OAuth Clients

Each third-party project needs to be registered as an OAuth client:

**Supabase Dashboard → Authentication → OAuth Server → Clients → Add Client**

For Platonic:
| Field | Value |
|-------|-------|
| Client Name | `Platonic` |
| Redirect URIs | `https://platonic.corolas.top/auth/callback` |
| Allowed Scopes | `openid email profile` |
| Confidential | No (SPA, uses PKCE) |

For Yhea:
| Field | Value |
|-------|-------|
| Client Name | `Yhea` |
| Redirect URIs | `https://yhea.corolas.top/auth/callback` |
| Allowed Scopes | `openid email profile` |
| Confidential | No |

For Thea:
| Field | Value |
|-------|-------|
| Client Name | `Thea` |
| Redirect URIs | `https://thea.corolas.top/auth/callback` |
| Allowed Scopes | `openid email profile` |
| Confidential | No |

For Edith:
| Field | Value |
|-------|-------|
| Client Name | `Edith` |
| Redirect URIs | `https://edith.corolas.top/auth/callback` |
| Allowed Scopes | `openid email profile` |
| Confidential | No |

After registration, each client gets:
- **Client ID**: e.g., `pl-xxxxxxxx`
- **Client Secret**: (only if Confidential)

---

## Endpoints (from your Supabase project)

| Endpoint | URL |
|----------|-----|
| Authorization | `https://febdusjxlkniozqyyyjk.supabase.co/auth/v1/oauth/authorize` |
| Token | `https://febdusjxlkniozqyyyjk.supabase.co/auth/v1/oauth/token` |
| JWKS | `https://febdusjxlkniozqyyyjk.supabase.co/auth/v1/.well-known/jwks.json` |
| OIDC Discovery | `https://febdusjxlkniozqyyyjk.supabase.co/auth/v1/.well-known/openid-configuration` |

---

## How Third-Party Apps Implement Login

### Option A: Using Supabase Client (Recommended)

Each sub-project uses the same Supabase client config but with **additional OAuth provider setup**:

```typescript
// In platonic.corolas.top's auth setup
const supabase = createClient(
  'https://febdusjxlkniozqyyyjk.supabase.co',
  'eyJhbG...platonic-client-publishable-key...',
  {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);

// Login via Corolas
async function signInWithCorolas() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'corolas', // or custom provider name
    options: {
      redirectTo: 'https://platonic.corolas.top/auth/callback',
    },
  });
  if (error) console.error(error);
}
```

### Option B: Manual OAuth 2.1 Flow (PKCE)

If using a different backend or framework:

```typescript
// 1. Generate PKCE parameters
const codeVerifier = generateRandomString(128);
const codeChallenge = await sha256Base64UrlEncode(codeVerifier);
localStorage.setItem('pkce_code_verifier', codeVerifier);

// 2. Build authorization URL
const params = new URLSearchParams({
  client_id: 'pl-xxxxxxxx',           // Client ID from Supabase Dashboard
  response_type: 'code',
  scope: 'openid email profile',
  redirect_uri: 'https://platonic.corolas.top/auth/callback',
  code_challenge: codeChallenge,
  code_challenge_method: 'S256',
  state: generateRandomString(32),    // CSRF protection
});

const authorizeUrl = `https://febdusjxlkniozqyyyjk.supabase.co/auth/v1/oauth/authorize?${params}`;
window.location.href = authorizeUrl;

// 3. On callback page, exchange code for tokens
async function handleCallback(authCode: string) {
  const codeVerifier = localStorage.getItem('pkce_code_verifier');

  const response = await fetch(
    'https://febdusjxlkniozqyyyjk.supabase.co/auth/v1/oauth/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: 'pl-xxxxxxxx',
        code: authCode,
        code_verifier: codeVerifier,
        redirect_uri: 'https://platonic.corolas.top/auth/callback',
      }),
    }
  );

  const { access_token, id_token, refresh_token } = await response.json();
  // Store tokens securely (httpOnly cookie recommended)
}
```

### Option C: OIDC Discovery (Auto-configure)

```typescript
// Fetch OIDC configuration automatically
const oidcConfig = await fetch(
  'https://febdusjxlkniozqyyyjk.supabase.co/auth/v1/.well-known/openid-configuration'
).then(r => r.json());

// Use any OIDC library (e.g., oidc-client-ts, next-auth)
// It will auto-discover all endpoints from this URL
```

---

## Token Validation

When your sub-project receives an access token, validate it:

```typescript
import { jwtVerify, createRemoteJWKSet } from 'jose';

const JWKS = createRemoteJWKSet(
  new URL('https://febdusjxlkniozqyyyjk.supabase.co/auth/v1/.well-known/jwks.json')
);

async function validateToken(accessToken: string) {
  const { payload } = await jwtVerify(accessToken, JWKS, {
    issuer: 'https://febdusjxlkniozqyyyjk.supabase.co/auth/v1',
    audience: 'pl-xxxxxxxx', // Your client ID
    clockTolerance: 60,
  });

  return payload; // Contains: sub (user_id), email, etc.
}
```

---

## Consent Screen API Notes

The consent screen (`/oauth/consent`) in this project uses the experimental Supabase OAuth Server APIs. The API methods are accessed via:

```typescript
// Get authorization details for display
supabase.auth.oauth.getAuthorizationDetails(authorizationId)

// Approve the authorization request
supabase.auth.oauth.approveAuthorization(authorizationId)

// Deny the authorization request
supabase.auth.oauth.denyAuthorization(authorizationId)
```

> **Note**: These APIs may not be fully typed in the current `@supabase/supabase-js` SDK. TypeScript `@ts-ignore` comments are used in the implementation. As Supabase matures this feature, the types will be added automatically.

---

## Security Checklist

- [ ] All redirect URIs use HTTPS (no HTTP)
- [ ] PKCE is enforced (no `code_challenge` = rejection)
- [ ] Client IDs are treated as public (no secrets in SPAs)
- [ ] Access tokens are validated server-side (never trust client)
- [ ] State parameter is verified on callback (CSRF protection)
- [ ] `openid` scope is always requested (enables ID token)
- [ ] Consent screen is served over HTTPS
- [ ] Token expiration is respected (short-lived access tokens)
- [ ] Refresh tokens are stored securely (httpOnly cookies)

---

## Summary

**Yes, Supabase OAuth Server fully supports your use case.** Your Corolas project can act as an identity provider for Platonic, Yhea, Thea, and Edith — exactly like "Sign in with Google" but branded as "Sign in with Corolas".

The flow is:
1. Register each sub-project as an OAuth client in Supabase Dashboard
2. Sub-projects redirect to Supabase authorize endpoint
3. User signs in on Corolas (if needed) and sees the consent screen
4. User approves → authorization code → sub-project callback
5. Sub-project exchanges code for access token + ID token
6. Sub-project validates token and creates local session
