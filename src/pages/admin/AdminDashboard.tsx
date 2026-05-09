import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '@/lib/supabase';
import { adminSupabase } from '@/lib/admin-supabase';
import {
  FolderKanban, Users, Bot, Activity,
  Globe, Mail, Shield,
} from 'lucide-react';

interface Stats {
  totalProjects: number;
  totalUsers: number;
  totalAgents: number;
  contactSubmissions: number;
  platformCount: number;
  applicationCount: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProjects: 0, totalUsers: 0, totalAgents: 0,
    contactSubmissions: 0, platformCount: 0, applicationCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [recentContacts, setRecentContacts] = useState<Array<{name: string; email: string; subject: string; created_at: string}>>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Projects count
        const { count: projectCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
        const { count: platformCount } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('category', 'platform');
        const { count: appCount } = await supabase.from('projects').select('*', { count: 'exact', head: true }).eq('category', 'application');

        // Users count (from main supabase auth)
        const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

        // AI Agents count
        const { count: agentCount } = await adminSupabase.from('ai_agents').select('*', { count: 'exact', head: true });

        // Contact submissions
        const { count: contactCount, data: recent } = await supabase
          .from('contact_submissions')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .limit(5);

        setStats({
          totalProjects: projectCount || 0,
          totalUsers: userCount || 0,
          totalAgents: agentCount || 0,
          contactSubmissions: contactCount || 0,
          platformCount: platformCount || 0,
          applicationCount: appCount || 0,
        });
        setRecentContacts(recent || []);
      } catch {
        // Silent fail
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, icon: FolderKanban, color: '#c8a45c', path: '/admin/projects' },
    { label: 'Registered Users', value: stats.totalUsers, icon: Users, color: '#4ade80', path: '/admin/users' },
    { label: 'AI Agents', value: stats.totalAgents, icon: Bot, color: '#a78bfa', path: '/admin/ai-agents' },
    { label: 'Contact Messages', value: stats.contactSubmissions, icon: Mail, color: '#f472b6', path: '/admin/users' },
  ];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <div style={{ width: '32px', height: '32px', border: '2px solid rgba(255,255,255,0.1)', borderTop: '2px solid #c8a45c', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Welcome */}
      <div>
        <h1 style={{ fontSize: '20px', fontWeight: 400, color: '#ffffff' }}>Welcome to Corolas Console</h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>Monitor and manage all Corolas services from one place.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => navigate(card.path)}
              style={{
                backgroundColor: '#0e0e10', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px',
                padding: '20px', textAlign: 'left', cursor: 'pointer',
                transition: 'all 0.25s ease', fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Icon size={18} color={card.color} />
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>{card.label}</span>
              </div>
              <p style={{ fontSize: '28px', fontWeight: 300, color: '#ffffff', letterSpacing: '-0.02em' }}>{card.value}</p>
            </button>
          );
        })}
      </div>

      {/* Projects Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        <div style={{ backgroundColor: '#0e0e10', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Globe size={16} color="#c8a45c" /> Project Categories
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Platforms</span>
                <span style={{ fontSize: '13px', color: '#c8a45c', fontWeight: 500 }}>{stats.platformCount}</span>
              </div>
              <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${stats.totalProjects ? (stats.platformCount / stats.totalProjects * 100) : 0}%`, backgroundColor: '#c8a45c', borderRadius: '2px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Applications</span>
                <span style={{ fontSize: '13px', color: '#4ade80', fontWeight: 500 }}>{stats.applicationCount}</span>
              </div>
              <div style={{ height: '4px', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${stats.totalProjects ? (stats.applicationCount / stats.totalProjects * 100) : 0}%`, backgroundColor: '#4ade80', borderRadius: '2px', transition: 'width 0.5s ease' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Contacts */}
        <div style={{ backgroundColor: '#0e0e10', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={16} color="#f472b6" /> Recent Contact Messages
          </h3>
          {recentContacts.length === 0 ? (
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>No messages yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentContacts.map((c, i) => (
                <div key={i} style={{ padding: '10px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#ffffff', fontWeight: 500 }}>{c.name}</span>
                    <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{new Date(c.created_at).toLocaleDateString()}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)' }}>{c.subject}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* System Status */}
      <div style={{ backgroundColor: '#0e0e10', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '24px' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 500, color: '#ffffff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} color="#4ade80" /> System Status
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
          {[
            { label: 'Main Website', status: 'Operational', color: '#4ade80' },
            { label: 'Authentication', status: 'Operational', color: '#4ade80' },
            { label: 'Database', status: 'Operational', color: '#4ade80' },
            { label: 'Email (SMTP)', status: 'Resend', color: '#c8a45c' },
            { label: 'Storage', status: 'Active', color: '#4ade80' },
            { label: 'OAuth Server', status: 'Enabled', color: '#4ade80' },
          ].map((service) => (
            <div key={service.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: service.color }} />
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{service.label}</p>
                <p style={{ fontSize: '12px', color: service.color, fontWeight: 500 }}>{service.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
