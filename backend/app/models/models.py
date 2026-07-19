import enum
from sqlalchemy import (
    Column, String, ForeignKey, Integer, Boolean, DateTime, Numeric,
    JSON, Text, UniqueConstraint
)
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.sql import func
from app.core.database import Base


# ==========================================
# ENUMS
# ==========================================

class UserRoleEnum(str, enum.Enum):
    student = "student"
    educator = "educator"
    admin = "admin"


# ==========================================
# 1. ROLES TABLE
# ==========================================

class Role(Base):
    __tablename__ = "roles"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    name = Column(String(50), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user_roles = relationship("UserRole", back_populates="role")


# ==========================================
# 2. PROFILES TABLE (Users)
# ==========================================

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(UUID(as_uuid=True), primary_key=True)
    full_name = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user_roles = relationship("UserRole", back_populates="user")
    language_preference = relationship("LanguagePreference", back_populates="user", uselist=False)
    educator_profile = relationship("Educator", back_populates="user", uselist=False, foreign_keys="[Educator.id]")
    student_profile = relationship("Student", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user")


# ==========================================
# 3. USER ROLES (RBAC Junction)
# ==========================================

class UserRole(Base):
    __tablename__ = "user_roles"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    role_id = Column(UUID(as_uuid=True), ForeignKey("roles.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (UniqueConstraint("user_id", "role_id"),)

    user = relationship("Profile", back_populates="user_roles")
    role = relationship("Role", back_populates="user_roles")


# ==========================================
# 4. LANGUAGE PREFERENCES
# ==========================================

class LanguagePreference(Base):
    __tablename__ = "language_preferences"

    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    app_language = Column(String(50), default="English", nullable=False)
    classroom_language = Column(String(50), default="English", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("Profile", back_populates="language_preference")


# ==========================================
# 5. EDUCATORS
# ==========================================

class Educator(Base):
    __tablename__ = "educators"

    id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    bio = Column(Text)
    specialization = Column(String(150))
    email = Column(String(255))
    password = Column(String(255))
    approved = Column(Boolean, default=False, nullable=False)
    approved_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"))
    approved_at = Column(DateTime(timezone=True))
    status = Column(String(50), default="pending", nullable=False)  # pending, active, suspended
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("Profile", back_populates="educator_profile", foreign_keys=[id])
    courses = relationship("Course", back_populates="educator")
    live_sessions = relationship("LiveSession", back_populates="educator")


# ==========================================
# 6. STUDENTS
# ==========================================

class Student(Base):
    __tablename__ = "students"

    id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    enrollment_number = Column(String(100), unique=True)
    details = Column(JSON, default={}, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    user = relationship("Profile", back_populates="student_profile")
    notes = relationship("Note", back_populates="student")
    bookmarks = relationship("Bookmark", back_populates="student")
    certificates = relationship("Certificate", back_populates="student")
    attendance = relationship("Attendance", back_populates="student")
    learning_progress = relationship("LearningProgress", back_populates="student")


# ==========================================
# 7. COURSES
# ==========================================

class Course(Base):
    __tablename__ = "courses"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    title = Column(String(255), nullable=False)
    description = Column(Text)
    educator_id = Column(UUID(as_uuid=True), ForeignKey("educators.id", ondelete="SET NULL"))
    category = Column(String(100), nullable=False)
    language = Column(String(50), default="English", nullable=False)
    is_published = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    educator = relationship("Educator", back_populates="courses")
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan")
    live_sessions = relationship("LiveSession", back_populates="course", cascade="all, delete-orphan")
    certificates = relationship("Certificate", back_populates="course")


# ==========================================
# 8. LESSONS
# ==========================================

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content_text = Column(Text)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    course = relationship("Course", back_populates="lessons")
    videos = relationship("Video", back_populates="lesson", cascade="all, delete-orphan")
    pdfs = relationship("Pdf", back_populates="lesson", cascade="all, delete-orphan")
    ppts = relationship("Ppt", back_populates="lesson", cascade="all, delete-orphan")
    assignments = relationship("Assignment", back_populates="lesson", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="lesson", cascade="all, delete-orphan")
    flashcards = relationship("Flashcard", back_populates="lesson", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="lesson", cascade="all, delete-orphan")


# ==========================================
# 9. VIDEOS
# ==========================================

class Video(Base):
    __tablename__ = "videos"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    original_language = Column(String(50), nullable=False)
    file_path = Column(Text, nullable=False)
    duration_seconds = Column(Integer, default=0, nullable=False)
    status = Column(String(50), default="processing", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    lesson = relationship("Lesson", back_populates="videos")


# ==========================================
# 10. PDFs
# ==========================================

class Pdf(Base):
    __tablename__ = "pdfs"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    file_path = Column(Text, nullable=False)
    status = Column(String(50), default="processing", nullable=False)
    parsed_text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    lesson = relationship("Lesson", back_populates="pdfs")


# ==========================================
# 11. PPTs
# ==========================================

class Ppt(Base):
    __tablename__ = "ppts"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    file_path = Column(Text, nullable=False)
    status = Column(String(50), default="processing", nullable=False)
    parsed_text = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    lesson = relationship("Lesson", back_populates="ppts")


# ==========================================
# 12. ASSIGNMENTS
# ==========================================

class Assignment(Base):
    __tablename__ = "assignments"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    max_score = Column(Numeric(5, 2), default=100.00, nullable=False)
    due_date = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    lesson = relationship("Lesson", back_populates="assignments")


# ==========================================
# 13. QUIZZES
# ==========================================

class Quiz(Base):
    __tablename__ = "quizzes"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    questions = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    lesson = relationship("Lesson", back_populates="quizzes")


# ==========================================
# 14. NOTES
# ==========================================

class Note(Base):
    __tablename__ = "notes"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    content = Column(Text)
    is_ai_generated = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    lesson = relationship("Lesson", back_populates="notes")
    student = relationship("Student", back_populates="notes")


# ==========================================
# 15. FLASHCARDS
# ==========================================

class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    deck_name = Column(String(150))
    cards = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    lesson = relationship("Lesson", back_populates="flashcards")


# ==========================================
# 16. BOOKMARKS
# ==========================================

class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    item_type = Column(String(50), nullable=False)  # lesson, video, pdf, notes, assignment
    item_id = Column(UUID(as_uuid=True), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (UniqueConstraint("student_id", "item_type", "item_id"),)

    student = relationship("Student", back_populates="bookmarks")


# ==========================================
# 17. CERTIFICATES
# ==========================================

class Certificate(Base):
    __tablename__ = "certificates"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    issue_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    certificate_url = Column(Text, nullable=False)

    student = relationship("Student", back_populates="certificates")
    course = relationship("Course", back_populates="certificates")


# ==========================================
# 18. NOTIFICATIONS
# ==========================================

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user = relationship("Profile", back_populates="notifications")


# ==========================================
# 19. LIVE SESSIONS
# ==========================================

class LiveSession(Base):
    __tablename__ = "live_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    educator_id = Column(UUID(as_uuid=True), ForeignKey("educators.id", ondelete="SET NULL"))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(50), default="scheduled", nullable=False)
    webrtc_room_id = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    course = relationship("Course", back_populates="live_sessions")
    educator = relationship("Educator", back_populates="live_sessions")
    attendance = relationship("Attendance", back_populates="session", cascade="all, delete-orphan")


# ==========================================
# 20. ATTENDANCE
# ==========================================

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    session_id = Column(UUID(as_uuid=True), ForeignKey("live_sessions.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    left_at = Column(DateTime(timezone=True))

    __table_args__ = (UniqueConstraint("session_id", "student_id"),)

    session = relationship("LiveSession", back_populates="attendance")
    student = relationship("Student", back_populates="attendance")


# ==========================================
# 21. AI CHAT HISTORY
# ==========================================

class AIChatHistory(Base):
    __tablename__ = "ai_chat_history"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    session_id = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False)  # user, assistant
    message = Column(Text, nullable=False)
    language = Column(String(50), default="English", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# ==========================================
# 22. TRANSLATION HISTORY
# ==========================================

class TranslationHistory(Base):
    __tablename__ = "translation_history"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    source_text = Column(Text, nullable=False)
    translated_text = Column(Text, nullable=False)
    source_language = Column(String(50), nullable=False)
    target_language = Column(String(50), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# ==========================================
# 23. LEARNING PROGRESS
# ==========================================

class LearningProgress(Base):
    __tablename__ = "learning_progress"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    lesson_id = Column(UUID(as_uuid=True), ForeignKey("lessons.id", ondelete="CASCADE"), nullable=False)
    completed = Column(Boolean, default=False, nullable=False)
    quiz_score = Column(Numeric(5, 2))
    last_accessed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (UniqueConstraint("student_id", "lesson_id"),)

    student = relationship("Student", back_populates="learning_progress")


# ==========================================
# 24. ANALYTICS
# ==========================================

class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    event_type = Column(String(100), nullable=False)  # login, play_video, solve_quiz, chat_query
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"))
    page_url = Column(Text)
    event_metadata = Column(JSON, default={}, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# ==========================================
# 25. EDUCATIONAL VIDEO ANALYSIS CACHE
# ==========================================

class AnalyzedVideo(Base):
    __tablename__ = "analyzed_videos"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    video_url = Column(String(500), unique=True, index=True, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    duration = Column(String(50))
    spoken_language = Column(String(50), default="English")
    transcript = Column(Text)
    subtitles = Column(JSON)  # [{ "index": int, "start": str, "end": str, "text": str }]
    summary = Column(Text)
    notes = Column(Text)
    flashcards = Column(JSON)  # [{ "front": str, "back": str }]
    quiz = Column(JSON)  # [{ "question": str, "options": [], "correct_index": int }]
    interview_questions = Column(JSON)  # [{ "question": str, "answer": str }]
    learning_objectives = Column(JSON)  # [str]
    key_concepts = Column(JSON)  # [str]
    estimated_difficulty = Column(String(50))
    revision_notes = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# ==========================================
# 26. LIVE CLASSES & PARTICIPANTS (Step 10)
# ==========================================

class LiveClass(Base):
    __tablename__ = "LiveClasses"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    course_id = Column(UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False)
    educator_id = Column(UUID(as_uuid=True), ForeignKey("educators.id", ondelete="SET NULL"))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    status = Column(String(50), default="scheduled", nullable=False)  # scheduled, live, paused, completed, cancelled
    webrtc_room_id = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    course = relationship("Course")
    educator = relationship("Educator")


class LiveParticipant(Base):
    __tablename__ = "LiveParticipants"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    session_id = Column(UUID(as_uuid=True), ForeignKey("LiveClasses.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    role = Column(String(50), nullable=False)  # educator, student
    joined_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    left_at = Column(DateTime(timezone=True))


class LiveAttendance(Base):
    __tablename__ = "Attendance"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    session_id = Column(UUID(as_uuid=True), ForeignKey("LiveClasses.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    joined_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    left_at = Column(DateTime(timezone=True))
    watch_time_seconds = Column(Integer, default=0, nullable=False)
    language_preference = Column(String(50), default="English", nullable=False)
    engagement_score = Column(Numeric(5, 2), default=0.00, nullable=False)


class LiveMessage(Base):
    __tablename__ = "LiveMessages"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    session_id = Column(UUID(as_uuid=True), ForeignKey("LiveClasses.id", ondelete="CASCADE"), nullable=False)
    sender_id = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"))
    sender_name = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    language = Column(String(50), default="English", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class TranslatedMessage(Base):
    __tablename__ = "TranslatedMessages"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    message_id = Column(UUID(as_uuid=True), ForeignKey("LiveMessages.id", ondelete="CASCADE"), nullable=False)
    target_lang = Column(String(50), nullable=False)
    translated_text = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class SessionTranscript(Base):
    __tablename__ = "SessionTranscript"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    session_id = Column(UUID(as_uuid=True), ForeignKey("LiveClasses.id", ondelete="CASCADE"), nullable=False)
    transcript = Column(Text, nullable=False)
    original_lang = Column(String(50), default="English", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class SessionSummary(Base):
    __tablename__ = "SessionSummary"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    session_id = Column(UUID(as_uuid=True), ForeignKey("LiveClasses.id", ondelete="CASCADE"), nullable=False)
    summary = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class SessionNotes(Base):
    __tablename__ = "SessionNotes"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    session_id = Column(UUID(as_uuid=True), ForeignKey("LiveClasses.id", ondelete="CASCADE"), nullable=False)
    notes = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class SessionFlashcards(Base):
    __tablename__ = "SessionFlashcards"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    session_id = Column(UUID(as_uuid=True), ForeignKey("LiveClasses.id", ondelete="CASCADE"), nullable=False)
    cards = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class SessionQuiz(Base):
    __tablename__ = "SessionQuiz"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    session_id = Column(UUID(as_uuid=True), ForeignKey("LiveClasses.id", ondelete="CASCADE"), nullable=False)
    questions = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


# ==========================================
# 27. REPORTS, ADVANCED ANALYTICS, SKILL PASSPORT (Step 11)
# ==========================================

class Report(Base):
    __tablename__ = "Reports"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    report_type = Column(String(100), nullable=False)
    generated_by = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="SET NULL"))
    content = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AdvancedAnalytics(Base):
    __tablename__ = "Analytics"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    metric_type = Column(String(100), nullable=False)
    metric_value = Column(Numeric(12, 2), nullable=False)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    metric_metadata = Column("metadata", JSON, default={}, nullable=False)


class SkillPassport(Base):
    __tablename__ = "SkillPassport"

    id = Column(UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid())
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), unique=True, nullable=False)
    completed_courses = Column(JSON, default=[], nullable=False)
    completed_lessons = Column(JSON, default=[], nullable=False)
    quiz_scores = Column(JSON, default=[], nullable=False)
    certificates = Column(JSON, default=[], nullable=False)
    skills_learned = Column(JSON, default=[], nullable=False)
    projects_completed = Column(JSON, default=[], nullable=False)
    competency_summary = Column(Text)
    skill_growth_timeline = Column(JSON, default=[], nullable=False)
    recommended_skills = Column(JSON, default=[], nullable=False)
    career_recommendation = Column(Text)
    progress_timeline = Column(JSON, default=[], nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    student = relationship("Student")


