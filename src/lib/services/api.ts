import type {
  Profile,
  PortfolioItem,
  Skill,
  Experience,
  Education,
  Certificate,
  Hobby,
} from '@/types';

// Query Keys
export const queryKeys = {
  profile: ['profile'] as const,
  portfolio: ['portfolio'] as const,
  skills: ['skills'] as const,
  experiences: ['experiences'] as const,
  educations: ['educations'] as const,
  certificates: ['certificates'] as const,
  hobbies: ['hobbies'] as const,
} as const;

// Service functions
export async function fetchProfile(): Promise<Profile> {
  const res = await fetch('/api/profile');
  if (!res.ok) throw new Error('Failed to fetch profile');
  const json = await res.json();
  return json.data;
}

export async function fetchPortfolio(): Promise<PortfolioItem[]> {
  const res = await fetch('/api/portfolio');
  if (!res.ok) throw new Error('Failed to fetch portfolio');
  const json = await res.json();
  return json.data;
}

export async function fetchSkills(): Promise<Skill[]> {
  const res = await fetch('/api/skills');
  if (!res.ok) throw new Error('Failed to fetch skills');
  const json = await res.json();
  return json.data;
}

export async function fetchExperiences(): Promise<Experience[]> {
  const res = await fetch('/api/experiences');
  if (!res.ok) throw new Error('Failed to fetch experiences');
  const json = await res.json();
  return json.data;
}

export async function fetchEducations(): Promise<Education[]> {
  const res = await fetch('/api/educations');
  if (!res.ok) throw new Error('Failed to fetch educations');
  const json = await res.json();
  return json.data;
}

export async function fetchCertificates(): Promise<Certificate[]> {
  const res = await fetch('/api/certificates');
  if (!res.ok) throw new Error('Failed to fetch certificates');
  const json = await res.json();
  return json.data;
}

export async function fetchHobbies(): Promise<Hobby[]> {
  const res = await fetch('/api/hobbies');
  if (!res.ok) throw new Error('Failed to fetch hobbies');
  const json = await res.json();
  return json.data;
}
