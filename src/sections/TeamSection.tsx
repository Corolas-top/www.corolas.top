import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { teamMembers } from '@/data/content';

function AvatarPlaceholder({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="w-32 h-32 rounded-full flex items-center justify-center text-2xl font-display font-bold relative overflow-hidden"
      style={{ backgroundColor: 'rgba(212, 175, 55, 0.08)', color }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)`,
        }}
      />
      <span className="relative z-10">{initials}</span>
    </div>
  );
}

export function TeamSection() {
  return (
    <section id="team" className="py-[120px] bg-corolas-bg-elevated">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <p className="section-label mb-4">THE MINDS BEHIND</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2
              className="font-display font-semibold text-corolas-text"
              style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Our Collective
            </h2>
          </ScrollReveal>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-3 gap-10">
          {teamMembers.map((member, index) => (
            <ScrollReveal key={member.id} delay={index * 0.15}>
              <motion.div
                whileHover={{ backgroundColor: 'rgba(18, 18, 28, 0.5)' }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center text-center p-8 rounded-lg"
              >
                {/* Avatar with ring on hover */}
                <motion.div
                  className="relative mb-6"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  <AvatarPlaceholder initials={member.initials} color="#D4AF37" />
                  {/* Hover ring */}
                  <div
                    className="absolute inset-0 rounded-full border-2 border-corolas-gold opacity-0 transition-opacity duration-300"
                    style={{ boxShadow: '0 0 20px rgba(212,175,55,0.3)' }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = '0';
                    }}
                  />
                </motion.div>

                {/* Name */}
                <h3 className="font-display font-semibold text-xl text-corolas-text mb-2">
                  {member.name}
                </h3>

                {/* Role */}
                <p className="text-corolas-gold text-xs font-medium uppercase tracking-[0.12em] mb-4">
                  {member.role}
                </p>

                {/* Bio */}
                <p className="text-corolas-text-secondary text-sm leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
