// Dashboard-specific types
export interface DashboardProfileData {
  name: string;
  profileCompletion: number;
  employment: number;
  skills: number;
  education: number;
  projects: number;
  recentActivity: RecentActivity[];
  skillsDistribution: SkillDistribution[];
  careerTimeline: CareerTimelineItem[];
  suggestions: string[];
  profileStrength: ProfileStrength;
}

export interface RecentActivity {
  id: number;
  action: string;
  item: string;
  timestamp: string;
}

export interface SkillDistribution {
  category: string;
  count: number;
}

export interface CareerTimelineItem {
  id: string;
  year: string;
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  duration: string;
  location?: string;
}

export interface ProfileStrength {
  overall: number;
  categories: CategoryScore[];
}

export interface CategoryScore {
  name: string;
  score: number;
}

