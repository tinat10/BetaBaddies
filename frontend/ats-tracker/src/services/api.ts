import { ApiResponse, ProfileData, ProfileInput, EducationData, EducationInput, ProjectData, ProjectInput, ProjectFilters, ProjectSortOptions, CertificationData, CertificationInput, SkillData, SkillInput, SkillsByCategory, CategoryCounts, ProfilePictureData, FileUploadResponse } from '../types';

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

  // Password reset endpoints
  async forgotPassword(email: string) {
    return this.request<ApiResponse<{ message: string }>>('/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, newPassword: string) {
    return this.request<ApiResponse<{ message: string }>>('/users/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    });
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

  // File Upload endpoints
  async uploadProfilePicture(file: File) {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await fetch(`${API_BASE}/files/profile-picture`, {
      method: 'POST',
      credentials: 'include',
      body: formData, // Don't set Content-Type header, browser will set it with boundary
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ 
        error: { message: 'Upload failed' } 
      }));
      throw new Error(error.error?.message || 'Upload failed');
    }

    return response.json() as Promise<ApiResponse<FileUploadResponse>>;
  }

  async getCurrentProfilePicture() {
    return this.request<ApiResponse<{ profilePicture: ProfilePictureData }>>('/files/profile-picture');
  }

  async deleteFile(fileId: string) {
    return this.request<ApiResponse<{ message: string }>>(`/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  // Job/Employment endpoints (Full CRUD)
  async getJobs(filters?: { current?: boolean }) {
    const query = filters?.current !== undefined ? `?current=${filters.current}` : '';
    return this.request<ApiResponse<{ jobs: any[] }>>(`/jobs${query}`);
  }

  async getJob(id: string) {
    return this.request<ApiResponse<{ job: any }>>(`/jobs/${id}`);
  }

  async createJob(jobData: any) {
    return this.request<ApiResponse<{ job: any; message: string }>>('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async updateJob(id: string, jobData: any) {
    return this.request<ApiResponse<{ job: any; message: string }>>(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(id: string) {
    return this.request<ApiResponse<{ message: string }>>(`/jobs/${id}`, {
      method: 'DELETE',
    });
  }

  async getCurrentJob() {
    return this.request<ApiResponse<{ job: any | null }>>('/jobs/current');
  }

  async getJobHistory() {
    return this.request<ApiResponse<{ history: any[] }>>('/jobs/history');
  }

  async getJobStatistics() {
    return this.request<ApiResponse<{ statistics: any }>>('/jobs/statistics');
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

  // Certifications endpoints
  async getCertifications() {
    return this.request<ApiResponse<{ certifications: CertificationData[]; count: number }>>('/certifications');
  }

  async getCertification(id: string) {
    return this.request<ApiResponse<{ certification: CertificationData }>>(`/certifications/${id}`);
  }

  async createCertification(data: CertificationInput) {
    return this.request<ApiResponse<{ certification: CertificationData; message: string }>>('/certifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCertification(id: string, data: Partial<CertificationInput>) {
    return this.request<ApiResponse<{ certification: CertificationData; message: string }>>(`/certifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCertification(id: string) {
    return this.request<ApiResponse<{ message: string }>>(`/certifications/${id}`, {
      method: 'DELETE',
    });
  }

  async getCurrentCertifications() {
    return this.request<ApiResponse<{ certifications: CertificationData[]; count: number }>>('/certifications/current');
  }

  async getCertificationHistory() {
    return this.request<ApiResponse<{ certifications: CertificationData[]; count: number }>>('/certifications/history');
  }

  async getExpiringCertifications(days: number = 30) {
    return this.request<ApiResponse<{ certifications: CertificationData[]; count: number; daysAhead: number }>>(`/certifications/expiring?days=${days}`);
  }

  async getCertificationStatistics() {
    return this.request<ApiResponse<{ statistics: any }>>('/certifications/statistics');
  }

  async searchCertifications(searchTerm: string) {
    return this.request<ApiResponse<{ certifications: CertificationData[]; count: number; searchTerm: string }>>(`/certifications/search?q=${encodeURIComponent(searchTerm)}`);
  }

  async getCertificationsByOrganization(organization: string) {
    return this.request<ApiResponse<{ certifications: CertificationData[]; count: number; organization: string }>>(`/certifications/organization?organization=${encodeURIComponent(organization)}`);
  }

  // Skills endpoints (Full CRUD + Category grouping)
  async getSkills(category?: string) {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return this.request<ApiResponse<{ skills: SkillData[] }>>(`/skills${query}`);
  }

  async getSkillsByCategory() {
    return this.request<ApiResponse<{ 
      skillsByCategory: SkillsByCategory; 
      categoryCounts: CategoryCounts;
    }>>('/skills/categories');
  }

  async getSkill(id: string) {
    return this.request<ApiResponse<{ skill: SkillData }>>(`/skills/${id}`);
  }

  async createSkill(skillData: SkillInput) {
    return this.request<ApiResponse<{ skill: SkillData; message: string }>>('/skills', {
      method: 'POST',
      body: JSON.stringify(skillData),
    });
  }

  async updateSkill(id: string, skillData: Partial<SkillInput>) {
    return this.request<ApiResponse<{ skill: SkillData; message: string }>>(`/skills/${id}`, {
      method: 'PUT',
      body: JSON.stringify(skillData),
    });
  }

  async deleteSkill(id: string) {
    return this.request<ApiResponse<{ message: string }>>(`/skills/${id}`, {
      method: 'DELETE',
    });
  }

  // Account deletion (UC-009)
  async deleteAccount(password: string, confirmationText: string) {
    return this.request<ApiResponse<{ message: string; deletedAt: string }>>('/users/account', {
      method: 'DELETE',
      body: JSON.stringify({ password, confirmationText }),
    });
  }
}

export const api = new ApiService();


