import { api } from './api';
import { DashboardProfileData, EducationData } from '../types';

export class DashboardService {
  /**
   * Fetches all dashboard data from the backend
   * Returns default values if data doesn't exist
   * 
   * The backend automatically knows which user to fetch data for via session cookie.
   * No need to pass user_id or email - it's handled by session authentication.
   */
  async getDashboardData(): Promise<DashboardProfileData> {
    try {
      // Fetch all data in parallel (including profile for display name)
      const [
        profileResponse,
        jobsResponse,
        jobHistoryResponse,
        skillsResponse,
        skillsCategoryResponse,
        educationResponse,
        projectsResponse,
      ] = await Promise.allSettled([
        api.getProfile(),
        api.getJobs(),
        api.getJobHistory(),
        api.getSkills(),
        api.getSkillsByCategory(),
        api.getEducation(),
        api.getProjects(),
      ]);

      // Extract data or use empty arrays/defaults
      // API responses have structure: { ok: true, data: { jobs: [...], ...} }
      const profileData = profileResponse.status === 'fulfilled' ? profileResponse.value.data : null;
      const jobs = jobsResponse.status === 'fulfilled' ? jobsResponse.value.data?.jobs || [] : [];
      const jobHistory = jobHistoryResponse.status === 'fulfilled' ? jobHistoryResponse.value.data?.history || [] : [];
      const skills = skillsResponse.status === 'fulfilled' ? skillsResponse.value.data?.skills || [] : [];
      const categoryCounts = skillsCategoryResponse.status === 'fulfilled' ? skillsCategoryResponse.value.data?.categoryCounts || {} : {};
      const education: EducationData[] = educationResponse.status === 'fulfilled' ? educationResponse.value.data?.educations || [] : [];
      const projects = projectsResponse.status === 'fulfilled' ? projectsResponse.value.data?.projects || [] : [];

      // Get display name from profile data
      const displayName = profileData?.profile?.fullName || 'User';

      // Calculate counts
      const employmentCount = Array.isArray(jobs) ? jobs.length : 0;
      const skillsCount = Array.isArray(skills) ? skills.length : 0;
      const educationCount = Array.isArray(education) ? education.length : 0;
      const projectsCount = Array.isArray(projects) ? projects.length : 0;

      // Calculate profile completion percentage
      const profileCompletion = this.calculateProfileCompletion({
        employment: employmentCount,
        skills: skillsCount,
        education: educationCount,
        projects: projectsCount,
      });

      // Process skills distribution
      const skillsDistribution = this.processSkillsDistribution(categoryCounts);

      // Process career timeline from job history
      const careerTimeline = this.processCareerTimeline(jobHistory);

      // Generate suggestions based on what's missing
      const suggestions = this.generateSuggestions({
        employment: employmentCount,
        skills: skillsCount,
        education: educationCount,
        projects: projectsCount,
      });

      // Calculate profile strength
      const profileStrength = this.calculateProfileStrength({
        employment: employmentCount,
        skills: skillsCount,
        education: educationCount,
        projects: projectsCount,
      });

      // Get recent activity (placeholder for now - can be enhanced with actual activity tracking)
      const recentActivity = this.getRecentActivity(jobs, skills, education, projects);

      const result = {
        name: displayName,
        profileCompletion,
        employment: employmentCount,
        skills: skillsCount,
        education: educationCount,
        projects: projectsCount,
        recentActivity,
        skillsDistribution,
        careerTimeline,
        suggestions,
        profileStrength,
      };
      
      console.log('Dashboard data prepared:', result);
      console.log('Suggestions type:', typeof suggestions, 'Is array:', Array.isArray(suggestions), 'Value:', suggestions);
      
      return result;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Return empty defaults if everything fails
      return this.getDefaultDashboardData();
    }
  }

  /**
   * Returns default/empty dashboard data
   */
  getDefaultDashboardData(): DashboardProfileData {
    return {
      name: 'User',
      profileCompletion: 0,
      employment: 0,
      skills: 0,
      education: 0,
      projects: 0,
      recentActivity: [],
      skillsDistribution: [
        { category: 'Frontend', count: 0 },
        { category: 'Backend', count: 0 },
        { category: 'DevOps', count: 0 },
        { category: 'Other', count: 0 },
      ],
      careerTimeline: [],
      suggestions: [
        'Add your employment history to get started',
        'List your technical skills',
        'Add your education background',
        'Showcase your projects',
      ],
      profileStrength: {
        overall: 0,
        categories: [
          { name: 'Employment History', score: 0 },
          { name: 'Skills & Expertise', score: 0 },
          { name: 'Education', score: 0 },
          { name: 'Projects Portfolio', score: 0 },
        ],
      },
    };
  }

  /**
   * Calculate profile completion percentage
   */
  private calculateProfileCompletion(counts: {
    employment: number;
    skills: number;
    education: number;
    projects: number;
  }): number {
    const weights = {
      employment: 25,
      skills: 25,
      education: 25,
      projects: 25,
    };

    let completion = 0;
    if (counts.employment > 0) completion += weights.employment;
    if (counts.skills >= 3) completion += weights.skills;
    if (counts.education > 0) completion += weights.education;
    if (counts.projects > 0) completion += weights.projects;

    return completion;
  }

  /**
   * Process skills into distribution by category
   */
  private processSkillsDistribution(skillsByCategory: any): Array<{ category: string; count: number }> {
    if (!skillsByCategory || Object.keys(skillsByCategory).length === 0) {
      return [
        { category: 'Frontend', count: 0 },
        { category: 'Backend', count: 0 },
        { category: 'DevOps', count: 0 },
        { category: 'Other', count: 0 },
      ];
    }

    // Convert backend response to array format
    return Object.entries(skillsByCategory).map(([category, count]) => ({
      category,
      count: count as number,
    }));
  }

  /**
   * Process job history into career timeline
   */
  private processCareerTimeline(jobHistory: any[]): Array<{ year: string; company: string; position: string }> {
    if (!Array.isArray(jobHistory) || jobHistory.length === 0) {
      return [];
    }

    return jobHistory.map((job: any) => ({
      year: job.start_date ? new Date(job.start_date).getFullYear().toString() : 'Present',
      company: job.company || 'Unknown Company',
      position: job.title || 'Unknown Position',
    }));
  }

  /**
   * Generate suggestions based on what's missing
   */
  private generateSuggestions(counts: {
    employment: number;
    skills: number;
    education: number;
    projects: number;
  }): string[] {
    const suggestions: string[] = [];

    if (counts.employment === 0) {
      suggestions.push('Add your employment history to showcase your experience');
    } else if (counts.employment < 2) {
      suggestions.push('Add more employment entries to strengthen your profile');
    }

    if (counts.skills === 0) {
      suggestions.push('List your technical skills to highlight your expertise');
    } else if (counts.skills < 5) {
      suggestions.push('Add more skills to improve your profile visibility');
    }

    if (counts.education === 0) {
      suggestions.push('Add your education background');
    }

    if (counts.projects === 0) {
      suggestions.push('Showcase your projects to demonstrate your work');
    } else if (counts.projects < 3) {
      suggestions.push('Add more project descriptions to improve your portfolio');
    }

    return suggestions.length > 0 ? suggestions : ['Your profile looks great! Keep it up to date.'];
  }

  /**
   * Calculate profile strength scores
   */
  private calculateProfileStrength(counts: {
    employment: number;
    skills: number;
    education: number;
    projects: number;
  }): { overall: number; categories: Array<{ name: string; score: number }> } {
    const employmentScore = Math.min(100, (counts.employment / 3) * 100);
    const skillsScore = Math.min(100, (counts.skills / 10) * 100);
    const educationScore = Math.min(100, (counts.education / 2) * 100);
    const projectsScore = Math.min(100, (counts.projects / 5) * 100);

    const overall = Math.round((employmentScore + skillsScore + educationScore + projectsScore) / 4);

    return {
      overall,
      categories: [
        { name: 'Employment History', score: Math.round(employmentScore) },
        { name: 'Skills & Expertise', score: Math.round(skillsScore) },
        { name: 'Education', score: Math.round(educationScore) },
        { name: 'Projects Portfolio', score: Math.round(projectsScore) },
      ],
    };
  }

  /**
   * Get recent activity from the data
   */
  private getRecentActivity(jobs: any[], skills: any[], _education: any[], projects: any[]): Array<{
    id: number;
    action: string;
    item: string;
    timestamp: string;
  }> {
    const activities: Array<{ id: number; action: string; item: string; timestamp: string; date: Date }> = [];

    // Add recent jobs
    if (Array.isArray(jobs)) {
      jobs.slice(0, 2).forEach((job: any) => {
        activities.push({
          id: activities.length + 1,
          action: 'Added employment',
          item: `${job.title} at ${job.company}`,
          timestamp: this.formatTimestamp(job.created_at),
          date: new Date(job.created_at || Date.now()),
        });
      });
    }

    // Add recent skills
    if (Array.isArray(skills)) {
      skills.slice(0, 2).forEach((skill: any) => {
        activities.push({
          id: activities.length + 1,
          action: 'Added skill',
          item: skill.skill_name || skill.name || 'Skill',
          timestamp: this.formatTimestamp(skill.created_at),
          date: new Date(skill.created_at || Date.now()),
        });
      });
    }

    // Add recent projects
    if (Array.isArray(projects)) {
      projects.slice(0, 2).forEach((project: any) => {
        activities.push({
          id: activities.length + 1,
          action: 'Added project',
          item: project.name || project.title || 'Project',
          timestamp: this.formatTimestamp(project.created_at),
          date: new Date(project.created_at || Date.now()),
        });
      });
    }

    // Sort by date and take the 4 most recent
    return activities
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 4)
      .map(({ date, ...rest }) => rest);
  }

  /**
   * Format timestamp to relative time
   */
  private formatTimestamp(date: string | Date | undefined): string {
    if (!date) return 'Recently';
    
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffInDays / 30)} month${Math.floor(diffInDays / 30) > 1 ? 's' : ''} ago`;
  }
}

export const dashboardService = new DashboardService();

