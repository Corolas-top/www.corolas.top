import { animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const controls = animate(0, value, {
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => setDisplay(Math.round(v)),
          });
          return () => controls.stop();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

export function PhilosophySection() {
  return (
    <section className="py-[120px] bg-corolas-bg-elevated">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-[55%_45%] gap-16 items-center">
          {/* Text Column */}
          <div>
            <ScrollReveal>
              <p className="section-label mb-4">OUR PHILOSOPHY</p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <h2
                className="font-display font-semibold text-corolas-text mb-8"
                style={{
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}
              >
                Where Rigor Meets Reverie
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-corolas-text-secondary text-lg leading-relaxed mb-10">
                At Corolas, we believe the deepest insights emerge at the intersection of
                disciplined inquiry and unbridled imagination. We build tools and experiences
                that honor the ancient imperative to understand the world — while daring to
                dream beyond its current boundaries. Every project we undertake is both an
                investigation and an invocation: a systematic pursuit of truth, and a creative
                leap into what could be.
              </p>
            </ScrollReveal>

            {/* Stats */}
            <ScrollReveal delay={0.3}>
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <p
                    className="font-display font-bold text-corolas-gold mb-1"
                    style={{ fontSize: 'clamp(36px, 4vw, 48px)' }}
                  >
                    <AnimatedCounter value={4} />
                  </p>
                  <p className="text-corolas-text-muted text-sm uppercase tracking-wider">
                    Active Projects
                  </p>
                </div>
                <div>
                  <p
                    className="font-display font-bold text-corolas-gold mb-1"
                    style={{ fontSize: 'clamp(36px, 4vw, 48px)' }}
                  >
                    <AnimatedCounter value={3} />
                  </p>
                  <p className="text-corolas-text-muted text-sm uppercase tracking-wider">
                    Core Team Members
                  </p>
                </div>
                <div>
                  <p
                    className="font-display font-bold text-corolas-cyan mb-1"
                    style={{ fontSize: 'clamp(36px, 4vw, 48px)' }}
                  >
                    <AnimatedCounter value={0} suffix="∞" />
                  </p>
                  <p className="text-corolas-text-muted text-sm uppercase tracking-wider">
                    Possibilities
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Visual Column */}
          <ScrollReveal delay={0.2} direction="left">
            <div className="relative flex items-center justify-center">
              {/* Abstract geometric SVG */}
              <svg
                viewBox="0 0 400 400"
                className="w-full max-w-[400px]"
                style={{ animation: 'slowRotate 60s linear infinite' }}
              >
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.05" />
                  </linearGradient>
                  <linearGradient id="cyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00D4AA" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00D4AA" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                {/* Outer ring */}
                <circle
                  cx="200"
                  cy="200"
                  r="180"
                  fill="none"
                  stroke="url(#goldGrad)"
                  strokeWidth="1"
                />
                {/* Inner ring */}
                <circle
                  cx="200"
                  cy="200"
                  r="120"
                  fill="none"
                  stroke="url(#cyanGrad)"
                  strokeWidth="1"
                />
                {/* Central hexagon */}
                <polygon
                  points="200,80 304,140 304,260 200,320 96,260 96,140"
                  fill="none"
                  stroke="rgba(212,175,55,0.2)"
                  strokeWidth="1"
                />
                {/* Inner triangle */}
                <polygon
                  points="200,140 266,260 134,260"
                  fill="none"
                  stroke="rgba(0,212,170,0.15)"
                  strokeWidth="1"
                />
                {/* Connection lines */}
                <line x1="200" y1="80" x2="200" y2="200" stroke="rgba(212,175,55,0.1)" strokeWidth="0.5" />
                <line x1="304" y1="140" x2="200" y2="200" stroke="rgba(212,175,55,0.1)" strokeWidth="0.5" />
                <line x1="304" y1="260" x2="200" y2="200" stroke="rgba(212,175,55,0.1)" strokeWidth="0.5" />
                <line x1="200" y1="320" x2="200" y2="200" stroke="rgba(212,175,55,0.1)" strokeWidth="0.5" />
                <line x1="96" y1="260" x2="200" y2="200" stroke="rgba(212,175,55,0.1)" strokeWidth="0.5" />
                <line x1="96" y1="140" x2="200" y2="200" stroke="rgba(212,175,55,0.1)" strokeWidth="0.5" />
                {/* Center dot */}
                <circle cx="200" cy="200" r="4" fill="#D4AF37" opacity="0.6" />
              </svg>

              <style>{`
                @keyframes slowRotate {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
