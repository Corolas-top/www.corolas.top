import { useParams, Link, useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { fetchProjectBySlug } from '@/lib/projects';
import type { Project } from '@/types/project';
import Accordion from '@/components/Accordion';

/* ─── Default legal content ─── */

const getTermsContent = (name: string, domain: string) => [
  `These terms of service outline the rules and regulations for the use of ${name}'s website at ${domain}.`,
  `By accessing this website we assume you accept these terms of service. Do not continue to use ${name} if you do not agree to take all of the terms and conditions stated on this page.`,
  `The following terminology applies to these Terms of Service: "Client", "You" and "Your" refers to you, the person accessing this website. "The Company", "Ourselves", "We", "Our" and "Us", refers to Corolas and ${name}. "Party", "Parties", or "Us", refers to both the Client and ourselves.`,
  `This is placeholder text for the Terms of Service. Please customize this content as needed for ${name}'s specific services and legal requirements.`,
];

const getPrivacyContent = (name: string) => [
  `This privacy policy describes how ${name} collects, uses, and protects your personal information.`,
  `Your privacy is important to us. It is ${name}'s policy to respect your privacy regarding any information we may collect while operating our website.`,
  `We only collect information about you if we have a reason to do so — for example, to provide our services, to communicate with you, or to make our services better.`,
  `This is a placeholder privacy policy. Please customize this content to reflect ${name}'s actual data practices and comply with applicable privacy laws.`,
];

/* ─── Page Component ─── */

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    const load = async () => {
      setIsLoading(true);
      const data = await fetchProjectBySlug(slug);
      setProject(data);
      setIsLoading(false);
    };
    load();
  }, [slug]);

  if (isLoading) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#070708', paddingTop: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '36px', height: '36px', border: '2px solid rgba(255,255,255,0.1)', borderTop: '2px solid #c8a45c', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </main>
    );
  }

  if (!project) {
    return (
      <main style={{ minHeight: '100vh', backgroundColor: '#070708', paddingTop: '140px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', color: '#ffffff' }}>Project not found</h1>
        <Link to="/projects" style={{ color: '#c8a45c', textDecoration: 'none', marginTop: '20px', display: 'inline-block' }}>
          &larr; Back to Projects
        </Link>
      </main>
    );
  }

  const termsParagraphs = getTermsContent(project.name, project.domain);
  const privacyParagraphs = getPrivacyContent(project.name);

  return (
    <main style={{ backgroundColor: '#070708', minHeight: '100vh' }}>
      {/* ── Project Header ── */}
      <section
        style={{
          paddingTop: '140px', paddingBottom: '80px',
          paddingLeft: 'clamp(24px, 5vw, 72px)',
          paddingRight: 'clamp(24px, 5vw, 72px)',
          textAlign: 'center',
        }}
      >
        <button
          onClick={() => navigate('/projects')}
          style={{
            fontSize: '13px', color: 'rgba(255,255,255,0.5)', background: 'none',
            border: 'none', cursor: 'pointer', transition: 'color 0.25s ease',
            display: 'inline-flex', alignItems: 'center', gap: '6px',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          &larr; Back to Projects
        </button>

        <div style={{ marginTop: '40px' }}>
          {project.logo_url ? (
            <img src={project.logo_url} alt={project.name} style={{ maxWidth: '180px', maxHeight: '120px', objectFit: 'contain' }} />
          ) : (
            <div style={{ fontSize: '48px', fontWeight: 300, color: 'rgba(255,255,255,0.2)' }}>{project.name.charAt(0)}</div>
          )}
        </div>

        <h1 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 300, letterSpacing: '-0.03em', color: '#ffffff', marginTop: '32px' }}>
          {project.name}
        </h1>

        <span style={{
          fontSize: '14px', fontFamily: '"SF Mono", "Monaco", monospace',
          color: 'rgba(200,164,92,0.7)', marginTop: '8px', display: 'block',
        }}>
          {project.domain}
        </span>

        <span style={{
          display: 'inline-block', marginTop: '16px',
          fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em',
          color: project.status === 'active' ? '#4ade80' : '#eab308',
          backgroundColor: project.status === 'active' ? 'rgba(74,222,128,0.1)' : 'rgba(234,179,8,0.1)',
          padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase',
        }}>
          {project.status}
        </span>

        <div style={{ marginTop: '32px' }}>
          <a
            href={`https://${project.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '13px', fontWeight: 500, letterSpacing: '0.14em',
              color: '#ffffff', backgroundColor: 'transparent',
              border: '1px solid #ffffff', padding: '16px 36px',
              textDecoration: 'none', textTransform: 'uppercase',
              display: 'inline-block', transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.color = '#070708'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#ffffff'; }}
          >
            Visit {project.domain} &rarr;
          </a>
        </div>
      </section>

      {/* ── Description Section ── */}
      <section
        style={{
          backgroundColor: '#f4f4f5',
          padding: 'clamp(60px, 8vh, 100px) clamp(24px, 5vw, 72px)',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <span style={{
            fontSize: '11px', fontWeight: 500, letterSpacing: '0.28em',
            textTransform: 'uppercase', color: 'rgba(0,0,0,0.4)',
            display: 'block', marginBottom: '16px',
          }}>
            About This Project
          </span>
          <h2 style={{
            fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 400,
            letterSpacing: '-0.02em', color: '#0a0a0a', marginBottom: '24px',
          }}>
            What we are building
          </h2>
          {project.full_description ? (
            project.full_description.split('\n\n').map((paragraph, i) => (
              <p
                key={i}
                style={{
                  fontSize: 'clamp(14px, 1vw, 16px)', color: 'rgba(0,0,0,0.7)',
                  lineHeight: 1.7, marginTop: i > 0 ? '20px' : 0,
                }}
              >
                {paragraph}
              </p>
            ))
          ) : (
            <p style={{ fontSize: 'clamp(14px, 1vw, 16px)', color: 'rgba(0,0,0,0.7)', lineHeight: 1.7 }}>
              This section is reserved for the project description. Customize this in the admin console to describe what {project.name} does, its mission, and its key features.
            </p>
          )}

          {/* Features */}
          {project.features && project.features.length > 0 && (
            <div style={{ marginTop: '40px' }}>
              <h3 style={{
                fontSize: '18px', fontWeight: 500, color: '#0a0a0a',
                marginBottom: '16px', letterSpacing: '-0.01em',
              }}>
                Key Features
              </h3>
              <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px', listStyle: 'none', padding: 0 }}>
                {project.features.map((feature, i) => (
                  <li key={i} style={{
                    fontSize: '14px', color: 'rgba(0,0,0,0.65)', lineHeight: 1.5,
                    paddingLeft: '20px', position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0, color: '#c8a45c' }}>&bull;</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* ── Legal Sections ── */}
      <section
        style={{
          backgroundColor: '#070708',
          padding: 'clamp(60px, 8vh, 100px) clamp(24px, 5vw, 72px)',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Accordion title="Terms of Service">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {termsParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Accordion>
          <Accordion title="Privacy Policy">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {privacyParagraphs.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </Accordion>
        </div>
      </section>

      {/* ── Back Navigation ── */}
      <section style={{ textAlign: 'center', padding: '48px clamp(24px, 5vw, 72px)' }}>
        <Link
          to="/projects"
          style={{
            fontSize: '14px', color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none', transition: 'color 0.25s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          &larr; Back to All Projects
        </Link>
      </section>
    </main>
  );
}
