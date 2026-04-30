import { motion } from 'framer-motion';
import { ScrollReveal } from '@/components/ScrollReveal';
import { projects } from '@/data/content';
import { ExternalLink } from 'lucide-react';

export function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  return (
    <ScrollReveal delay={index * 0.1}>
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="group bg-corolas-bg-elevated border rounded-lg p-8 h-full flex flex-col"
        style={{ borderColor: 'rgba(212, 175, 55, 0.12)' }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(0, 212, 170, 0.2)';
          e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 212, 170, 0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.12)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-24 mb-6">
          <motion.img
            src={project.logo}
            alt={project.name}
            className="max-h-20 w-auto object-contain"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Name */}
        <h3 className="font-display font-semibold text-xl text-corolas-text mb-3 text-center">
          {project.name}
        </h3>

        {/* Description */}
        <p className="text-corolas-text-secondary text-sm leading-relaxed mb-6 flex-grow text-center">
          {project.description}
        </p>

        {/* Link */}
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 text-corolas-cyan text-sm font-medium transition-all duration-300 hover:gap-3 group/link"
        >
          <span className="relative">
            Visit Site
            <span className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-corolas-cyan transition-all duration-300 group-hover/link:w-full" />
          </span>
          <ExternalLink size={14} />
        </a>
      </motion.div>
    </ScrollReveal>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="py-[120px] bg-corolas-bg">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <ScrollReveal>
            <p className="section-label mb-4">OUR PROJECTS</p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <h2
              className="font-display font-semibold text-corolas-text mb-4"
              style={{
                fontSize: 'clamp(32px, 4vw, 48px)',
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
              }}
            >
              Explore the Universe
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={0.2}>
            <p className="text-corolas-text-secondary text-lg max-w-[600px] mx-auto">
              Each project is a distinct constellation in our expanding galaxy of ideas.
            </p>
          </ScrollReveal>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
