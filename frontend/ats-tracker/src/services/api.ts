import { ApiResponse, ProfileData, ProfileInput, EducationData, EducationInput, ProjectData, ProjectInput, ProjectFilters, ProjectSortOptions } from '../types';

// In development, use proxy (relative path). In production, use env variable or full URL
const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      credentials: 'include', // Always send session cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: { message: 'Request failed' } 
      }));
      throw new Error(error.error?.message || 'Request failed');
    }

    return response.json();
  }

  // Authentication endpoints
  async login(email: string, password: string) {
    return this.request<ApiResponse<{ user: { id: string; email: string }; message: string }>>('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request<ApiResponse<{ message: string }>>('/users/logout', {
      method: 'POST',
    });
  }

  async register(email: string, password: string) {
    return this.request<ApiResponse<{ user: { id: string; email: string }; message: string }>>('/users/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // User endpoints (authentication data only)
  async getUserAuth() {
    // NOTE: This endpoint only returns users table data (email, id)
    return this.request<ApiResponse<{ 
      user: { 
        id: string; 
        email: string;
        createdAt?: string;
        updatedAt?: string;
      };
    }>>('/users/profile');
  }

  // Profile endpoints (personal information from profiles table)
  async getProfile() {
    return this.request<ApiResponse<{ profile: ProfileData }>>('/profile');
  }

  async createOrUpdateProfile(data: ProfileInput) {
    return this.request<ApiResponse<{ profile: ProfileData; message: string }>>('/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProfile(data: Partial<ProfileInput>) {
    return this.request<ApiResponse<{ profile: ProfileData; message: string }>>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getProfilePicture() {
    return this.request<ApiResponse<{ picturePath: string }>>('/profile/picture');
  }

  async getProfileStatistics() {
    return this.request<ApiResponse<{ statistics: any }>>('/profile/statistics');
  }

  // Job endpoints
  async getJobs() {
    return this.request<ApiResponse<any>>('/jobs');
  }

  async getJobHistory() {
    return this.request<ApiResponse<any>>('/jobs/history');
  }

  async getJobStatistics() {
    return this.request<ApiResponse<any>>('/jobs/statistics');
  }

  // Skills endpoints
  async getSkills() {
    return this.request<ApiResponse<any>>('/skills');
  }

  async getSkillsByCategory() {
    return this.request<ApiResponse<any>>('/skills/categories');
  }

  // Education endpoints
  async getEducation() {
    return this.request<ApiResponse<{ educations: EducationData[] }>>('/education');
  }

  async createEducation(data: EducationInput) {
    return this.request<ApiResponse<{ education: EducationData; message: string }>>('/education', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEducation(id: string, data: Partial<EducationInput>) {
    return this.request<ApiResponse<{ education: EducationData; message: string }>>(`/education/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEducation(id: string) {
    return this.request<ApiResponse<{ message: string }>>(`/education/${id}`, {
      method: 'DELETE',
    });
  }

  // Projects endpoints
  async getProjects(filters?: ProjectFilters, sortOptions?: ProjectSortOptions) {
    const params = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    
    if (sortOptions) {
      if (sortOptions.sortBy) params.append('sortBy', sortOptions.sortBy);
      if (sortOptions.sortOrder) params.append('sortOrder', sortOptions.sortOrder);
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/projects?${queryString}` : '/projects';
    
    return this.request<ApiResponse<{ projects: ProjectData[] }>>(endpoint);
  }

  async getProject(id: string) {
    return this.request<ApiResponse<{ project: ProjectData }>>(`/projects/${id}`);
  }

  async createProject(data: ProjectInput) {
    return this.request<ApiResponse<{ project: ProjectData; message: string }>>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: Partial<ProjectInput>) {
    return this.request<ApiResponse<{ project: ProjectData; message: string }>>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string) {
    return this.request<ApiResponse<{ message: string }>>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async searchProjects(searchTerm: string) {
    return this.request<ApiResponse<{ projects: ProjectData[]; count: number }>>(`/projects/search?q=${encodeURIComponent(searchTerm)}`);
  }

  async getProjectStatistics() {
    return this.request<ApiResponse<any>>('/projects/statistics');
  }
}

export const api = new ApiService();


