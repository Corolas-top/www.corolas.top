import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlusCircle } from 'lucide-react';
import { fetchProjects, groupByCategory } from '@/lib/projects';
import type { Project } from '@/types/project';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchProjects();
      setProjects(data);
      setIsLoading(false);
    };
    load();
  }, []);

  // Scroll animations
  useEffect(() => {
    if (!sectionRef.current || isLoading || projects.length === 0) return;
    const ctx = gsap.context(() => {
      const cards = sectionRef.current!.querySelectorAll('.project-full-card');
      if (cards.length) {
        gsap.from(cards, {
          y: 50, opacity: 0, duration: 0.7, stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: cards[0], start: 'top 85%' },
        });
      }
      const template = sectionRef.current!.querySelector('.template-card');
      if (template) {
        gsap.from(template, { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: template, start: 'top 85%' } });
      }
    }, sectionRef.current);
    return () => ctx.revert();
  }, [isLoading, projects]);

  const { platforms, applications } = groupByCategory(projects);

  return (
    <main ref={sectionRef}>
      {/* Page Header */}
      <section
        style={{
          backgroundColor: '#070708',
          paddingTop: '140px',
          paddingBottom: '60px',
          paddingLeft: 'clamp(24px, 5vw, 72px)',
          paddingRight: 'clamp(24px, 5vw, 72px)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <span
            style={{
              fontSize: '11px', fontWeight: 500, letterSpacing: '0.28em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)',
              display: 'block', marginBottom: '16px',
            }}
          >
            Our Work
          </span>
          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 300,
              letterSpacing: '-0.03em', color: '#ffffff',
            }}
          >
            Projects
          </h1>
          <p
            style={{
              fontSize: 'clamp(14px, 1.1vw, 17px)', color: 'rgba(255,255,255,0.6)',
              maxWidth: '560px', marginTop: '16px', lineHeight: 1.65,
            }}
          >
            Each project is a step toward understanding — and reimagining — what's possible.
          </p>
        </div>
      </section>

      {/* Content */}
      <section
        style={{
          backgroundColor: '#070708',
          padding: 'clamp(40px, 6vh, 80px) clamp(24px, 5vw, 72px) clamp(80px, 10vh, 140px)',
        }}
      >
        <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
          {isLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
              <div style={{ width: '36px', height: '36px', border: '2px solid rgba(255,255,255,0.1)', borderTop: '2px solid #c8a45c', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <>
              {/* Platforms */}
              {platforms.length > 0 && (
                <div style={{ marginBottom: '64px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                    <div style={{ width: '32px', height: '1px', backgroundColor: '#c8a45c' }} />
                    <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#c8a45c' }}>
                      Platforms
                    </span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>({platforms.length})</span>
                  </div>
                  <ProjectGrid projects={platforms} />
                </div>
              )}

              {/* Applications */}
              {applications.length > 0 && (
                <div style={{ marginBottom: '64px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                    <div style={{ width: '32px', height: '1px', backgroundColor: '#4ade80' }} />
                    <span style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#4ade80' }}>
                      Applications
                    </span>
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>({applications.length})</span>
                  </div>
                  <ProjectGrid projects={applications} />
                </div>
              )}

              {/* Future Template */}
              <div
                className="template-card"
                style={{
                  backgroundColor: '#0e0e10',
                  border: '1px dashed rgba(255,255,255,0.12)',
                  borderRadius: '8px', padding: '48px', textAlign: 'center',
                }}
              >
                <PlusCircle size={48} style={{ color: 'rgba(255,255,255,0.2)', margin: '0 auto' }} />
                <h3 style={{ fontSize: '20px', color: 'rgba(255,255,255,0.5)', marginTop: '20px', fontWeight: 400 }}>
                  More Coming Soon
                </h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.35)', marginTop: '8px' }}>
                  New platforms and applications are in development.
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

/* ─── Project Grid Component ─── */

function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 460px), 1fr))',
        gap: '24px',
      }}
    >
      {projects.map((project) => (
        <div
          key={project.slug}
          className="project-full-card"
          style={{
            backgroundColor: '#0e0e10',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: '8px', padding: '32px',
            position: 'relative',
            transition: 'transform 0.3s ease, border-color 0.3s ease, background-color 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
            e.currentTarget.style.backgroundColor = '#0e0e10';
          }}
        >
          <span
            style={{
              position: 'absolute', top: '20px', right: '20px',
              fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em',
              color: project.status === 'active' ? '#4ade80' : '#eab308',
              backgroundColor: project.status === 'active' ? 'rgba(74,222,128,0.1)' : 'rgba(234,179,8,0.1)',
              padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase',
            }}
          >
            {project.status}
          </span>

          <div style={{
            width: '140px', height: '100px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginTop: '8px',
          }}>
            {project.logo_url ? (
              <img src={project.logo_url} alt={project.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
            ) : (
              <span style={{ fontSize: '32px', fontWeight: 300, color: 'rgba(255,255,255,0.2)' }}>{project.name.charAt(0)}</span>
            )}
          </div>

          <h3 style={{ fontSize: '22px', fontWeight: 500, color: '#ffffff', marginTop: '24px' }}>
            {project.name}
          </h3>
          <span
            style={{
              fontSize: '13px', fontFamily: '"SF Mono", "Monaco", monospace',
              color: 'rgba(200,164,92,0.7)', marginTop: '6px', display: 'block',
            }}
          >
            {project.domain}
          </span>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)', marginTop: '12px', lineHeight: 1.65 }}>
            {project.short_description}
          </p>
          <div style={{ display: 'flex', gap: '20px', marginTop: '24px', flexWrap: 'wrap' }}>
            <a
              href={`https://${project.domain}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none', transition: 'color 0.25s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#c8a45c'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
            >
              Visit Site &rarr;
            </a>
            <Link
              to={`/projects/${project.slug}`}
              style={{
                fontSize: '12px', fontWeight: 500, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none', transition: 'color 0.25s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#c8a45c'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
            >
              Learn More
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
