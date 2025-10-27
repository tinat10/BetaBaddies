// Education data as returned from backend (matches actual DB schema)
export interface EducationData {
  id: string;
  userId: string;
  school: string;
  degreeType: string; // This is the education level (Bachelor's, Master's, etc.)
  field?: string;
  gpa?: number;
  isEnrolled: boolean;
  honors?: string;
}

// For creating/updating education (what backend expects)
export interface EducationInput {
  school: string;
  degreeType: string; // Education level
  field?: string;
  gpa?: number;
  isEnrolled?: boolean;
  honors?: string;
}

// Education level options
export const EDUCATION_LEVELS = [
  'High School',
  'Associate',
  'Bachelor\'s',
  'Master\'s',
  'PhD',
  'Professional',
  'Certification',
  'Other'
] as const;

export type EducationLevel = typeof EDUCATION_LEVELS[number];

