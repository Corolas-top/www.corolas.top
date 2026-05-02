import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParticleCanvas from '@/components/ParticleCanvas';

gsap.registerPlugin(ScrollTrigger);

function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const ctx = gsap.context(() => {
      const children = content.children;
      gsap.from(children[0], { opacity: 0, duration: 0.8, delay: 0.4, ease: 'power3.out' });
      gsap.from(children[1], { opacity: 0, y: 20, duration: 0.6, delay: 0.7, ease: 'power3.out' });
      gsap.from(children[2], { opacity: 0, y: 30, duration: 0.9, delay: 0.9, ease: 'power3.out' });
      gsap.from(children[3], { opacity: 0, y: 30, duration: 0.9, delay: 1.05, ease: 'power3.out' });
      gsap.from(children[4], { opacity: 0, y: 20, duration: 0.7, delay: 1.2, ease: 'power3.out' });
      gsap.from(children[5], { opacity: 0, y: 20, duration: 0.7, delay: 1.4, ease: 'power3.out' });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '640px',
        overflow: 'hidden',
        backgroundColor: '#070708',
      }}
    >
      <ParticleCanvas />

      <div
        ref={contentRef}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          padding: '0 clamp(24px, 5vw, 72px)',
          textAlign: 'center',
        }}
      >
        <img
          src="/images/corolas-logo-white.png"
          alt="Corolas"
          style={{ width: '120px', height: '120px', objectFit: 'contain' }}
        />

        <span
          style={{
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.28em',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            marginTop: '8px',
          }}
        >
          Technology Collective &middot; Est. 2026
        </span>

        <h1
          style={{
            fontSize: 'clamp(40px, 6vw, 96px)',
            fontWeight: 300,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: '#ffffff',
            maxWidth: '900px',
          }}
        >
          Investigate
        </h1>

        <h1
          style={{
            fontSize: 'clamp(40px, 6vw, 96px)',
            fontWeight: 300,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'rgba(200,164,92,0.9)',
            maxWidth: '900px',
          }}
        >
          the Infinite
        </h1>

        <p
          style={{
            fontSize: 'clamp(14px, 1.1vw, 17px)',
            fontWeight: 300,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: '520px',
            marginTop: '8px',
          }}
        >
          A collective of builders, researchers, and dreamers.
          We investigate the nature of things and imagine what could be.
        </p>

        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            to="/projects"
            style={{
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.14em',
              color: '#ffffff',
              backgroundColor: 'transparent',
              border: '1px solid #ffffff',
              padding: '16px 36px',
              textDecoration: 'none',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              display: 'inline-block',
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
            Explore Our Work
          </Link>
          <Link
            to="/about"
            style={{
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.14em',
              color: '#ffffff',
              backgroundColor: 'transparent',
              border: 'none',
              padding: '16px 8px',
              textDecoration: 'none',
              textTransform: 'uppercase',
              textDecorationLine: 'underline',
              textUnderlineOffset: '6px',
            }}
          >
            Meet the Team &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const leftEl = section.querySelector('.phil-left');
      const rightEl = section.querySelector('.phil-right');
      const tags = section.querySelectorAll('.phil-tag');

      if (leftEl) {
        gsap.from(leftEl, {
          x: -40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%' },
        });
      }
      if (rightEl) {
        gsap.from(rightEl, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          delay: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%' },
        });
      }
      if (tags.length) {
        gsap.from(tags, {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.1,
          delay: 0.5,
          ease: 'power3.out',
          scrollTrigger: { trigger: section, start: 'top 80%' },
        });
      }
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="philosophy"
      style={{
        backgroundColor: '#f4f4f5',
        padding: 'clamp(100px, 14vh, 180px) clamp(24px, 5vw, 72px)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '64px',
          alignItems: 'center',
        }}
      >
        <div className="phil-left">
          <h2
            style={{
              fontSize: 'clamp(36px, 5vw, 72px)',
              fontWeight: 400,
              color: '#0a0a0a',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            格物致知，
            <br />
            异想天开
          </h2>
        </div>

        <div className="phil-right">
          <span
            style={{
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.4)',
              display: 'block',
              marginBottom: '24px',
            }}
          >
            Our Philosophy
          </span>
          <p
            style={{
              fontSize: 'clamp(14px, 1vw, 16px)',
              fontWeight: 300,
              lineHeight: 1.7,
              color: 'rgba(0,0,0,0.75)',
              maxWidth: '480px',
            }}
          >
            We believe in the rigorous investigation of reality — every line of code,
            every algorithm, every system. And from that foundation of understanding,
            we dare to imagine the impossible. Our work bridges the analytical and the
            creative, the proven and the unprecedented.
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '48px', flexWrap: 'wrap' }}>
            {['Curiosity', 'Creativity', 'Courage'].map((tag) => (
              <span
                key={tag}
                className="phil-tag"
                style={{
                  border: '1px solid rgba(0,0,0,0.15)',
                  padding: '8px 20px',
                  fontSize: '11px',
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(0,0,0,0.6)',
                  borderRadius: '100px',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const projectsPreview = [
  {
    name: 'Platonic',
    domain: 'platonic.corolas.top',
    description: 'Exploring the boundaries of AI-driven creativity and digital expression.',
    logo: '/images/platonic-logo.png',
    link: 'https://platonic.corolas.top',
  },
  {
    name: 'Yhea',
    domain: 'yhea.corolas.top',
    description: 'Intelligent systems for the modern web.',
    logo: '/images/yhea-logo.png',
    link: 'https://yhea.corolas.top',
  },
  {
    name: 'Thea',
    domain: 'thea.corolas.top',
    description: 'Advanced analytics and insights platform.',
    logo: '/images/thea-logo.png',
    link: 'https://thea.corolas.top',
  },
  {
    name: 'Edith',
    domain: 'edith.corolas.top',
    description: 'Next-generation development tools and frameworks.',
    logo: '/images/edith-logo.png',
    link: 'https://edith.corolas.top',
  },
];

function ProjectsPreviewSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = section.querySelectorAll('.project-card');
      gsap.from(cards, {
        y: 50,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%' },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects-preview"
      style={{
        backgroundColor: '#070708',
        padding: 'clamp(80px, 10vh, 140px) clamp(24px, 5vw, 72px)',
      }}
    >
      <div style={{ maxWidth: '1080px', margin: '0 auto' }}>
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
          What We Build
        </span>
        <h2
          style={{
            fontSize: 'clamp(28px, 3.5vw, 56px)',
            fontWeight: 400,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            marginBottom: '48px',
          }}
        >
          Our Projects
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 420px), 1fr))',
            gap: '24px',
          }}
        >
          {projectsPreview.map((project) => (
            <div
              key={project.name}
              className="project-card"
              style={{
                backgroundColor: '#0e0e10',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '32px',
                transition: 'transform 0.3s ease, border-color 0.3s ease, background-color 0.3s ease',
                cursor: 'default',
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
              <div
                style={{
                  width: '140px',
                  height: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                  fontSize: '20px',
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
                  marginTop: '8px',
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
                  lineHeight: 1.6,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {project.description}
              </p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  textDecoration: 'none',
                  marginTop: '20px',
                  display: 'inline-block',
                  transition: 'color 0.25s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#c8a45c'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}
              >
                Visit &rarr;
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FooterCTA() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.from(section.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 85%' },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        backgroundColor: '#070708',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: 'clamp(60px, 8vh, 100px) clamp(24px, 5vw, 72px)',
        textAlign: 'center',
      }}
    >
      <h2
        style={{
          fontSize: 'clamp(32px, 4vw, 56px)',
          fontWeight: 300,
          letterSpacing: '-0.02em',
          color: '#ffffff',
        }}
      >
        Let's build the future.
      </h2>
      <p
        style={{
          fontSize: 'clamp(14px, 1vw, 16px)',
          color: 'rgba(255,255,255,0.55)',
          marginTop: '16px',
          maxWidth: '480px',
          margin: '16px auto 0',
        }}
      >
        Have a project in mind? We'd love to hear from you.
      </p>
      <Link
        to="/contact"
        style={{
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.14em',
          color: '#ffffff',
          backgroundColor: 'transparent',
          border: '1px solid #ffffff',
          padding: '16px 36px',
          textDecoration: 'none',
          textTransform: 'uppercase',
          display: 'inline-block',
          marginTop: '32px',
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
        Get in Touch
      </Link>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <HeroSection />
      <PhilosophySection />
      <ProjectsPreviewSection />
      <FooterCTA />
    </main>
  );
}
