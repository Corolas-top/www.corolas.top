export interface Project {
  id: string;
  name: string;
  slug: string;
  category: 'platform' | 'application';
  domain: string;
  logo_url: string | null;
  short_description: string;
  full_description: string;
  features: string[];
  status: 'active' | 'inactive' | 'development';
  display_order: number;
  created_at: string;
  updated_at: string;
}
