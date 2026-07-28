from datetime import datetime
from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field
from app.models.models import UserRoleEnum

# Profiles
class ProfileBase(BaseModel):
    full_name: str
    preferred_language: str = "English"

class ProfileRead(ProfileBase):
    id: Any
    role: UserRoleEnum
    created_at: datetime
    
    class Config:
        from_attributes = True

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    preferred_language: Optional[str] = None

# Courses
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    language: str = "English"

class CourseCreate(CourseBase):
    pass

class CourseRead(CourseBase):
    id: Any
    educator_id: Optional[Any] = None
    is_published: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Lessons
class LessonCreate(BaseModel):
    title: str
    content_text: Optional[str] = None
    order_index: int
    video_url: Optional[str] = None
    duration_seconds: int = 0

class LessonRead(LessonCreate):
    id: Any
    course_id: Any
    created_at: datetime

    class Config:
        from_attributes = True

# Live Sessions
class LiveSessionCreate(BaseModel):
    course_id: Any
    title: str
    description: Optional[str] = None
    scheduled_at: datetime

class LiveSessionRead(BaseModel):
    id: Any
    course_id: Any
    educator_id: Optional[Any] = None
    title: str
    description: Optional[str] = None
    scheduled_at: datetime
    status: str
    webrtc_room_id: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Live Session Attendance
class AttendanceRecord(BaseModel):
    student_id: Any
    joined_at: datetime
    left_at: Optional[datetime] = None
    preferred_language_during_session: str

# Translations & Subtitles
class TranslationRequest(BaseModel):
    text: str
    source_lang: str
    target_lang: str

class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    source_lang: str
    target_lang: str

class SubtitleCue(BaseModel):
    index: int
    start_time: str
    end_time: str
    text: str

# AI Quiz & Flashcards
class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_index: int

class QuizCreate(BaseModel):
    lesson_id: Any
    title: str
    questions: List[QuizQuestion]

class QuizRead(BaseModel):
    id: Any
    lesson_id: Any
    title: str
    questions: List[QuizQuestion]
    created_at: datetime

    class Config:
        from_attributes = True

class FlashcardItem(BaseModel):
    front: str
    back: str

class FlashcardDeckCreate(BaseModel):
    lesson_id: Any
    deck_name: str
    cards: List[FlashcardItem]

class FlashcardDeckRead(BaseModel):
    id: Any
    lesson_id: Any
    deck_name: str
    cards: List[FlashcardItem]
    created_at: datetime

    class Config:
        from_attributes = True

# Study Notes
class NoteCreate(BaseModel):
    lesson_id: Any
    title: str
    content: str
    is_ai_generated: bool = False

class NoteRead(NoteCreate):
    id: Any
    student_id: Any
    created_at: datetime

    class Config:
        from_attributes = True

# AI Tutor Queries
class ChatMessage(BaseModel):
    role: str # user, assistant
    content: str

class ChatSessionRequest(BaseModel):
    session_id: Optional[str] = "session-default"
    message: str
    language: Optional[str] = "English"
    history: Optional[List[Dict[str, Any]]] = None

class ChatSessionResponse(BaseModel):
    session_id: str
    reply: str
    suggested_quizzes: Optional[List[QuizQuestion]] = None
    suggested_learning_paths: Optional[List[str]] = None

# AI Universal Search
class SearchRequest(BaseModel):
    query: str
    language: str = "English"

class SearchResultItem(BaseModel):
    id: str
    type: str # 'video', 'pdf', 'notes', 'flashcard', 'live_session'
    title: str
    description: Optional[str] = None
    relevance_score: float
    url: Optional[str] = None

# Authentication DTOs
class UserLogin(BaseModel):
    email: str
    password: str

class UserSignUp(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "student"
    phone_number: Optional[str] = None

class OTPRequest(BaseModel):
    email: Optional[str] = None
    phone_number: Optional[str] = None
    role: Optional[str] = "student"

class OTPVerify(BaseModel):
    email: Optional[str] = None
    phone_number: Optional[str] = None
    otp: str
    full_name: Optional[str] = "Student User"
    role: Optional[str] = "student"
    details: Optional[Dict[str, Any]] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    refresh_token: str
    role: str
    user_id: Optional[str] = None
    full_name: Optional[str] = None

class RefreshTokenRequest(BaseModel):
    refresh_token: str

# Language Preferences DTOs
class LanguagePreferenceRead(BaseModel):
    user_id: Any
    app_language: str
    classroom_language: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class LanguagePreferenceUpdate(BaseModel):
    app_language: Optional[str] = None
    classroom_language: Optional[str] = None

# Bookmark DTOs
class BookmarkCreate(BaseModel):
    item_type: str  # 'lesson', 'video', 'pdf', 'notes', 'assignment'
    item_id: Any

class BookmarkRead(BaseModel):
    id: Any
    student_id: Any
    item_type: str
    item_id: Any
    created_at: datetime

    class Config:
        from_attributes = True

# Download DTOs
class DownloadCreate(BaseModel):
    item_type: str
    item_id: Any

# Learning Progress DTOs
class LearningProgressUpdate(BaseModel):
    completed: bool
    quiz_score: Optional[float] = None

class LearningProgressRead(BaseModel):
    id: Any
    student_id: Any
    lesson_id: Any
    completed: bool
    quiz_score: Optional[float] = None
    last_accessed_at: datetime

    class Config:
        from_attributes = True

# Certificate DTOs
class CertificateRead(BaseModel):
    id: Any
    student_id: Any
    course_id: Any
    issue_date: datetime
    certificate_url: str

    class Config:
        from_attributes = True

# Notification DTOs
class NotificationRead(BaseModel):
    id: Any
    user_id: Any
    title: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationCreate(BaseModel):
    user_id: Any
    title: str
    message: str

# Educator DTOs
class EducatorRead(BaseModel):
    id: Any
    full_name: str
    bio: Optional[str] = None
    specialization: Optional[str] = None
    approved: bool
    approved_by: Optional[Any] = None
    approved_at: Optional[datetime] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class EducatorUpdate(BaseModel):
    approved: Optional[bool] = None
    status: Optional[str] = None
    specialization: Optional[str] = None
    bio: Optional[str] = None

# Analytics and Reports DTOs
class CourseAnalytics(BaseModel):
    course_id: Any
    title: str
    enrollments_count: int
    completions_count: int
    average_quiz_score: Optional[float] = None

class StudentAnalytics(BaseModel):
    student_id: Any
    full_name: str
    enrolled_courses_count: int
    completed_lessons_count: int
    average_quiz_score: Optional[float] = None

class PlatformReport(BaseModel):
    total_students: int
    total_educators: int
    total_courses: int
    total_live_sessions: int
    overall_completion_rate: float

class SystemSettingsRead(BaseModel):
    settings: Dict[str, Any]

class SystemSettingsUpdate(BaseModel):
    settings: Dict[str, Any]


# ==========================================
# 25. AI PERSONAL MENTOR
# ==========================================

class LearningGoalUpdate(BaseModel):
    today_goal_text: Optional[str] = None
    weekly_goal_text: Optional[str] = None
    today_progress: Optional[float] = None
    weekly_progress: Optional[float] = None

class MentorDashboardResponse(BaseModel):
    learning_progress: float
    today_goal: Dict[str, Any]
    weekly_goal: Dict[str, Any]
    skill_growth: List[Dict[str, Any]]
    learning_streak: int
    recommended_lessons: List[Dict[str, Any]]
    recommended_revisions: List[Dict[str, Any]]
    ai_suggestions: Dict[str, Any]
    upcoming_live_sessions: List[Dict[str, Any]]
    recently_weak_topics: List[Dict[str, Any]]
    recently_improved_topics: List[Dict[str, Any]]
    motivational_messages: List[str]
    badges: List[Dict[str, Any]]

class PersonalizedAssignmentRequest(BaseModel):
    lesson_id: str
    topic_name: str

class PersonalizedAssignmentResponse(BaseModel):
    title: str
    description: str
    questions: List[Dict[str, Any]]


# ==========================================
# 26. EDUCATIONAL VIDEO ANALYSIS
# ==========================================

class VideoAnalysisRequest(BaseModel):
    url: str

class VideoAnalysisResponse(BaseModel):
    id: Any
    video_url: str
    title: str
    description: Optional[str] = None
    duration: Optional[str] = None
    spoken_language: str
    transcript: Optional[str] = None
    subtitles: List[Dict[str, Any]]
    summary: str
    notes: str
    flashcards: List[Dict[str, Any]]
    quiz: List[Dict[str, Any]]
    interview_questions: List[Dict[str, Any]]
    learning_objectives: List[str]
    key_concepts: List[str]
    estimated_difficulty: str
    revision_notes: str
    created_at: datetime

    class Config:
        from_attributes = True

class VideoChatRequest(BaseModel):
    video_id: str
    question: str
    language: str = "English"

class VideoChatResponse(BaseModel):
    reply: str


# ==========================================
# 28. LIVE CLASSROOM AND ANALYTICS SCHEMAS (Step 10 & 11)
# ==========================================

class LiveClassCreate(BaseModel):
    course_id: Any
    title: str
    description: Optional[str] = None
    scheduled_at: datetime

class LiveClassRead(BaseModel):
    id: Any
    course_id: Any
    educator_id: Optional[Any] = None
    title: str
    description: Optional[str] = None
    scheduled_at: datetime
    status: str
    webrtc_room_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class LiveParticipantRead(BaseModel):
    id: Any
    session_id: Any
    user_id: Any
    role: str
    joined_at: datetime
    left_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class LiveAttendanceRead(BaseModel):
    id: Any
    session_id: Any
    student_id: Any
    joined_at: datetime
    left_at: Optional[datetime] = None
    watch_time_seconds: int
    language_preference: str
    engagement_score: float

    class Config:
        from_attributes = True

class LiveMessageRead(BaseModel):
    id: Any
    session_id: Any
    sender_id: Optional[Any] = None
    sender_name: str
    message: str
    language: str
    created_at: datetime

    class Config:
        from_attributes = True

class SessionTranscriptRead(BaseModel):
    id: Any
    session_id: Any
    transcript: str
    original_lang: str
    created_at: datetime

    class Config:
        from_attributes = True

class SessionSummaryRead(BaseModel):
    id: Any
    session_id: Any
    summary: str
    created_at: datetime

    class Config:
        from_attributes = True

class SessionNotesRead(BaseModel):
    id: Any
    session_id: Any
    notes: str
    created_at: datetime

    class Config:
        from_attributes = True

class SessionFlashcardsRead(BaseModel):
    id: Any
    session_id: Any
    cards: List[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True

class SessionQuizRead(BaseModel):
    id: Any
    session_id: Any
    questions: List[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True

class ReportCreate(BaseModel):
    report_type: str
    content: Dict[str, Any]

class ReportRead(BaseModel):
    id: Any
    report_type: str
    generated_by: Optional[Any] = None
    content: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

class AdvancedAnalyticsRead(BaseModel):
    id: Any
    metric_type: str
    metric_value: float
    recorded_at: datetime
    metric_metadata: Dict[str, Any] = {}

    class Config:
        from_attributes = True

class SkillPassportRead(BaseModel):
    id: Any
    student_id: Any
    completed_courses: List[str]
    completed_lessons: List[str]
    quiz_scores: List[Dict[str, Any]]
    certificates: List[Dict[str, Any]]
    skills_learned: List[str]
    projects_completed: List[str]
    competency_summary: Optional[str] = None
    skill_growth_timeline: List[Dict[str, Any]]
    recommended_skills: List[str]
    career_recommendation: Optional[str] = None
    progress_timeline: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# 29. AI TUTOR MULTILINGUAL & PRACTICE SCHEMAS
# ==========================================

class AITutorPracticeRequest(BaseModel):
    topic: str = "General Vocational Safety"
    language: str = "English"
    difficulty: str = "Medium"

class AITutorPracticeResponse(BaseModel):
    topic: str
    language: str
    difficulty: str
    question: str
    options: List[str]
    correct_index: int
    explanation: str
    emotional_pep_talk: str

class AITutorResourceRead(BaseModel):
    id: str
    category: str
    title: str
    topics: List[str]
    supported_languages_count: int
    languages: List[str]





