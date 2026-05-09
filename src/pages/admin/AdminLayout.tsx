import { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import {
  LayoutDashboard, FolderKanban, Users, Bot, Settings,
  LogOut, Menu, X, ChevronRight, Shield,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Projects', path: '/admin/projects', icon: FolderKanban },
  { label: 'Users', path: '/admin/users', icon: Users },
  { label: 'AI Agents', path: '/admin/ai-agents', icon: Bot },
  { label: 'OAuth Config', path: '/admin/oauth', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { admin, isAuthenticated, isLoading, logout } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#070708', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: '2px solid rgba(255,255,255,0.1)', borderTop: '2px solid #c8a45c', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const pageTitle = navItems.find(n => n.path === location.pathname)?.label || 'Console';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#070708', display: 'flex' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden"
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{
          position: sidebarOpen ? 'fixed' : 'sticky',
          top: 0, left: 0,
          width: '260px', minWidth: '260px',
          height: '100vh',
          backgroundColor: '#0a0a0c',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', flexDirection: 'column',
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : undefined,
        }}
        className={sidebarOpen ? '' : 'hidden lg:flex'}
      >
        {/* Sidebar Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              backgroundColor: 'rgba(200,164,92,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={18} color="#c8a45c" />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff' }}>Corolas Console</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Admin</p>
            </div>
          </div>
          <button
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'absolute', top: '20px', right: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px',
                  fontSize: '13px', fontWeight: 400,
                  color: isActive ? '#c8a45c' : 'rgba(255,255,255,0.55)',
                  backgroundColor: isActive ? 'rgba(200,164,92,0.08)' : 'transparent',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#ffffff'; }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }
                }}
              >
                <Icon size={16} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: 'rgba(200,164,92,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', color: '#c8a45c', fontWeight: 500,
            }}>
              {admin?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '13px', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{admin?.username}</p>
              <p style={{ fontSize: '10px', color: '#c8a45c', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{admin?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%', height: '36px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              backgroundColor: 'rgba(239,68,68,0.08)', color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.15)', borderRadius: '6px',
              fontSize: '12px', fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s ease', fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.15)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'; }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <header style={{
          height: '60px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: 'rgba(7,7,8,0.95)',
          backdropFilter: 'blur(12px)',
          position: 'sticky', top: 0, zIndex: 30,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', padding: '6px' }}
            >
              <Menu size={20} />
            </button>
            <h2 style={{ fontSize: '16px', fontWeight: 400, color: '#ffffff', letterSpacing: '-0.01em' }}>{pageTitle}</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em',
              textTransform: 'uppercase', color: '#4ade80',
              backgroundColor: 'rgba(74,222,128,0.1)', padding: '4px 10px', borderRadius: '4px',
            }}>
              Live
            </span>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
