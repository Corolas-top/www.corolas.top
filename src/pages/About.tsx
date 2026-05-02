import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  {
    initials: 'RS',
    name: 'Rhea A. Shirley',
    role: 'Co-founder',
    bio: 'Visionary leader and strategist. Rhea guides Corolas with a commitment to excellence and innovation.',
  },
  {
    initials: 'CG',
    name: 'Charles Gao',
    role: 'Co-founder',
    bio: 'Technical architect and builder. Charles transforms ambitious ideas into robust, scalable systems.',
  },
  {
    initials: 'LW',
    name: 'Lazlo Wavel',
    role: 'Principal Assistant',
    bio: 'Operations and coordination. Lazlo ensures that every project runs smoothly and every detail is accounted for.',
  },
];

export default function About() {
  const philosophyRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (philosophyRef.current) {
        const els = philosophyRef.current.querySelectorAll('.phil-animate');
        gsap.from(els, {
          y: 40,
          opacity: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: philosophyRef.current, start: 'top 80%' },
        });
      }

      if (teamRef.current) {
        const cards = teamRef.current.querySelectorAll('.team-card');
        gsap.from(cards, {
          y: 50,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: teamRef.current.querySelector('.team-grid'), start: 'top 80%' },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <main>
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
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            The Team
          </span>
          <h1
            style={{
              fontSize: 'clamp(36px, 5vw, 72px)',
              fontWeight: 300,
              letterSpacing: '-0.03em',
              color: '#ffffff',
            }}
          >
            About Corolas
          </h1>
          <p
            style={{
              fontSize: 'clamp(14px, 1.1vw, 17px)',
              color: 'rgba(255,255,255,0.6)',
              marginTop: '12px',
            }}
          >
            Small team. Big ambitions.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section
        ref={philosophyRef}
        style={{
          backgroundColor: '#f4f4f5',
          padding: 'clamp(80px, 10vh, 140px) clamp(24px, 5vw, 72px)',
        }}
      >
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          <h2
            className="phil-animate"
            style={{
              fontSize: 'clamp(40px, 6vw, 80px)',
              fontWeight: 400,
              color: '#0a0a0a',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            格物致知，异想天开
          </h2>

          <p
            className="phil-animate"
            style={{
              fontSize: '14px',
              fontFamily: '"SF Mono", "Monaco", monospace',
              color: 'rgba(0,0,0,0.35)',
              marginTop: '16px',
            }}
          >
            G&eacute; w&ugrave; zh&igrave; zhī, y&igrave; xiǎng tiān kāi
          </p>

          <p
            className="phil-animate"
            style={{
              fontSize: '18px',
              fontStyle: 'italic',
              color: 'rgba(0,0,0,0.6)',
              marginTop: '24px',
            }}
          >
            Investigate things to gain knowledge; let imagination run wild.
          </p>

          <div
            className="phil-animate"
            style={{
              width: '60px',
              height: '1px',
              backgroundColor: 'rgba(0,0,0,0.15)',
              margin: '40px auto',
            }}
          />

          <p
            className="phil-animate"
            style={{
              fontSize: 'clamp(14px, 1.05vw, 17px)',
              color: 'rgba(0,0,0,0.7)',
              lineHeight: 1.8,
            }}
          >
            This ancient Chinese proverb captures the duality at the heart of Corolas.
            On one side, the rigorous, methodical pursuit of understanding — every experiment,
            every line of code, every system we build. On the other, the boundless freedom
            to imagine, to create, to venture into the unknown. We hold both in balance.
          </p>
        </div>
      </section>

      {/* Team Members Section */}
      <section
        ref={teamRef}
        style={{
          backgroundColor: '#070708',
          padding: 'clamp(80px, 10vh, 140px) clamp(24px, 5vw, 72px)',
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
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
            Who We Are
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
            Meet the Team
          </h2>

          <div
            className="team-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px',
            }}
          >
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="team-card"
                style={{
                  backgroundColor: '#0e0e10',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '8px',
                  padding: '40px',
                  textAlign: 'center',
                  transition: 'transform 0.3s ease, border-color 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(200,164,92,0.15)',
                    border: '1px solid rgba(200,164,92,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                  }}
                >
                  <span
                    style={{
                      fontSize: '24px',
                      fontWeight: 400,
                      color: '#c8a45c',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {member.initials}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: 500,
                    color: '#ffffff',
                    marginTop: '24px',
                  }}
                >
                  {member.name}
                </h3>

                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(200,164,92,0.8)',
                    marginTop: '8px',
                    display: 'block',
                  }}
                >
                  {member.role}
                </span>

                <p
                  style={{
                    fontSize: '14px',
                    color: 'rgba(255,255,255,0.5)',
                    marginTop: '16px',
                    lineHeight: 1.6,
                  }}
                >
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
