export interface Educator {
  id: string;
  full_name: string;
  email: string;
  department: string;
  status: 'active' | 'suspended';
  courses_count: number;
  students_count: number;
  joined_at: string;
  password?: string;
}

export interface Course {
  id: string;
  title: string;
  educator_name: string;
  category: string;
  language: string;
  status: 'published' | 'draft' | 'archived' | 'pending_approval';
  students_enrolled: number;
  created_at: string;
}

export interface Student {
  id: string;
  full_name: string;
  email: string;
  courses_enrolled: number;
  completion_rate: number;
  certificates_earned: number;
  attendance_rate: number;
  last_active: string;
  password?: string;
}

export interface LiveSession {
  id: string;
  title: string;
  educator_name: string;
  course_title: string;
  scheduled_at: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  attendance_count: number;
  created_at: string;
}

export interface LanguageConfig {
  id: string;
  name: string;
  code: string;
  enabled: boolean;
  is_default: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'educator' | 'student' | 'platform';
  is_read: boolean;
  created_at: string;
}

export interface AIServiceConfig {
  id: string;
  service_name: string;
  provider: string;
  status: 'active' | 'inactive' | 'maintenance';
  api_key_set: boolean;
  usage_count: number;
  last_used: string;
}
