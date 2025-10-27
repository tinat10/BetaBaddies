// Project types based on backend schema
export interface ProjectData {
  id: string;
  user_id: string;
  name: string;
  link?: string | null;
  description?: string | null;
  start_date: string; // ISO date string
  end_date?: string | null; // ISO date string
  technologies?: string | null;
  collaborators?: string | null;
  status: 'Completed' | 'Ongoing' | 'Planned';
  industry?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectInput {
  name: string;
  link?: string | null;
  description?: string | null;
  start_date: string;
  end_date?: string | null;
  technologies?: string | null;
  collaborators?: string | null;
  status: 'Completed' | 'Ongoing' | 'Planned';
  industry?: string | null;
}

export interface ProjectFilters {
  status?: 'Completed' | 'Ongoing' | 'Planned';
  industry?: string;
  technology?: string;
  startDateFrom?: string;
  startDateTo?: string;
}

export interface ProjectSortOptions {
  sortBy?: 'start_date' | 'end_date' | 'name' | 'status';
  sortOrder?: 'asc' | 'desc';
}

