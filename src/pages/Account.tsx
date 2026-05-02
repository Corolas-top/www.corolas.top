import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  User, Mail, Shield, LogOut, Camera, Check, AlertTriangle,
  KeyRound, Pencil, Save, X,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Account() {
  const navigate = useNavigate();
  const { user, profile, signOut, updateProfile, updatePassword, isLoading } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, navigate]);

  // Scroll animations
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current!.querySelectorAll('.account-card'), {
        y: 30, opacity: 0, duration: 0.7, stagger: 0.1,
        ease: 'power3.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' },
      });
    }, sectionRef.current);
    return () => ctx.revert();
  }, []);

  // Sync edit name with profile
  useEffect(() => {
    if (profile?.username) setEditName(profile.username);
  }, [profile?.username]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#070708', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '40px', height: '40px', border: '2px solid rgba(255,255,255,0.1)', borderTop: '2px solid #c8a45c', borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) return null;

  const displayName = profile?.username || user.user_metadata?.username || user.email?.split('@')[0] || 'User';
  const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
  const provider = user.app_metadata?.provider || 'email';
  const isOAuth = provider !== 'email';

  const handleUpdateName = async () => {
    if (!editName.trim()) return;
    setIsUpdating(true);
    setUpdateMsg('');
    const { error } = await updateProfile({ username: editName.trim() });
    setIsUpdating(false);
    if (error) {
      setUpdateMsg('Failed to update name');
    } else {
      setUpdateMsg('Name updated successfully');
      setIsEditingName(false);
      setTimeout(() => setUpdateMsg(''), 3000);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setIsChangingPassword(true);
    const { error } = await updatePassword(newPassword);
    setIsChangingPassword(false);

    if (error) {
      setPasswordError(error.message);
    } else {
      setPasswordSuccess('Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 3000);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate
    if (!file.type.startsWith('image/')) {
      setUpdateMsg('Please upload an image file');
      setTimeout(() => setUpdateMsg(''), 4000);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setUpdateMsg('Image must be under 2MB');
      setTimeout(() => setUpdateMsg(''), 4000);
      return;
    }

    setIsUploadingAvatar(true);
    setUpdateMsg('');

    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
    // Use user ID as the folder name to match RLS policy: (storage.foldername(name))[1] = auth.uid()::text
    const filePath = `${user.id}/avatar.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('profiles')
      .upload(filePath, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      setUpdateMsg(`Upload failed: ${uploadError.message}`);
      setIsUploadingAvatar(false);
      setTimeout(() => setUpdateMsg(''), 5000);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(filePath);

    // Update profile with new avatar URL
    const { error: updateError } = await updateProfile({ avatar_url: publicUrl });
    setIsUploadingAvatar(false);

    if (updateError) {
      setUpdateMsg(`Update failed: ${(updateError as Error).message || 'Unknown error'}`);
      setTimeout(() => setUpdateMsg(''), 5000);
    } else {
      setUpdateMsg('Avatar updated successfully');
      setTimeout(() => setUpdateMsg(''), 3000);
    }
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#0e0e10',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '8px',
    padding: '28px',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '11px', fontWeight: 500, letterSpacing: '0.14em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', display: 'block', marginBottom: '6px',
  };

  const valueStyle: React.CSSProperties = {
    fontSize: '14px', color: '#ffffff', wordBreak: 'break-all',
  };

  return (
    <main style={{ minHeight: '100vh', backgroundColor: '#070708' }}>
      {/* Header Banner */}
      <section style={{
        paddingTop: '120px', paddingBottom: '40px',
        paddingLeft: 'clamp(24px, 5vw, 72px)',
        paddingRight: 'clamp(24px, 5vw, 72px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '24px' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              backgroundColor: avatarUrl ? 'transparent' : 'rgba(200,164,92,0.15)',
              border: '2px solid rgba(200,164,92,0.3)',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <User size={32} color="#c8a45c" />
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              style={{
                position: 'absolute', bottom: '-2px', right: '-2px',
                width: '28px', height: '28px', borderRadius: '50%',
                backgroundColor: isUploadingAvatar ? 'rgba(200,164,92,0.5)' : '#c8a45c',
                border: '2px solid #070708',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: isUploadingAvatar ? 'wait' : 'pointer',
                transition: 'opacity 0.2s ease',
              }}
            >
              {isUploadingAvatar ? (
                <div style={{ width: '12px', height: '12px', border: '1.5px solid #070708', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                <Camera size={13} color="#070708" />
              )}
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: 'none' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {isEditingName ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{
                      backgroundColor: '#0e0e10', border: '1px solid rgba(200,164,92,0.4)',
                      borderRadius: '4px', padding: '6px 12px', color: '#ffffff', fontSize: '18px',
                      outline: 'none', fontFamily: 'inherit',
                    }}
                  />
                  <button onClick={handleUpdateName} disabled={isUpdating} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#22c55e', padding: '4px' }}>
                    <Save size={16} />
                  </button>
                  <button onClick={() => { setIsEditingName(false); setEditName(profile?.username || ''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '4px' }}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <h1 style={{ fontSize: '22px', fontWeight: 500, color: '#ffffff', letterSpacing: '-0.01em' }}>
                    {displayName}
                  </h1>
                  <button onClick={() => setIsEditingName(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: '4px' }}>
                    <Pencil size={14} />
                  </button>
                </>
              )}
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>{user.email}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
              <span style={{
                fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em',
                textTransform: 'uppercase', color: '#4ade80',
                backgroundColor: 'rgba(74,222,128,0.1)', padding: '3px 10px', borderRadius: '4px',
              }}>
                {isOAuth ? provider : 'Email'}
              </span>
              {user.email_confirmed_at && (
                <span style={{
                  fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em',
                  textTransform: 'uppercase', color: '#c8a45c',
                  backgroundColor: 'rgba(200,164,92,0.1)', padding: '3px 10px', borderRadius: '4px',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                  <Check size={10} /> Verified
                </span>
              )}
            </div>
            {updateMsg && (
              <p style={{ fontSize: '12px', color: updateMsg.includes('success') ? '#22c55e' : '#ef4444', marginTop: '8px' }}>
                {updateMsg}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Account Details */}
      <section
        ref={sectionRef}
        style={{
          padding: 'clamp(40px, 6vh, 64px) clamp(24px, 5vw, 72px)',
          maxWidth: '800px', margin: '0 auto',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Profile Information */}
          <div className="account-card" style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <User size={16} color="rgba(255,255,255,0.5)" />
              <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff', letterSpacing: '0.02em' }}>Profile Information</h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <div>
                <span style={labelStyle}>User ID</span>
                <span style={{ ...valueStyle, fontFamily: '"SF Mono", monospace', fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>
                  {user.id.slice(0, 12)}...{user.id.slice(-4)}
                </span>
              </div>
              <div>
                <span style={labelStyle}>Email</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={13} color="rgba(255,255,255,0.4)" />
                  <span style={valueStyle}>{user.email}</span>
                </div>
              </div>
              <div>
                <span style={labelStyle}>Auth Provider</span>
                <span style={{ ...valueStyle, textTransform: 'capitalize' }}>{provider}</span>
              </div>
              <div>
                <span style={labelStyle}>Member Since</span>
                <span style={valueStyle}>{new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            </div>
          </div>

          {/* Security - Password Change (only for email auth) */}
          {!isOAuth && (
            <div className="account-card" style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Shield size={16} color="rgba(255,255,255,0.5)" />
                <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff', letterSpacing: '0.02em' }}>Security</h3>
              </div>

              <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '400px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Min 8 characters"
                    style={{
                      width: '100%', height: '42px', backgroundColor: '#070708',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px',
                      padding: '0 14px', fontSize: '14px', color: '#ffffff', outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: '6px' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repeat password"
                    style={{
                      width: '100%', height: '42px', backgroundColor: '#070708',
                      border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px',
                      padding: '0 14px', fontSize: '14px', color: '#ffffff', outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                {passwordError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: '6px', border: '1px solid rgba(239,68,68,0.15)' }}>
                    <AlertTriangle size={14} color="#ef4444" />
                    <span style={{ fontSize: '13px', color: '#ef4444' }}>{passwordError}</span>
                  </div>
                )}
                {passwordSuccess && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'rgba(74,222,128,0.08)', borderRadius: '6px', border: '1px solid rgba(74,222,128,0.15)' }}>
                    <Check size={14} color="#22c55e" />
                    <span style={{ fontSize: '13px', color: '#22c55e' }}>{passwordSuccess}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  style={{
                    height: '42px', backgroundColor: 'transparent', color: '#ffffff',
                    border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px',
                    fontSize: '13px', fontWeight: 500, letterSpacing: '0.08em',
                    cursor: isChangingPassword ? 'wait' : 'pointer',
                    transition: 'all 0.25s ease', opacity: isChangingPassword ? 0.7 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  }}
                  onMouseEnter={(e) => { if (!isChangingPassword) e.currentTarget.style.borderColor = 'rgba(200,164,92,0.5)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                >
                  <KeyRound size={14} />
                  {isChangingPassword ? 'Updating...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}

          {/* Danger Zone */}
          <div className="account-card" style={{ ...cardStyle, borderColor: 'rgba(239,68,68,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <LogOut size={16} color="#ef4444" />
              <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#ef4444', letterSpacing: '0.02em' }}>Session</h3>
            </div>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '16px', lineHeight: 1.5 }}>
              Sign out of your account on this device.
            </p>
            <button
              onClick={async () => { await signOut(); navigate('/'); }}
              style={{
                height: '40px', padding: '0 24px', backgroundColor: 'rgba(239,68,68,0.1)',
                color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '6px',
                fontSize: '13px', fontWeight: 500, letterSpacing: '0.06em', cursor: 'pointer',
                transition: 'all 0.25s ease', display: 'flex', alignItems: 'center', gap: '8px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'; }}
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
