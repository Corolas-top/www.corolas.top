import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PlusCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const projectsData = [
  {
    slug: 'platonic',
    name: 'Platonic',
    domain: 'platonic.corolas.top',
    logo: '/images/platonic-logo.png',
    description: 'An emotionally immersive AI companion engineered for deep romantic connection, crafting intimate, personalized experiences through affectionate dialogue and genuine emotional presence.',
    shortDescription: 'An AI companion engineered for deep romantic connection.',
    link: 'https://platonic.corolas.top',
    status: 'LIVE' as const,
  },
  {
    slug: 'yhea',
    name: 'Yhea',
    domain: 'yhea.corolas.top',
    logo: '/images/yhea-logo.png',
    description: 'An adaptive platform with AI tutor redefining international education, delivering deeply personalized A-Level, AP, and IB mastery through intelligent, curriculum-aligned pedagogy.',
    shortDescription: 'AI- and data-driven solutions for personalized international education.',
    link: 'https://yhea.corolas.top',
    status: 'LIVE' as const,
  },
  {
    slug: 'thea',
    name: 'Thea',
    domain: 'thea.corolas.top',
    logo: '/images/thea-logo.png',
    description: 'An intelligence platform at the convergence of AI and biotechnology, transforming complex scientific landscapes into strategic, actionable foresight for researchers and innovators',
    shortDescription: 'AI- and data-driven insights for AI x biotech innovation.',
    link: 'https://thea.corolas.top',
    status: 'LIVE' as const,
  },
  {
    slug: 'edith',
    name: 'Edith',
    domain: 'edith.corolas.top',
    logo: '/images/edith-logo.png',
    description: 'Edith reimagines the developer experience. A suite of tools and frameworks that make building complex systems feel simple, intuitive, and even joyful.',
    shortDescription: 'Next-generation development tools and frameworks.',
    link: 'https://edith.corolas.top',
    status: 'LIVE' as const,
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll('.project-full-card');
      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: section.querySelector('.projects-grid'), start: 'top 80%' },
      });

      const template = section.querySelector('.template-card');
      if (template) {
        gsap.from(template, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: template, start: 'top 85%' },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={sectionRef}>
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
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            Our Work
          </span>
          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 72px)',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            Projects
          </h1>
          <p
            style={{
              fontSize: 'clamp(14px, 1.1vw, 17px)',
              color: 'rgba(255,255,255,0.6)',
              maxWidth: '560px',
              marginTop: '16px',
              lineHeight: 1.65,
            }}
          >
            Each project is a step toward understanding — and reimagining — what's possible.
          </p>
        </div>
      </section>

      <section
        style={{
          backgroundColor: '#070708',
          padding: 'clamp(40px, 6vh, 80px) clamp(24px, 5vw, 72px) clamp(80px, 10vh, 140px)',
        }}
      >
        <div
          className="projects-grid"
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 460px), 1fr))',
            gap: '24px',
          }}
        >
          {projectsData.map((project) => (
            <div
              key={project.slug}
              className="project-full-card"
              style={{
                backgroundColor: '#0e0e10',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '32px',
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
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: '#4ade80',
                  backgroundColor: 'rgba(74,222,128,0.1)',
                  padding: '4px 10px',
                  borderRadius: '4px',
                }}
              >
                {project.status}
              </span>

              <div
                style={{
                  width: '140px',
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '8px',
                }}
              >
                <img
                  src={project.logo}
                  alt={project.name}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                />
              </div>

              <h3
                style={{
                  fontSize: '22px',
                  fontWeight: 500,
                  color: '#ffffff',
                  marginTop: '24px',
                }}
              >
                {project.name}
              </h3>
              <span
                style={{
                  fontSize: '13px',
                  fontFamily: '"SF Mono", "Monaco", monospace',
                  color: 'rgba(200,164,92,0.7)',
                  marginTop: '6px',
                  display: 'block',
                }}
              >
                {project.domain}
              </span>
              <p
                style={{
                  fontSize: '14px',
                  color: 'rgba(255,255,255,0.55)',
                  marginTop: '12px',
                  lineHeight: 1.65,
                }}
              >
                {project.description}
              </p>
              <div style={{ display: 'flex', gap: '20px', marginTop: '24px', flexWrap: 'wrap' }}>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.5)',
                    textDecoration: 'none',
                    transition: 'color 0.25s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#c8a45c'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  Visit Site &rarr;
                </a>
                <Link
                  to={`/projects/${project.slug}`}
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.5)',
                    textDecoration: 'none',
                    transition: 'color 0.25s ease',
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

        <div
          className="template-card"
          style={{
            maxWidth: '1080px',
            margin: '24px auto 0',
            backgroundColor: '#0e0e10',
            border: '1px dashed rgba(255,255,255,0.12)',
            borderRadius: '8px',
            padding: '48px',
            textAlign: 'center',
          }}
        >
          <PlusCircle size={48} style={{ color: 'rgba(255,255,255,0.2)', margin: '0 auto' }} />
          <h3
            style={{
              fontSize: '20px',
              color: 'rgba(255,255,255,0.5)',
              marginTop: '20px',
              fontWeight: 400,
            }}
          >
            More Project Coming Soon
          </h3>
          <p
            style={{
              fontSize: '14px',
              color: 'rgba(255,255,255,0.35)',
              marginTop: '8px',
            }}
          >
            We're always exploring new ideas and pushing the boundaries of what's possible. Stay tuned for more exciting projects in the pipeline.
          </p>
        </div>
      </section>
    </main>
  );
}
