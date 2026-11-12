// Profile Types
export interface Profile {
  name: string;
  role: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  social: {
    github: string;
    linkedin: string;
    twitter?: string;
  };
  about: string;
  summary: string;
}

// Portfolio Types
export interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
  thumbnail: string;
  description: string;
  technologies: string[];
  shortDescription: string;
  gallery: string[];
  responsibilities: string[];
  challenges: string[];
  results: string[];
  liveUrl?: string;
  repoUrl?: string;
  featured: boolean;
}

// Skills Types
export type SkillCategory = "hard" | "soft";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 0-100
  icon?: string;
  description: string;
  years?: number;
}

// Experience Types
export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | "Present";
  description: string;
  responsibilities: string[];
  achievements: string[];
  technologies: string[];
}

// Education Types
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description: string;
  achievements: string[];
}

// Certificate Types
export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  description: string;
  skills: string[];
  image?: string;
}

// Contact Types
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Hobby Types
export interface Hobby {
  id: string;
  title: string;
  description: string;
  images: string[];
}

// Modal Types
export interface ModalState {
  isOpen: boolean;
  type:
    | "portfolio"
    | "skill"
    | "experience"
    | "education"
    | "certificate"
    | "hobby"
    | null;
  data:
    | PortfolioItem
    | Skill
    | Experience
    | Education
    | Certificate
    | Hobby
    | null;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
