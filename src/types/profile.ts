export interface Profile {
  id: string;
  user_id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface ProfileFormData {
  username: string;
  full_name?: string;
  bio?: string;
}
