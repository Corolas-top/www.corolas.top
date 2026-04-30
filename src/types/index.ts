export interface Project {
  id: string;
  name: string;
  domain: string;
  logo: string;
  description: string;
  link: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
}

export interface LegalContent {
  projectId: string;
  projectName: string;
  content: string;
}
