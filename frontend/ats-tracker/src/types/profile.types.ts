// Profile data as returned from backend (snake_case from database)
export interface ProfileData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  fullName: string; // Computed by backend (camelCase)
  phone?: string;
  city?: string;
  state: string;
  job_title?: string;
  bio?: string;
  industry?: string;
  exp_level?: string;
  user_id: string;
  pfp_link: string;
  email?: string; // From joined users table
  created_at?: string;
  updated_at?: string;
}

// For creating/updating profile (backend expects camelCase in request body)
export interface ProfileInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  phone?: string;
  city?: string;
  state: string;
  jobTitle?: string;
  bio?: string;
  industry?: string;
  expLevel?: string;
}

