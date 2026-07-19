-- ==========================================
-- SKILLVERSE AI - COMPLETE DATABASE MIGRATION
-- Target: Supabase PostgreSQL Database
-- ==========================================

-- Enable UUID Generator
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. UTILITIES: Auto-update updated_at column function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. TABLE: Roles
CREATE TABLE public.roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed System Roles
INSERT INTO public.roles (name) VALUES ('student'), ('educator'), ('admin') ON CONFLICT DO NOTHING;

-- 3. TABLE: Users (Profiles Base)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 4. TABLE: User Roles (Junction Table for RBAC)
CREATE TABLE public.user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, role_id)
);

-- 5. TABLE: Language Preferences
CREATE TABLE public.language_preferences (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    app_language VARCHAR(50) DEFAULT 'English' NOT NULL,
    classroom_language VARCHAR(50) DEFAULT 'English' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_lang_prefs_modtime
    BEFORE UPDATE ON public.language_preferences
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 6. TABLE: Educators (Extends profiles)
CREATE TABLE public.educators (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    bio TEXT,
    specialization VARCHAR(150),
    approved BOOLEAN DEFAULT false NOT NULL,
    approved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- 'pending', 'active', 'suspended'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_educators_modtime
    BEFORE UPDATE ON public.educators
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 7. TABLE: Students (Extends profiles)
CREATE TABLE public.students (
    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    enrollment_number VARCHAR(100) UNIQUE,
    details JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_students_modtime
    BEFORE UPDATE ON public.students
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 8. TABLE: Courses
CREATE TABLE public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    educator_id UUID REFERENCES public.educators(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    language VARCHAR(50) DEFAULT 'English' NOT NULL,
    is_published BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_courses_modtime
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 9. TABLE: Lessons (Lectures under courses)
CREATE TABLE public.lessons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content_text TEXT,
    order_index INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_lessons_modtime
    BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 10. TABLE: Videos
CREATE TABLE public.videos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    original_language VARCHAR(50) NOT NULL,
    file_path TEXT NOT NULL,
    duration_seconds INT DEFAULT 0 NOT NULL,
    status VARCHAR(50) DEFAULT 'processing' NOT NULL, -- 'processing', 'completed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_videos_modtime
    BEFORE UPDATE ON public.videos
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 11. TABLE: PDFs
CREATE TABLE public.pdfs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'processing' NOT NULL, -- 'processing', 'completed', 'failed'
    parsed_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_pdfs_modtime
    BEFORE UPDATE ON public.pdfs
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 12. TABLE: PPTs
CREATE TABLE public.ppts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'processing' NOT NULL,
    parsed_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_ppts_modtime
    BEFORE UPDATE ON public.ppts
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 13. TABLE: Assignments
CREATE TABLE public.assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    max_score DECIMAL(5, 2) DEFAULT 100.00 NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_assignments_modtime
    BEFORE UPDATE ON public.assignments
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 14. TABLE: Quizzes
CREATE TABLE public.quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    questions JSONB NOT NULL, -- List of: {question: str, options: str[], correct_index: int}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_quizzes_modtime
    BEFORE UPDATE ON public.quizzes
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 15. TABLE: Notes
CREATE TABLE public.notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    is_ai_generated BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_notes_modtime
    BEFORE UPDATE ON public.notes
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 16. TABLE: Flashcards
CREATE TABLE public.flashcards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    deck_name VARCHAR(150),
    cards JSONB NOT NULL, -- [{front: str, back: str}]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_flashcards_modtime
    BEFORE UPDATE ON public.flashcards
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 17. TABLE: Bookmarks
CREATE TABLE public.bookmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    item_type VARCHAR(50) NOT NULL, -- 'lesson', 'video', 'pdf', 'notes', 'assignment'
    item_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, item_type, item_id)
);

-- 18. TABLE: Certificates
CREATE TABLE public.certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    issue_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    certificate_url TEXT NOT NULL
);

-- 19. TABLE: Notifications
CREATE TABLE public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 20. TABLE: Live Sessions
CREATE TABLE public.live_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    educator_id UUID REFERENCES public.educators(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled' NOT NULL, -- 'scheduled', 'live', 'completed'
    webrtc_room_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_live_sessions_modtime
    BEFORE UPDATE ON public.live_sessions
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 21. TABLE: Attendance (Session attendance log)
CREATE TABLE public.attendance (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.live_sessions(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    left_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(session_id, student_id)
);

-- 22. TABLE: AI Chat History
CREATE TABLE public.ai_chat_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    session_id VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'user', 'assistant'
    message TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'English' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 23. TABLE: Translation History
CREATE TABLE public.translation_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    source_text TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    source_language VARCHAR(50) NOT NULL,
    target_language VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 24. TABLE: Learning Progress
CREATE TABLE public.learning_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    completed BOOLEAN DEFAULT false NOT NULL,
    quiz_score DECIMAL(5, 2),
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, lesson_id)
);

-- 25. TABLE: Analytics (Platform event logger)
CREATE TABLE public.analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL, -- 'login', 'play_video', 'solve_quiz', 'chat_query'
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    page_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==========================================
-- INDEXES CONFIGURATION FOR PERFORMANCE
-- ==========================================
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);
CREATE INDEX idx_educators_status ON public.educators(status);
CREATE INDEX idx_courses_educator ON public.courses(educator_id);
CREATE INDEX idx_lessons_course ON public.lessons(course_id);
CREATE INDEX idx_videos_lesson ON public.videos(lesson_id);
CREATE INDEX idx_pdfs_lesson ON public.pdfs(lesson_id);
CREATE INDEX idx_ppts_lesson ON public.ppts(lesson_id);
CREATE INDEX idx_assignments_lesson ON public.assignments(lesson_id);
CREATE INDEX idx_quizzes_lesson ON public.quizzes(lesson_id);
CREATE INDEX idx_notes_student ON public.notes(student_id);
CREATE INDEX idx_bookmarks_student ON public.bookmarks(student_id);
CREATE INDEX idx_certificates_student ON public.certificates(student_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id) WHERE is_read = false;
CREATE INDEX idx_live_sessions_course ON public.live_sessions(course_id);
CREATE INDEX idx_attendance_session ON public.attendance(session_id);
CREATE INDEX idx_ai_chat_history_session ON public.ai_chat_history(session_id);
CREATE INDEX idx_learning_progress_student ON public.learning_progress(student_id);
CREATE INDEX idx_analytics_event ON public.analytics(event_type, created_at);

-- ==========================================
-- PROFILE AUTO-CREATION DATABASE TRIGGER
-- ==========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_role_id UUID;
    user_role_str TEXT;
BEGIN
    -- Synchronize profile
    INSERT INTO public.profiles (id, full_name)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'SkillVerse Member')
    );
    
    -- Sync default language settings
    INSERT INTO public.language_preferences (user_id, app_language, classroom_language)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'preferred_language', 'English'),
        COALESCE(new.raw_user_meta_data->>'preferred_language', 'English')
    );
    
    -- Extract desired system role
    user_role_str := COALESCE(new.raw_user_meta_data->>'role', 'student');
    
    -- Fetch target role ID
    SELECT id INTO default_role_id FROM public.roles WHERE name = user_role_str;
    IF default_role_id IS NULL THEN
        SELECT id INTO default_role_id FROM public.roles WHERE name = 'student';
    END IF;
    
    -- Assign user role
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (new.id, default_role_id);
    
    -- Create sub-entity profiles based on role
    IF user_role_str = 'student' THEN
        INSERT INTO public.students (id) VALUES (new.id);
    ELSIF user_role_str = 'educator' THEN
        INSERT INTO public.educators (id, approved, status) VALUES (new.id, false, 'pending');
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES Setup
-- ==========================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.language_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pdfs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ppts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- 1. Profiles & Roles Policies
CREATE POLICY "Public profiles are readable by authenticated users" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can edit own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Language Preference Policies
CREATE POLICY "Users can manage own language preference" ON public.language_preferences FOR ALL USING (auth.uid() = user_id);

-- 3. Educators Profiles Policies
CREATE POLICY "Active educators can be viewed by all" ON public.educators FOR SELECT USING (status = 'active' OR auth.uid() = id);
CREATE POLICY "Admins can update educator profiles" ON public.educators FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.user_id = auth.uid() AND r.name = 'admin'
    )
);

-- 4. Courses Policies
CREATE POLICY "Anyone can view published courses" ON public.courses FOR SELECT USING (is_published = true OR auth.uid() = (SELECT id FROM public.profiles WHERE id = (SELECT id FROM public.educators WHERE id = educator_id)));
CREATE POLICY "Educators can insert courses" ON public.courses FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.user_id = auth.uid() AND r.name IN ('educator', 'admin')
    )
);

-- 5. AI Chat History Policies
CREATE POLICY "Users can manage own chat logs" ON public.ai_chat_history FOR ALL USING (auth.uid() = user_id);

-- 6. Notifications Policies
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- 7. Learning Progress Policies
CREATE POLICY "Students can access own learning progress records" ON public.learning_progress FOR ALL USING (auth.uid() = student_id);
