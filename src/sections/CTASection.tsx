import { ScrollReveal } from '@/components/ScrollReveal';

export function CTASection() {
  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-corolas-bg relative">
      {/* Top gradient border */}
      <div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent)',
        }}
      />

      <div className="max-w-[640px] mx-auto px-6 text-center">
        <ScrollReveal>
          <h2
            className="font-display font-semibold text-corolas-text mb-4"
            style={{
              fontSize: 'clamp(28px, 3.5vw, 40px)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Ready to Explore?
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <p className="text-corolas-text-secondary text-lg leading-relaxed mb-8">
            Discover what we're building across the Corolas ecosystem.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={scrollToProjects}
              className="px-8 py-3.5 border border-corolas-gold text-corolas-gold text-sm font-semibold uppercase tracking-[0.1em] rounded transition-all duration-300 hover:bg-corolas-gold/10 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] active:scale-[0.97]"
            >
              View All Projects
            </button>
            <a
              href="mailto:contact@corolas.top"
              className="px-8 py-3.5 border text-sm font-semibold uppercase tracking-[0.1em] rounded transition-all duration-300 active:scale-[0.97]"
              style={{
                borderColor: 'rgba(212, 175, 55, 0.12)',
                color: '#F0F0F5',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00D4AA';
                e.currentTarget.style.color = '#00D4AA';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.12)';
                e.currentTarget.style.color = '#F0F0F5';
              }}
            >
              Get in Touch
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
