import { motion } from 'framer-motion';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { ChevronDown } from 'lucide-react';

export function HeroSection() {
  const scrollToProjects = () => {
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTeam = () => {
    const el = document.getElementById('team');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle Background */}
      <ParticleCanvas />

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(212,175,55,0.08), transparent 60%)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center max-w-[900px] mx-auto px-6" style={{ marginTop: '-5vh' }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="section-label mb-6"
        >
          TECHNOLOGY COLLECTIVE
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-bold tracking-[-0.03em] mb-8"
          style={{
            fontSize: 'clamp(48px, 8vw, 96px)',
            lineHeight: 0.95,
            background: 'linear-gradient(135deg, #F0F0F5, #D4AF37)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 80px rgba(212,175,55,0.15)',
          }}
        >
          COROLAS
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-4"
        >
          <p
            className="font-chinese font-semibold text-[28px] leading-relaxed tracking-[0.05em]"
            style={{ color: '#D4AF37' }}
          >
            格物致知
          </p>
          <p className="text-corolas-text-secondary text-lg italic mt-1">
            Investigate things to attain knowledge
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <p
            className="font-chinese font-semibold text-[28px] leading-relaxed tracking-[0.05em]"
            style={{ color: '#00D4AA' }}
          >
            异想天开
          </p>
          <p className="text-corolas-text-secondary text-lg italic mt-1">
            Let imagination soar beyond the heavens
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center gap-4 flex-wrap"
        >
          <button
            onClick={scrollToProjects}
            className="px-8 py-3.5 border border-corolas-gold text-corolas-gold text-sm font-semibold uppercase tracking-[0.1em] rounded transition-all duration-300 hover:bg-corolas-gold/10 hover:shadow-[0_0_30px_rgba(212,175,55,0.2)] active:scale-[0.97]"
          >
            Explore Our Projects
          </button>
          <button
            onClick={scrollToTeam}
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
            Meet the Team
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="animate-bounce-scroll flex flex-col items-center gap-2">
          <span className="text-corolas-text-muted text-xs tracking-wider">SCROLL</span>
          <ChevronDown size={20} className="text-corolas-gold" />
        </div>
      </motion.div>
    </section>
  );
}
