export interface JobData {
  id: string;
  title: string;
  company: string;
  location?: string;
  salary?: number;
  startDate?: string;
  endDate?: string;
  description?: string;
  isCurrent: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobInput {
  title: string;
  company: string;
  location?: string;
  salary?: number;
  startDate?: string;
  endDate?: string;
  description?: string;
  isCurrent: boolean;
}

export interface JobStatistics {
  totalJobs: number;
  currentJob: JobData | null;
  totalExperienceMonths: number;
  totalExperienceYears: string;
  averageTenureMonths: number;
  companiesWorked: number;
}

export interface JobFilters {
  current?: boolean;
  sortBy?: 'startDate' | 'company' | 'title';
  sortOrder?: 'asc' | 'desc';
}

