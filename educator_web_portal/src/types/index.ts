export interface Profile {
  id: string;
  full_name: string;
  role: 'student' | 'educator' | 'admin';
  institution?: string;
  department?: string;
  preferred_language: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  language: string;
  duration_hours?: number;
  learning_outcomes?: string[];
  prerequisites?: string[];
  thumbnail_url?: string;
  is_published: boolean;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  language: string;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  file_path: string;
  file_type: 'Video' | 'PDF' | 'PPT' | 'DOCX' | 'Image' | 'Audio' | 'External Link';
  thumbnail_url?: string;
  status: 'processing' | 'completed' | 'failed';
  created_at: string;
}

export interface LiveSession {
  id: string;
  course_id: string;
  course_title?: string;
  title: string;
  description?: string;
  scheduled_at: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  webrtc_room_id?: string;
  join_link?: string;
  recording_url?: string;
  attendance_count?: number;
  created_at: string;
}

export interface Assignment {
  id: string;
  course_id: string;
  course_title?: string;
  title: string;
  description: string;
  max_score: number;
  due_date: string;
  submissions_count: number;
  created_at: string;
}

export interface StudentProgress {
  id: string;
  student_name: string;
  course_title: string;
  completion_rate: number;
  quiz_average: number;
  attendance_rate: number;
  watch_time_mins: number;
  last_active: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  type: 'announcement' | 'assignment' | 'live_session' | 'system';
  created_at: string;
}
