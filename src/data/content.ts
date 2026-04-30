import type { Project, TeamMember, LegalContent } from '@/types';

export const projects: Project[] = [
  {
    id: 'platonic',
    name: 'Platonic',
    domain: 'platonic.corolas.top',
    logo: '/platonic-logo.png',
    description: '[Your project description here — describe what Platonic does and its vision]',
    link: 'https://platonic.corolas.top',
  },
  {
    id: 'yhea',
    name: 'Yhea',
    domain: 'yhea.corolas.top',
    logo: '/Yhea-logo.png',
    description: '[Your project description here — describe what Yhea does and its vision]',
    link: 'https://yhea.corolas.top',
  },
  {
    id: 'thea',
    name: 'Thea',
    domain: 'thea.corolas.top',
    logo: '/thea-logo.png',
    description: '[Your project description here — describe what Thea does and its vision]',
    link: 'https://thea.corolas.top',
  },
  {
    id: 'edith',
    name: 'Edith',
    domain: 'edith.corolas.top',
    logo: '/edith-logo.png',
    description: '[Your project description here — describe what Edith does and its vision]',
    link: 'https://edith.corolas.top',
  },
];

export const teamMembers: TeamMember[] = [
  {
    id: 'rhea',
    name: 'Rhea A. Shirley',
    role: 'Co-founder',
    bio: '[Your bio text here — describe Rhea\'s background, expertise, and role in Corolas]',
    initials: 'RA',
  },
  {
    id: 'charles',
    name: 'Charles Gao',
    role: 'Co-founder',
    bio: '[Your bio text here — describe Charles\'s background, expertise, and role in Corolas]',
    initials: 'CG',
  },
  {
    id: 'lazlo',
    name: 'Lazlo Wavel',
    role: 'Principal Assistant',
    bio: '[Your bio text here — describe Lazlo\'s background, expertise, and role in Corolas]',
    initials: 'LW',
  },
];

export const termsContent: LegalContent[] = [
  {
    projectId: 'platonic',
    projectName: 'Platonic',
    content: `[Your Terms of Service text here. This section should contain the specific legal terms, conditions, and user agreements for Platonic. Include sections on: Acceptance of Terms, Use License, Disclaimer, Limitations, and Governing Law.]`,
  },
  {
    projectId: 'yhea',
    projectName: 'Yhea',
    content: `[Your Terms of Service text here. This section should contain the specific legal terms, conditions, and user agreements for Yhea. Include sections on: Acceptance of Terms, Use License, Disclaimer, Limitations, and Governing Law.]`,
  },
  {
    projectId: 'thea',
    projectName: 'Thea',
    content: `[Your Terms of Service text here. This section should contain the specific legal terms, conditions, and user agreements for Thea. Include sections on: Acceptance of Terms, Use License, Disclaimer, Limitations, and Governing Law.]`,
  },
  {
    projectId: 'edith',
    projectName: 'Edith',
    content: `[Your Terms of Service text here. This section should contain the specific legal terms, conditions, and user agreements for Edith. Include sections on: Acceptance of Terms, Use License, Disclaimer, Limitations, and Governing Law.]`,
  },
];

export const privacyContent: LegalContent[] = [
  {
    projectId: 'platonic',
    projectName: 'Platonic',
    content: `[Your Privacy Policy text here. This section should contain the specific privacy practices, data collection policies, and user rights information for Platonic. Include sections on: Information We Collect, How We Use Information, Data Security, and Your Rights.]`,
  },
  {
    projectId: 'yhea',
    projectName: 'Yhea',
    content: `[Your Privacy Policy text here. This section should contain the specific privacy practices, data collection policies, and user rights information for Yhea. Include sections on: Information We Collect, How We Use Information, Data Security, and Your Rights.]`,
  },
  {
    projectId: 'thea',
    projectName: 'Thea',
    content: `[Your Privacy Policy text here. This section should contain the specific privacy practices, data collection policies, and user rights information for Thea. Include sections on: Information We Collect, How We Use Information, Data Security, and Your Rights.]`,
  },
  {
    projectId: 'edith',
    projectName: 'Edith',
    content: `[Your Privacy Policy text here. This section should contain the specific privacy practices, data collection policies, and user rights information for Edith. Include sections on: Information We Collect, How We Use Information, Data Security, and Your Rights.]`,
  },
];
