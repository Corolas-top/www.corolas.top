import { useParams, Link, useNavigate } from 'react-router';
import { useEffect } from 'react';
import { projectsData } from './Projects';
import Accordion from '@/components/Accordion';

/*
 * ================================================================
 * CUSTOMIZE PROJECT CONTENT HERE
 * ================================================================
 * To edit a project's description, Terms of Service, or Privacy Policy,
 * modify the corresponding fields in the PROJECT_CONTENT object below.
 * Each project is keyed by its slug (platonic, yhea, thea, edith).
 *
 * To add a new project:
 * 1. Add an entry to projectsData in src/pages/Projects.tsx
 * 2. Add a corresponding content entry below
 * 3. The route is automatically handled by /projects/:slug
 * ================================================================
 */

const PROJECT_CONTENT: Record<string, {
  aboutTitle: string;
  aboutParagraphs: string[];
  termsParagraphs: string[];
  privacyParagraphs: string[];
}> = {
  platonic: {
    aboutTitle: 'What we\'re building',
    aboutParagraphs: [
      'This section is reserved for the project description. Please customize this text in src/pages/ProjectDetail.tsx within the PROJECT_CONTENT object. Describe what Platonic does, its mission, and its key features.',
      'Add more paragraphs, feature lists, or any other content that helps visitors understand this project. You can include technical details, use cases, or roadmap information.',
    ],
    termsParagraphs: [
      'These terms of service outline the rules and regulations for the use of Platonic\'s website.',
      'By accessing this website we assume you accept these terms of service. Do not continue to use Platonic if you do not agree to take all of the terms and conditions stated on this page.',
      'This is a placeholder text. Please customize the Terms of Service in src/pages/ProjectDetail.tsx within the PROJECT_CONTENT object.',
    ],
    privacyParagraphs: [
      'This privacy policy describes how Platonic collects, uses, and protects your personal information.',
      'This is a placeholder text. Please customize the Privacy Policy in src/pages/ProjectDetail.tsx within the PROJECT_CONTENT object.',
    ],
  },
  yhea: {
    aboutTitle: 'What we\'re building',
    aboutParagraphs: [
      'This section is reserved for the project description. Please customize this text in src/pages/ProjectDetail.tsx within the PROJECT_CONTENT object. Describe what Yhea does, its mission, and its key features.',
      'Add more paragraphs, feature lists, or any other content that helps visitors understand this project.',
    ],
    termsParagraphs: [
      'These terms of service outline the rules and regulations for the use of Yhea\'s website.',
      'By accessing this website we assume you accept these terms of service. Do not continue to use Yhea if you do not agree to take all of the terms and conditions stated on this page.',
      'This is a placeholder text. Please customize the Terms of Service in src/pages/ProjectDetail.tsx within the PROJECT_CONTENT object.',
    ],
    privacyParagraphs: [
      'This privacy policy describes how Yhea collects, uses, and protects your personal information.',
      'This is a placeholder text. Please customize the Privacy Policy in src/pages/ProjectDetail.tsx within the PROJECT_CONTENT object.',
    ],
  },
  thea: {
    aboutTitle: 'What we\'re building',
    aboutParagraphs: [
      'This section is reserved for the project description. Please customize this text in src/pages/ProjectDetail.tsx within the PROJECT_CONTENT object. Describe what Thea does, its mission, and its key features.',
      'Add more paragraphs, feature lists, or any other content that helps visitors understand this project.',
    ],
    termsParagraphs: [
      'These terms of service outline the rules and regulations for the use of Thea\'s website.',
      'By accessing this website we assume you accept these terms of service. Do not continue to use Thea if you do not agree to take all of the terms and conditions stated on this page.',
      'This is a placeholder text. Please customize the Terms of Service in src/pages/ProjectDetail.tsx within the PROJECT_CONTENT object.',
    ],
    privacyParagraphs: [
      'This privacy policy describes how Thea collects, uses, and protects your personal information.',
      'This is a placeholder text. Please customize the Privacy Policy in src/pages/ProjectDetail.tsx within the PROJECT_CONTENT object.',
    ],
  },
  edith: {
    aboutTitle: 'What we\'re building',
    aboutParagraphs: [
      'This section is reserved for the project description. Please customize this text in src/pages/ProjectDetail.tsx within the PROJECT_CONTENT object. Describe what Edith does, its mission, and its key features.',
      'Add more paragraphs, feature lists, or any other content that helps visitors understand this project.',
    ],
    termsParagraphs: [
      'These terms of service outline the rules and regulations for the use of Edith\'s website.',
      'By accessing this website we assume you accept these terms of service. Do not continue to use Edith if you do not agree to take all of the terms and conditions stated on this page.',
      'This is a placeholder text. Please customize the Terms of Service in src/pages/ProjectDetail.tsx within the PROJECT_CONTENT object.',
    ],
    privacyParagraphs: [
      'This privacy policy describes how Edith collects, uses, and protects your personal information.',
      'This is a placeholder text. Please customize the Privacy Policy in src/pages/ProjectDetail.tsx within the PROJECT_CONTENT object.',
    ],
  },
};

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const project = projectsData.find((p) => p.slug === slug);
  const content = slug ? PROJECT_CONTENT[slug] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project || !content) {
    return (
      <main style={{ backgroundColor: '#070708', minHeight: '100vh', paddingTop: '140px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '32px', color: '#ffffff' }}>Project not found</h1>
        <Link
          to="/projects"
          style={{ color: '#c8a45c', textDecoration: 'none', marginTop: '20px', display: 'inline-block' }}
        >
          &larr; Back to Projects
        </Link>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: '#070708', minHeight: '100vh' }}>
      {/* Project Header */}
      <section
        style={{
          paddingTop: '140px',
          paddingBottom: '80px',
          paddingLeft: 'clamp(24px, 5vw, 72px)',
          paddingRight: 'clamp(24px, 5vw, 72px)',
          textAlign: 'center',
        }}
      >
        <button
          onClick={() => navigate('/projects')}
          style={{
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'color 0.25s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
        >
          &larr; Back to Projects
        </button>

        <div style={{ marginTop: '40px' }}>
          <img
            src={project.logo}
            alt={project.name}
            style={{ maxWidth: '180px', maxHeight: '120px', objectFit: 'contain' }}
          />
        </div>

        <h1
          style={{
            fontSize: 'clamp(32px, 4vw, 56px)',
            fontWeight: 300,
            letterSpacing: '-0.03em',
            color: '#ffffff',
            marginTop: '32px',
          }}
        >
          {project.name}
        </h1>

        <span
          style={{
            fontSize: '14px',
            fontFamily: '"SF Mono", "Monaco", monospace',
            color: 'rgba(200,164,92,0.7)',
            marginTop: '8px',
            display: 'block',
          }}
        >
          {project.domain}
        </span>

        <span
          style={{
            display: 'inline-block',
            marginTop: '16px',
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

        <div style={{ marginTop: '32px' }}>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
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
            Visit {project.domain} &rarr;
          </a>
        </div>
      </section>

      {/* Description Section */}
      <section
        style={{
          backgroundColor: '#f4f4f5',
          padding: 'clamp(60px, 8vh, 100px) clamp(24px, 5vw, 72px)',
        }}
      >
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(0,0,0,0.4)',
              display: 'block',
              marginBottom: '16px',
            }}
          >
            About This Project
          </span>
          <h2
            style={{
              fontSize: 'clamp(24px, 3vw, 40px)',
              fontWeight: 400,
              letterSpacing: '-0.02em',
              color: '#0a0a0a',
              marginBottom: '24px',
            }}
          >
            {content.aboutTitle}
          </h2>
          {content.aboutParagraphs.map((paragraph, i) => (
            <p
              key={i}
              style={{
                fontSize: 'clamp(14px, 1vw, 16px)',
                color: 'rgba(0,0,0,0.7)',
                lineHeight: 1.7,
                marginTop: i > 0 ? '20px' : 0,
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {/* Legal Sections */}
      <section
        style={{
          backgroundColor: '#070708',
          padding: 'clamp(60px, 8vh, 100px) clamp(24px, 5vw, 72px)',
        }}
      >
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Accordion title="Terms of Service">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {content.termsParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Accordion>
          <Accordion title="Privacy Policy">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {content.privacyParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </Accordion>
        </div>
      </section>

      {/* Back Navigation */}
      <section
        style={{
          textAlign: 'center',
          padding: '48px clamp(24px, 5vw, 72px)',
        }}
      >
        <Link
          to="/projects"
          style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            transition: 'color 0.25s ease',
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
