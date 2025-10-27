// Skills data structure as returned from backend
export interface Skill {
  id: string;
  userId: string;
  skillName: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: 'Technical' | 'Soft Skills' | 'Languages' | 'Industry-Specific' | null;
  skillBadge: string | null;
}

// For creating/updating skills (backend expects camelCase in request body)
export interface SkillInput {
  skillName: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category?: 'Technical' | 'Soft Skills' | 'Languages' | 'Industry-Specific' | null;
  skillBadge?: string | null;
}

// Skills grouped by category
export interface SkillsByCategory {
  [category: string]: Skill[];
}

export interface SkillsCategoryData {
  skillsByCategory: SkillsByCategory;
  categoryCounts: { [category: string]: number };
}

// Proficiency level options
export const PROFICIENCY_LEVELS = [
  'Beginner',
  'Intermediate', 
  'Advanced',
  'Expert'
] as const;

// Category options
export const SKILL_CATEGORIES = [
  'Technical',
  'Soft Skills',
  'Languages',
  'Industry-Specific'
] as const;
