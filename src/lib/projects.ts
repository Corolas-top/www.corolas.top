import { supabase } from './supabase';
import type { Project } from '@/types/project';

export async function fetchProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('status', 'active')
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category,
    domain: row.domain,
    logo_url: row.logo_url,
    short_description: row.short_description,
    full_description: row.full_description,
    features: Array.isArray(row.features) ? row.features : [],
    status: row.status,
    display_order: row.display_order,
    created_at: row.created_at,
    updated_at: row.updated_at,
  })) as Project[];
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) {
    console.error('Failed to fetch project:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    category: data.category,
    domain: data.domain,
    logo_url: data.logo_url,
    short_description: data.short_description,
    full_description: data.full_description,
    features: Array.isArray(data.features) ? data.features : [],
    status: data.status,
    display_order: data.display_order,
    created_at: data.created_at,
    updated_at: data.updated_at,
  } as Project;
}

export function groupByCategory(projects: Project[]) {
  return {
    platforms: projects.filter((p) => p.category === 'platform'),
    applications: projects.filter((p) => p.category === 'application'),
  };
}
