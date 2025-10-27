// Skill Types for ATS Tracker
// UC-026 & UC-027: Skills Management

export type ProficiencyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type SkillCategory = 'Technical' | 'Soft Skills' | 'Languages' | 'Industry-Specific';

export interface SkillData {
  id: string;
  skillName: string;
  proficiency: ProficiencyLevel;
  category?: SkillCategory;
  skillBadge?: string;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SkillInput {
  skillName: string;
  proficiency: ProficiencyLevel;
  category?: SkillCategory;
  skillBadge?: string;
}

export interface SkillsByCategory {
  [category: string]: SkillData[];
}

export interface CategoryCounts {
  [category: string]: number;
}

export interface SkillStatistics {
  totalSkills: number;
  byProficiency: {
    Beginner: number;
    Intermediate: number;
    Advanced: number;
    Expert: number;
  };
  byCategory: CategoryCounts;
}

// Proficiency level definitions with visual properties
export const PROFICIENCY_CONFIG = {
  Beginner: {
    label: 'Beginner',
    percent: 25,
    color: '#3B82F6',      // Blue 500
    bgColor: '#DBEAFE',    // Blue 100
    textColor: '#1E40AF',  // Blue 800
  },
  Intermediate: {
    label: 'Intermediate',
    percent: 50,
    color: '#2563EB',      // Blue 600
    bgColor: '#BFDBFE',    // Blue 200
    textColor: '#1E3A8A',  // Blue 900
  },
  Advanced: {
    label: 'Advanced',
    percent: 75,
    color: '#1D4ED8',      // Blue 700
    bgColor: '#93C5FD',    // Blue 300
    textColor: '#1E3A8A',  // Blue 900
  },
  Expert: {
    label: 'Expert',
    percent: 100,
    color: '#1E40AF',      // Blue 800
    bgColor: '#60A5FA',    // Blue 400
    textColor: '#1E3A8A',  // Blue 900
  },
} as const;

// Common skills for autocomplete suggestions (80+ skills)
export const COMMON_SKILLS: Record<SkillCategory, string[]> = {
  Technical: [
    // Programming Languages
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
    'Swift', 'Kotlin', 'Dart', 'Scala', 'R', 'MATLAB', 'Perl', 'Shell Scripting',
    // Frontend
    'React', 'Vue.js', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Redux', 'React Native',
    'HTML', 'CSS', 'Sass', 'LESS', 'Tailwind CSS', 'Bootstrap', 'Material-UI', 'Webpack',
    // Backend
    'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'ASP.NET', 'Laravel',
    'Ruby on Rails', 'NestJS', 'GraphQL', 'REST API', 'Microservices', 'gRPC',
    // Databases
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Firebase', 'Oracle', 'Cassandra',
    'DynamoDB', 'Elasticsearch', 'SQLite', 'MariaDB',
    // DevOps & Cloud
    'Git', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD', 'GitHub Actions', 'GitLab CI',
    'AWS', 'Azure', 'GCP', 'Terraform', 'Ansible', 'Linux', 'Bash', 'PowerShell',
    // Testing
    'Jest', 'Mocha', 'Chai', 'Pytest', 'JUnit', 'Selenium', 'Cypress', 'Testing Library',
    // Other
    'Agile', 'Scrum', 'Jira', 'Machine Learning', 'Data Science', 'AI', 'TensorFlow', 'PyTorch',
  ],
  'Soft Skills': [
    'Leadership', 'Communication', 'Team Collaboration', 'Problem Solving',
    'Critical Thinking', 'Creativity', 'Time Management', 'Project Management',
    'Public Speaking', 'Presentation Skills', 'Mentoring', 'Coaching',
    'Conflict Resolution', 'Negotiation', 'Adaptability', 'Emotional Intelligence',
    'Decision Making', 'Strategic Thinking', 'Analytical Skills', 'Active Listening',
    'Empathy', 'Persuasion', 'Delegation', 'Motivation', 'Customer Service',
    'Stakeholder Management', 'Change Management', 'Facilitation', 'Networking',
    'Interpersonal Skills', 'Cross-functional Collaboration', 'Attention to Detail',
  ],
  Languages: [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
    'Chinese (Mandarin)', 'Japanese', 'Korean', 'Arabic', 'Russian',
    'Hindi', 'Dutch', 'Polish', 'Turkish', 'Vietnamese', 'Thai',
    'Indonesian', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Greek',
    'Hebrew', 'Bengali', 'Urdu', 'Punjabi', 'Tamil', 'Telugu',
  ],
  'Industry-Specific': [
    'Financial Analysis', 'Healthcare Management', 'Legal Compliance',
    'Manufacturing Processes', 'Retail Operations', 'Supply Chain Management',
    'Quality Assurance', 'Regulatory Compliance', 'Risk Management',
    'Market Research', 'Sales Strategy', 'Business Development',
    'Product Management', 'UX Design', 'UI Design', 'Brand Management',
    'Content Strategy', 'SEO', 'SEM', 'Digital Marketing', 'Social Media Marketing',
    'Email Marketing', 'Data Analytics', 'Business Intelligence', 'Accounting',
    'Auditing', 'Tax Planning', 'Investment Analysis', 'Portfolio Management',
    'Insurance', 'Real Estate', 'Construction Management', 'Event Planning',
  ],
};

// Category metadata
export const CATEGORY_CONFIG: Record<SkillCategory, { icon: string; color: string; description: string }> = {
  Technical: {
    icon: 'mingcute:code-line',
    color: '#3B82F6',
    description: 'Programming, frameworks, tools, and technologies',
  },
  'Soft Skills': {
    icon: 'mingcute:user-star-line',
    color: '#8B5CF6',
    description: 'Interpersonal and professional skills',
  },
  Languages: {
    icon: 'mingcute:translate-2-line',
    color: '#10B981',
    description: 'Spoken and written languages',
  },
  'Industry-Specific': {
    icon: 'mingcute:building-2-line',
    color: '#F59E0B',
    description: 'Domain-specific knowledge and expertise',
  },
};

