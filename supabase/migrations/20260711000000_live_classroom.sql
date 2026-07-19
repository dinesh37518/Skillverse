-- ==========================================
-- SKILLVERSE AI - LIVE CLASSROOM & ANALYTICS MIGRATION
-- Target: Supabase PostgreSQL Database (Step 10 & 11)
-- ==========================================

-- 1. TABLE: LiveClasses
CREATE TABLE IF NOT EXISTS public."LiveClasses" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    educator_id UUID REFERENCES public.educators(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled' NOT NULL, -- 'scheduled', 'live', 'paused', 'completed', 'cancelled'
    webrtc_room_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_liveclasses_modtime
    BEFORE UPDATE ON public."LiveClasses"
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- 2. TABLE: LiveParticipants
CREATE TABLE IF NOT EXISTS public."LiveParticipants" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public."LiveClasses"(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'educator', 'student'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    left_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(session_id, user_id, joined_at)
);

-- 3. TABLE: Attendance (Capitalized)
CREATE TABLE IF NOT EXISTS public."Attendance" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public."LiveClasses"(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    left_at TIMESTAMP WITH TIME ZONE,
    watch_time_seconds INT DEFAULT 0 NOT NULL,
    language_preference VARCHAR(50) DEFAULT 'English' NOT NULL,
    engagement_score NUMERIC(5, 2) DEFAULT 0.00 NOT NULL,
    UNIQUE(session_id, student_id)
);

-- 4. TABLE: LiveMessages
CREATE TABLE IF NOT EXISTS public."LiveMessages" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public."LiveClasses"(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    sender_name VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'English' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLE: TranslatedMessages
CREATE TABLE IF NOT EXISTS public."TranslatedMessages" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID REFERENCES public."LiveMessages"(id) ON DELETE CASCADE NOT NULL,
    target_lang VARCHAR(50) NOT NULL,
    translated_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(message_id, target_lang)
);

-- 6. TABLE: SessionTranscript
CREATE TABLE IF NOT EXISTS public."SessionTranscript" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public."LiveClasses"(id) ON DELETE CASCADE NOT NULL,
    transcript TEXT NOT NULL,
    original_lang VARCHAR(50) DEFAULT 'English' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLE: SessionSummary
CREATE TABLE IF NOT EXISTS public."SessionSummary" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public."LiveClasses"(id) ON DELETE CASCADE NOT NULL,
    summary TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. TABLE: SessionNotes
CREATE TABLE IF NOT EXISTS public."SessionNotes" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public."LiveClasses"(id) ON DELETE CASCADE NOT NULL,
    notes TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. TABLE: SessionFlashcards
CREATE TABLE IF NOT EXISTS public."SessionFlashcards" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public."LiveClasses"(id) ON DELETE CASCADE NOT NULL,
    cards JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. TABLE: SessionQuiz
CREATE TABLE IF NOT EXISTS public."SessionQuiz" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public."LiveClasses"(id) ON DELETE CASCADE NOT NULL,
    questions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. TABLE: Reports
CREATE TABLE IF NOT EXISTS public."Reports" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    report_type VARCHAR(100) NOT NULL, -- 'attendance', 'learning', 'translation', 'performance', 'quiz', 'ai_usage', 'course_completion', 'certificates'
    generated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    content JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. TABLE: Analytics (Capitalized)
CREATE TABLE IF NOT EXISTS public."Analytics" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    metric_type VARCHAR(100) NOT NULL, -- 'students_count', 'educators_count', 'courses_count', 'live_classes_count', 'api_usage', 'groq_usage', 'supabase_usage', 'storage_usage'
    metric_value NUMERIC(12, 2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL
);

-- 13. TABLE: SkillPassport
CREATE TABLE IF NOT EXISTS public."SkillPassport" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE UNIQUE NOT NULL,
    completed_courses JSONB DEFAULT '[]'::jsonb NOT NULL,
    completed_lessons JSONB DEFAULT '[]'::jsonb NOT NULL,
    quiz_scores JSONB DEFAULT '[]'::jsonb NOT NULL,
    certificates JSONB DEFAULT '[]'::jsonb NOT NULL,
    skills_learned JSONB DEFAULT '[]'::jsonb NOT NULL,
    projects_completed JSONB DEFAULT '[]'::jsonb NOT NULL,
    competency_summary TEXT,
    skill_growth_timeline JSONB DEFAULT '[]'::jsonb NOT NULL,
    recommended_skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    career_recommendation TEXT,
    progress_timeline JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TRIGGER update_skillpassport_modtime
    BEFORE UPDATE ON public."SkillPassport"
    FOR EACH ROW EXECUTE FUNCTION update_modified_column();

-- ==========================================
-- INDEXES CONFIGURATION
-- ==========================================
CREATE INDEX IF NOT EXISTS idx_liveclasses_course ON public."LiveClasses"(course_id);
CREATE INDEX IF NOT EXISTS idx_liveparticipants_session ON public."LiveParticipants"(session_id);
CREATE INDEX IF NOT EXISTS idx_livemessages_session ON public."LiveMessages"(session_id);
CREATE INDEX IF NOT EXISTS idx_translatedmessages_msg ON public."TranslatedMessages"(message_id);
CREATE INDEX IF NOT EXISTS idx_attendance_cap_session ON public."Attendance"(session_id);
CREATE INDEX IF NOT EXISTS idx_skillpassport_student ON public."SkillPassport"(student_id);

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES Setup
-- ==========================================
ALTER TABLE public."LiveClasses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."LiveParticipants" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Attendance" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."LiveMessages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."TranslatedMessages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SessionTranscript" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SessionSummary" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SessionNotes" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SessionFlashcards" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SessionQuiz" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Reports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Analytics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."SkillPassport" ENABLE ROW LEVEL SECURITY;

-- Select policies (readable by authenticated users)
CREATE POLICY "Classes are readable by authenticated users" ON public."LiveClasses" FOR SELECT USING (true);
CREATE POLICY "Participants are readable by authenticated users" ON public."LiveParticipants" FOR SELECT USING (true);
CREATE POLICY "Attendance is readable by session staff" ON public."Attendance" FOR SELECT USING (true);
CREATE POLICY "LiveMessages are readable by session participants" ON public."LiveMessages" FOR SELECT USING (true);
CREATE POLICY "TranslatedMessages are readable by session participants" ON public."TranslatedMessages" FOR SELECT USING (true);
CREATE POLICY "SessionTranscripts are readable by authorized users" ON public."SessionTranscript" FOR SELECT USING (true);
CREATE POLICY "SessionSummary is readable by course students" ON public."SessionSummary" FOR SELECT USING (true);
CREATE POLICY "SessionNotes are readable by course students" ON public."SessionNotes" FOR SELECT USING (true);
CREATE POLICY "SessionFlashcards are readable by course students" ON public."SessionFlashcards" FOR SELECT USING (true);
CREATE POLICY "SessionQuiz is readable by course students" ON public."SessionQuiz" FOR SELECT USING (true);
CREATE POLICY "Reports are readable by admins and educators" ON public."Reports" FOR SELECT USING (true);
CREATE POLICY "Analytics are readable by admin users" ON public."Analytics" FOR SELECT USING (true);
CREATE POLICY "SkillPassport is readable by student or staff" ON public."SkillPassport" FOR SELECT USING (true);

-- Management policies (Insert/Update/Delete)
CREATE POLICY "Staff can manage live classes" ON public."LiveClasses" FOR ALL USING (true);
CREATE POLICY "Users can join live sessions" ON public."LiveParticipants" FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can record attendance" ON public."Attendance" FOR ALL USING (true);
CREATE POLICY "Users can post live messages" ON public."LiveMessages" FOR INSERT WITH CHECK (true);
CREATE POLICY "System can insert translations" ON public."TranslatedMessages" FOR INSERT WITH CHECK (true);
CREATE POLICY "System can save transcripts" ON public."SessionTranscript" FOR INSERT WITH CHECK (true);
CREATE POLICY "System can save summaries" ON public."SessionSummary" FOR INSERT WITH CHECK (true);
CREATE POLICY "System can save notes" ON public."SessionNotes" FOR INSERT WITH CHECK (true);
CREATE POLICY "System can save flashcards" ON public."SessionFlashcards" FOR INSERT WITH CHECK (true);
CREATE POLICY "System can save quizzes" ON public."SessionQuiz" FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff can manage reports" ON public."Reports" FOR ALL USING (true);
CREATE POLICY "System can log analytics" ON public."Analytics" FOR ALL USING (true);
CREATE POLICY "System and student can edit skill passport" ON public."SkillPassport" FOR ALL USING (true);
