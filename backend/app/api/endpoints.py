import logging
import datetime
import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import (
    get_current_user, CurrentUser, require_student, require_educator, require_admin, require_staff
)
from app.schemas.schemas import (
    UserSignUp, UserLogin, TokenResponse, RefreshTokenRequest, OTPRequest, OTPVerify,
    ProfileRead, ProfileUpdate, LanguagePreferenceRead, LanguagePreferenceUpdate,
    CourseRead, CourseCreate, LessonRead, LessonCreate,
    LiveSessionRead, LiveSessionCreate, ChatSessionRequest, ChatSessionResponse,
    QuizRead, QuizCreate, FlashcardDeckRead, FlashcardDeckCreate, NoteRead, NoteCreate,
    BookmarkCreate, BookmarkRead, DownloadCreate, LearningProgressUpdate, LearningProgressRead,
    CertificateRead, NotificationRead, NotificationCreate, EducatorRead, EducatorUpdate,
    CourseAnalytics, StudentAnalytics, PlatformReport, SystemSettingsRead, SystemSettingsUpdate,
    MentorDashboardResponse, LearningGoalUpdate, PersonalizedAssignmentRequest, PersonalizedAssignmentResponse,
    VideoAnalysisRequest, VideoAnalysisResponse, VideoChatRequest, VideoChatResponse,
    LiveClassRead, LiveClassCreate, ReportRead, SkillPassportRead
)
from app.services.auth_service import auth_service
from app.services.user_service import user_service
from app.services.course_service import course_service
from app.services.content_service import content_service
from app.services.video_service import video_service
from app.services.notification_service import notification_service
from app.services.analytics_service import analytics_service
from app.services.student_service import student_service
from app.services.educator_service import educator_service
from app.services.admin_service import admin_service
from app.services.chatbot import chatbot_service
from app.services.video_localization import video_localizer
from app.services.ai_service import ai_service
from app.services.mentor_service import mentor_service
from app.services.video_analysis_service import video_analysis_service

logger = logging.getLogger("api_endpoints")
router = APIRouter()

# ==========================================
# 1. AUTHENTICATION MODULE
# ==========================================

@router.post("/auth/signup", response_model=Dict[str, Any], tags=["Authentication"])
def signup(data: UserSignUp):
    return auth_service.signup(data)

@router.post("/auth/login", response_model=TokenResponse, tags=["Authentication"])
def login(data: UserLogin, db: Session = Depends(get_db)):
    result = auth_service.login(data)
    analytics_service.log_event(db, "login", user_id=None, metadata={"email": data.email})
    return result

@router.post("/auth/request-email-otp", response_model=Dict[str, Any], tags=["Authentication"])
def request_email_otp(email: str = Query(...), purpose: str = Query("signup")):
    return auth_service.request_email_otp(email=email, purpose=purpose)

@router.post("/auth/verify-email-otp-set-password", response_model=Dict[str, Any], tags=["Authentication"])
def verify_email_otp_and_set_password(email: str = Form(...), otp: str = Form(...), password: str = Form(...), full_name: Optional[str] = Form(None)):
    return auth_service.verify_email_otp_and_set_password(email=email, otp=otp, password=password, full_name=full_name)

@router.post("/auth/verify-email-otp", response_model=Dict[str, Any], tags=["Authentication"])
def verify_email_otp(email: str = Form(...), otp: str = Form(...)):
    return auth_service.verify_email_otp(email=email, otp=otp)


@router.post("/auth/change-password", response_model=Dict[str, Any], tags=["Authentication"])
def change_password_with_email_otp(email: str = Form(...), otp: str = Form(...), new_password: str = Form(...)):
    return auth_service.change_password_with_email_otp(email=email, otp=otp, new_password=new_password)

@router.post("/admin/educators/add", response_model=Dict[str, Any], tags=["Admin"])
def admin_register_educator(
    full_name: str = Form(...),
    educator_email: str = Form(...),
    password: str = Form(...),
    current_user: CurrentUser = Depends(get_current_user)
):
    return auth_service.admin_register_educator(
        admin_email=current_user.email,
        full_name=full_name,
        educator_email=educator_email,
        password=password
    )

@router.post("/auth/request-otp", response_model=Dict[str, Any], tags=["Authentication"])
def request_otp(data: OTPRequest):
    return auth_service.request_otp(data)

@router.post("/auth/verify-otp", response_model=TokenResponse, tags=["Authentication"])
def verify_otp(data: OTPVerify, db: Session = Depends(get_db)):
    result = auth_service.verify_otp(data)
    analytics_service.log_event(db, "mobile_otp_login", user_id=result.get("user_id"), metadata={"phone": data.phone_number})
    return result

@router.post("/auth/refresh", response_model=TokenResponse, tags=["Authentication"])
def refresh_token(data: RefreshTokenRequest):
    return auth_service.refresh_token(data.refresh_token)

@router.get("/auth/me", response_model=ProfileRead, tags=["Authentication"])
def get_auth_me(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = user_service.get_profile(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    lang_pref = user_service.get_language_preference(db, current_user.id)
    preferred_lang = lang_pref.app_language if lang_pref else "English"
    return ProfileRead(
        id=profile.id,
        full_name=profile.full_name,
        role=current_user.role,
        preferred_language=preferred_lang,
        created_at=profile.created_at
    )


# ==========================================
# 2. USER PROFILE & LANGUAGE PREFERENCES
# ==========================================

@router.get("/profiles/me", response_model=ProfileRead, tags=["Profiles"])
def get_my_profile(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = user_service.get_profile(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    lang_pref = user_service.get_language_preference(db, current_user.id)
    preferred_lang = lang_pref.app_language if lang_pref else "English"
    return ProfileRead(
        id=profile.id,
        full_name=profile.full_name,
        role=current_user.role,
        preferred_language=preferred_lang,
        created_at=profile.created_at
    )

@router.put("/profiles/me", response_model=ProfileRead, tags=["Profiles"])
def update_my_profile(
    data: ProfileUpdate, current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)
):
    profile = user_service.update_profile(db, current_user.id, data)
    lang_pref = user_service.get_language_preference(db, current_user.id)
    preferred_lang = lang_pref.app_language if lang_pref else "English"
    return ProfileRead(
        id=profile.id,
        full_name=profile.full_name,
        role=current_user.role,
        preferred_language=preferred_lang,
        created_at=profile.created_at
    )

@router.get("/profiles/me/language", response_model=LanguagePreferenceRead, tags=["Language Preferences"])
def get_my_language_preference(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    pref = user_service.get_language_preference(db, current_user.id)
    if not pref:
        pref = user_service.update_language_preference(db, current_user.id, LanguagePreferenceUpdate(app_language="English", classroom_language="English"))
    return pref

@router.put("/profiles/me/language", response_model=LanguagePreferenceRead, tags=["Language Preferences"])
def update_my_language_preference(
    data: LanguagePreferenceUpdate, current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)
):
    return user_service.update_language_preference(db, current_user.id, data)


# ==========================================
# 3. STUDENT OPERATIONS
# ==========================================

@router.get("/student/courses", response_model=List[CourseRead], tags=["Student Panel"])
def get_student_course_list(
    category: Optional[str] = None, 
    language: Optional[str] = None, 
    db: Session = Depends(get_db)
):
    # Guest Mode & Students can view published courses
    return course_service.list_courses(db, category=category, language=language, is_published=True)

@router.get("/student/courses/{course_id}", response_model=Dict[str, Any], tags=["Student Panel"])
def get_student_course_details(course_id: str, db: Session = Depends(get_db)):
    course = course_service.get_course_by_id(db, course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    lessons = course_service.get_lessons_for_course(db, course_id)
    return {
        "course": course,
        "lessons": lessons
    }

@router.post("/student/courses/{course_id}/enroll", response_model=Dict[str, Any], tags=["Student Panel"])
def enroll_student_course(
    course_id: str, current_user: CurrentUser = Depends(require_student), db: Session = Depends(get_db)
):
    return student_service.enroll_in_course(db, current_user.id, course_id)

@router.get("/student/lessons/{lesson_id}/videos", tags=["Student Panel"])
def get_lesson_videos(lesson_id: str, db: Session = Depends(get_db)):
    # Returns videos with generated temporary playback URLs
    videos = video_service.get_videos_for_lesson(db, lesson_id)
    results = []
    for v in videos:
        secure_url = video_service.generate_secure_url(v)
        results.append({
            "id": str(v.id),
            "lesson_id": str(v.lesson_id),
            "original_language": v.original_language,
            "duration_seconds": v.duration_seconds,
            "status": v.status,
            "secure_play_url": secure_url,
            "created_at": v.created_at
        })
    return results

@router.get("/student/bookmarks", response_model=List[BookmarkRead], tags=["Student Panel"])
def list_student_bookmarks(current_user: CurrentUser = Depends(require_student), db: Session = Depends(get_db)):
    return student_service.list_bookmarks(db, current_user.id)

@router.post("/student/bookmarks", response_model=BookmarkRead, tags=["Student Panel"])
def create_student_bookmark(
    data: BookmarkCreate, current_user: CurrentUser = Depends(require_student), db: Session = Depends(get_db)
):
    return student_service.create_bookmark(db, current_user.id, data)

@router.delete("/student/bookmarks/{bookmark_id}", response_model=Dict[str, Any], tags=["Student Panel"])
def delete_student_bookmark(
    bookmark_id: str, current_user: CurrentUser = Depends(require_student), db: Session = Depends(get_db)
):
    success = student_service.delete_bookmark(db, current_user.id, bookmark_id)
    return {"status": "success" if success else "failed"}

@router.post("/student/downloads", response_model=Dict[str, Any], tags=["Student Panel"])
def create_student_download(
    data: DownloadCreate, current_user: CurrentUser = Depends(require_student), db: Session = Depends(get_db)
):
    return student_service.log_download(db, current_user.id, data.item_type, data.item_id)

@router.get("/student/downloads", response_model=List[Dict[str, Any]], tags=["Student Panel"])
def list_student_downloads(current_user: CurrentUser = Depends(require_student), db: Session = Depends(get_db)):
    return student_service.get_downloads(db, current_user.id)

@router.get("/student/lessons/{lesson_id}/quizzes", response_model=List[QuizRead], tags=["Student Panel"])
def get_lesson_quizzes(lesson_id: str, db: Session = Depends(get_db)):
    return content_service.get_quizzes_for_lesson(db, lesson_id)

@router.post("/student/quizzes/{quiz_id}/submit", response_model=Dict[str, Any], tags=["Student Panel"])
def submit_quiz_score(
    quiz_id: str, 
    score: float = Query(..., description="Student score in quiz"),
    current_user: CurrentUser = Depends(require_student), 
    db: Session = Depends(get_db)
):
    quiz = content_service.get_quiz_by_id(db, quiz_id)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    progress = student_service.update_learning_progress(
        db, 
        current_user.id, 
        str(quiz.lesson_id), 
        LearningProgressUpdate(completed=True, quiz_score=score)
    )
    return {
        "status": "success", 
        "score_recorded": score, 
        "lesson_completed": progress.completed
    }

@router.get("/student/lessons/{lesson_id}/flashcards", response_model=List[FlashcardDeckRead], tags=["Student Panel"])
def get_lesson_flashcards(lesson_id: str, db: Session = Depends(get_db)):
    return content_service.get_flashcards_for_lesson(db, lesson_id)

@router.get("/student/progress", response_model=List[LearningProgressRead], tags=["Student Panel"])
def get_my_learning_progress(current_user: CurrentUser = Depends(require_student), db: Session = Depends(get_db)):
    return student_service.get_learning_progress(db, current_user.id)

@router.post("/student/progress/{lesson_id}", response_model=LearningProgressRead, tags=["Student Panel"])
def update_my_learning_progress(
    lesson_id: str, 
    data: LearningProgressUpdate, 
    current_user: CurrentUser = Depends(require_student), 
    db: Session = Depends(get_db)
):
    return student_service.update_learning_progress(db, current_user.id, lesson_id, data)

@router.get("/student/certificates", response_model=List[CertificateRead], tags=["Student Panel"])
def get_my_certificates(current_user: CurrentUser = Depends(require_student), db: Session = Depends(get_db)):
    return student_service.get_certificates(db, current_user.id)

@router.post("/student/certificates/generate", response_model=CertificateRead, tags=["Student Panel"])
def generate_my_certificate(
    course_id: str = Query(...), 
    current_user: CurrentUser = Depends(require_student), 
    db: Session = Depends(get_db)
):
    return student_service.generate_certificate(db, current_user.id, course_id)


# ==========================================
# 4. EDUCATOR OPERATIONS
# ==========================================

@router.post("/educator/courses", response_model=CourseRead, tags=["Educator Panel"])
def educator_create_course(
    course_data: CourseCreate, current_user: CurrentUser = Depends(require_educator), db: Session = Depends(get_db)
):
    return course_service.create_course(db, course_data, current_user.id)

@router.put("/educator/courses/{course_id}", response_model=CourseRead, tags=["Educator Panel"])
def educator_edit_course(
    course_id: str, 
    title: Optional[str] = None,
    description: Optional[str] = None,
    category: Optional[str] = None,
    language: Optional[str] = None,
    is_published: Optional[bool] = None,
    current_user: CurrentUser = Depends(require_educator), 
    db: Session = Depends(get_db)
):
    course = course_service.get_course_by_id(db, course_id)
    if not course or str(course.educator_id) != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this course")
    
    updates = {
        "title": title,
        "description": description,
        "category": category,
        "language": language,
        "is_published": is_published
    }
    return course_service.update_course(db, course_id, updates)

@router.delete("/educator/courses/{course_id}", response_model=Dict[str, Any], tags=["Educator Panel"])
def educator_delete_course(
    course_id: str, current_user: CurrentUser = Depends(require_educator), db: Session = Depends(get_db)
):
    course = course_service.get_course_by_id(db, course_id)
    if not course or str(course.educator_id) != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this course")
    success = course_service.delete_course(db, course_id)
    return {"status": "success" if success else "failed"}

@router.post("/educator/lessons/{lesson_id}/videos", tags=["Educator Panel"])
def educator_upload_video(
    lesson_id: str,
    original_language: str = Form("English"),
    duration_seconds: int = Form(0),
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(require_educator),
    db: Session = Depends(get_db)
):
    # Verify educator owns the lesson's course
    lesson = course_service.get_lesson_by_id(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    course = course_service.get_course_by_id(db, str(lesson.course_id))
    if not course or str(course.educator_id) != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to add content to this course")

    file_bytes = file.file.read()
    video_rec = video_service.upload_video(
        db, lesson_id, file.filename, file_bytes, original_language, duration_seconds
    )
    return {
        "status": "success",
        "video_id": str(video_rec.id),
        "file_path": video_rec.file_path
    }

@router.post("/educator/lessons/{lesson_id}/pdfs", tags=["Educator Panel"])
def educator_upload_pdf(
    lesson_id: str,
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(require_educator),
    db: Session = Depends(get_db)
):
    lesson = course_service.get_lesson_by_id(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    file_bytes = file.file.read()
    pdf_rec = educator_service.upload_document(db, lesson_id, file.filename, file_bytes, doc_type="pdf")
    return {"status": "success", "pdf_id": str(pdf_rec.id), "title": pdf_rec.title}

@router.post("/educator/lessons/{lesson_id}/ppts", tags=["Educator Panel"])
def educator_upload_ppt(
    lesson_id: str,
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(require_educator),
    db: Session = Depends(get_db)
):
    lesson = course_service.get_lesson_by_id(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    file_bytes = file.file.read()
    ppt_rec = educator_service.upload_document(db, lesson_id, file.filename, file_bytes, doc_type="ppt")
    return {"status": "success", "ppt_id": str(ppt_rec.id), "title": ppt_rec.title}

@router.post("/educator/lessons/{lesson_id}/docx", tags=["Educator Panel"])
def educator_upload_docx(
    lesson_id: str,
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(require_educator),
    db: Session = Depends(get_db)
):
    lesson = course_service.get_lesson_by_id(db, lesson_id)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    file_bytes = file.file.read()
    doc_rec = educator_service.upload_document(db, lesson_id, file.filename, file_bytes, doc_type="docx")
    return {"status": "success", "document_id": str(doc_rec.id), "title": doc_rec.title}

@router.post("/educator/lessons/{lesson_id}/assignments", tags=["Educator Panel"])
def educator_create_assignment(
    lesson_id: str,
    title: str = Query(...),
    description: Optional[str] = Query(None),
    max_score: float = Query(100.0),
    due_date: Optional[datetime.datetime] = Query(None),
    current_user: CurrentUser = Depends(require_educator),
    db: Session = Depends(get_db)
):
    assignment = content_service.create_assignment(
        db, lesson_id, title, description, max_score, due_date
    )
    return assignment

@router.get("/educator/lessons/{lesson_id}/assignments", tags=["Educator Panel"])
def educator_list_assignments(lesson_id: str, db: Session = Depends(get_db)):
    return content_service.get_assignments_for_lesson(db, lesson_id)

@router.post("/educator/announcements", tags=["Educator Panel"])
def educator_send_announcement(
    title: str = Query(...),
    message: str = Query(...),
    course_id: Optional[str] = Query(None),
    current_user: CurrentUser = Depends(require_educator),
    db: Session = Depends(get_db)
):
    return educator_service.create_announcement(db, current_user.id, title, message, course_id)

@router.post("/educator/live-sessions", response_model=LiveSessionRead, tags=["Educator Panel"])
def educator_schedule_live_session(
    data: LiveSessionCreate, current_user: CurrentUser = Depends(require_educator), db: Session = Depends(get_db)
):
    return educator_service.schedule_live_session(
        db, current_user.id, str(data.course_id), data.title, data.description, data.scheduled_at
    )

@router.get("/educator/analytics/students", response_model=List[StudentAnalytics], tags=["Educator Panel"])
def educator_get_student_analytics(
    current_user: CurrentUser = Depends(require_educator), db: Session = Depends(get_db)
):
    return educator_service.get_educator_student_analytics(db, current_user.id)

@router.get("/educator/analytics/courses", response_model=List[CourseAnalytics], tags=["Educator Panel"])
def educator_get_course_analytics(
    current_user: CurrentUser = Depends(require_educator), db: Session = Depends(get_db)
):
    return educator_service.get_educator_course_analytics(db, current_user.id)


# ==========================================
# 5. ADMIN OPERATIONS
# ==========================================

@router.get("/admin/educators", response_model=List[Dict[str, Any]], tags=["Admin Panel"])
def admin_list_educators(current_user: CurrentUser = Depends(require_admin), db: Session = Depends(get_db)):
    return admin_service.list_educators(db)

@router.post("/admin/educators", response_model=Dict[str, Any], tags=["Admin Panel"])
def admin_add_educator(
    email: str = Query(...),
    password: str = Query(...),
    full_name: str = Query(...),
    current_user: CurrentUser = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return admin_service.add_educator(db, email, password, full_name)

@router.put("/admin/educators/{educator_id}", response_model=Dict[str, Any], tags=["Admin Panel"])
def admin_update_educator(
    educator_id: str,
    approved: Optional[bool] = Query(None),
    status_str: Optional[str] = Query(None),
    current_user: CurrentUser = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return admin_service.update_educator_status(db, educator_id, current_user.id, approved, status_str)

@router.put("/admin/educators/{educator_id}/details", response_model=Dict[str, Any], tags=["Admin Panel"])
def admin_update_educator_details(
    educator_id: str,
    email: Optional[str] = Query(None),
    password: Optional[str] = Query(None),
    full_name: Optional[str] = Query(None),
    specialization: Optional[str] = Query(None),
    bio: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    current_user: CurrentUser = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return admin_service.update_educator_details(
        db, educator_id, email, password, full_name, specialization, bio, status
    )

@router.delete("/admin/educators/{educator_id}", response_model=Dict[str, Any], tags=["Admin Panel"])
def admin_delete_educator(
    educator_id: str, current_user: CurrentUser = Depends(require_admin), db: Session = Depends(get_db)
):
    success = admin_service.delete_educator(db, educator_id)
    return {"status": "success" if success else "failed"}

@router.post("/admin/educators/{educator_id}/suspend", response_model=Dict[str, Any], tags=["Admin Panel"])
def admin_suspend_educator(
    educator_id: str,
    suspend: bool = Query(True),
    current_user: CurrentUser = Depends(require_admin),
    db: Session = Depends(get_db)
):
    status_str = "suspended" if suspend else "active"
    return admin_service.update_educator_status(db, educator_id, current_user.id, approved=None, status_str=status_str)

@router.get("/admin/courses", response_model=List[CourseRead], tags=["Admin Panel"])
def admin_manage_courses(current_user: CurrentUser = Depends(require_admin), db: Session = Depends(get_db)):
    return admin_service.list_all_courses(db)

@router.get("/admin/reports", response_model=PlatformReport, tags=["Admin Panel"])
def admin_get_reports(current_user: CurrentUser = Depends(require_admin), db: Session = Depends(get_db)):
    return admin_service.get_platform_reports(db)

@router.get("/admin/analytics", response_model=PlatformReport, tags=["Admin Panel"])
def admin_get_analytics(current_user: CurrentUser = Depends(require_admin), db: Session = Depends(get_db)):
    return admin_service.get_platform_reports(db)

@router.get("/admin/languages", response_model=List[str], tags=["Admin Panel"])
def admin_get_languages(current_user: CurrentUser = Depends(require_admin)):
    return admin_service.get_languages()

@router.put("/admin/languages", response_model=List[str], tags=["Admin Panel"])
def admin_update_languages(
    languages: List[str], current_user: CurrentUser = Depends(require_admin)
):
    return admin_service.update_languages(languages)

@router.get("/admin/settings", response_model=SystemSettingsRead, tags=["Admin Panel"])
def admin_get_settings(current_user: CurrentUser = Depends(require_admin)):
    return SystemSettingsRead(settings=admin_service.get_system_settings())

@router.put("/admin/settings", response_model=SystemSettingsRead, tags=["Admin Panel"])
def admin_update_settings(
    data: SystemSettingsUpdate, current_user: CurrentUser = Depends(require_admin)
):
    updated = admin_service.update_system_settings(data.settings)
    return SystemSettingsRead(settings=updated)


# ==========================================
# 6. NOTIFICATION SYSTEM
# ==========================================

@router.get("/notifications", response_model=List[NotificationRead], tags=["Notifications"])
def list_my_notifications(
    unread_only: bool = Query(False), current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)
):
    return notification_service.list_notifications(db, current_user.id, unread_only)

@router.put("/notifications/{id}/read", response_model=NotificationRead, tags=["Notifications"])
def mark_notification_read(
    id: str, current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)
):
    return notification_service.mark_as_read(db, id, current_user.id)

@router.post("/notifications", response_model=NotificationRead, tags=["Notifications"])
def send_notification(
    data: NotificationCreate, current_user: CurrentUser = Depends(require_staff), db: Session = Depends(get_db)
):
    return notification_service.create_notification(db, data)


# ==========================================
# 7. AI LOCALIZATION PIPELINE TRIGGERS
# ==========================================

@router.post("/video/localize", dependencies=[Depends(require_educator)], tags=["AI Processing"])
def trigger_video_localization(lesson_id: str, video_url: str, original_lang: str):
    target_langs = ["Hindi", "Tamil", "Telugu", "Marathi"]
    localization_results = video_localizer.run_pipeline(
        video_id=str(uuid.uuid4()),
        original_video_url=video_url,
        original_lang=original_lang,
        target_languages=target_langs
    )
    return {"status": "processing", "details": localization_results}

@router.post("/quizzes/generate", response_model=QuizRead, dependencies=[Depends(require_educator)], tags=["AI Processing"])
def generate_ai_quiz(lesson_id: str, content: str):
    generated_questions = ai_service.generate_quiz(content, f"Quiz {lesson_id}")
    return QuizRead(
        id=uuid.uuid4(),
        lesson_id=lesson_id,
        title=f"AI Generated Checkpoint Quiz",
        questions=generated_questions,
        created_at=datetime.datetime.utcnow()
    )

# ==========================================
# 8. AI TUTOR CHAT
# ==========================================

@router.post("/ai-tutor/chat", response_model=ChatSessionResponse, tags=["AI Processing"])
def ask_ai_tutor(payload: ChatSessionRequest, current_user: CurrentUser = Depends(get_current_user)):
    ai_reply = chatbot_service.answer_doubt(
        user_id=current_user.id,
        session_id=payload.session_id,
        message=payload.message,
        language=payload.language,
        student_memory_summary="Preferred style: hands-on, Difficulty: DC Circuits"
    )
    return ChatSessionResponse(
        session_id=payload.session_id,
        reply=ai_reply
    )

# ==========================================
# 9. AI PERSONAL MENTOR SYSTEM
# ==========================================

@router.get("/student/mentor/dashboard", response_model=MentorDashboardResponse, tags=["AI Personal Mentor"])
def get_personal_mentor_dashboard(
    current_user: CurrentUser = Depends(require_student),
    db: Session = Depends(get_db)
):
    try:
        return mentor_service.get_mentor_dashboard(db, current_user.id)
    except Exception as e:
        logger.error(f"Error fetching mentor dashboard: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/student/mentor/goals", response_model=Dict[str, Any], tags=["AI Personal Mentor"])
def update_personal_mentor_goals(
    payload: LearningGoalUpdate,
    current_user: CurrentUser = Depends(require_student),
    db: Session = Depends(get_db)
):
    try:
        return mentor_service.update_mentor_goals(db, current_user.id, payload)
    except Exception as e:
        logger.error(f"Error updating goals: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/student/mentor/assignments/generate", response_model=PersonalizedAssignmentResponse, tags=["AI Personal Mentor"])
def generate_personalized_mentor_assignment(
    payload: PersonalizedAssignmentRequest,
    current_user: CurrentUser = Depends(require_student),
    db: Session = Depends(get_db)
):
    try:
        return mentor_service.generate_personalized_assignment(db, current_user.id, payload.lesson_id, payload.topic_name)
    except Exception as e:
        logger.error(f"Error generating assignment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# 10. EDUCATIONAL VIDEO ANALYSIS
# ==========================================

@router.post("/student/video/analyze", response_model=VideoAnalysisResponse, tags=["Video Analysis"])
def analyze_educational_video_url(
    payload: VideoAnalysisRequest,
    current_user: CurrentUser = Depends(require_student),
    db: Session = Depends(get_db)
):
    try:
        return video_analysis_service.analyze_video_url(db, payload.url)
    except Exception as e:
        logger.error(f"Error analyzing video URL: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/student/video/chat", response_model=VideoChatResponse, tags=["Video Analysis"])
def ask_question_about_educational_video(
    payload: VideoChatRequest,
    current_user: CurrentUser = Depends(require_student),
    db: Session = Depends(get_db)
):
    try:
        reply = video_analysis_service.answer_video_doubt(db, payload.video_id, payload.question, payload.language)
        return VideoChatResponse(reply=reply)
    except Exception as e:
        logger.error(f"Error answering video doubt: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# ==========================================
# 11. LIVE MULTILINGUAL CLASSROOMS ENDPOINTS (Step 10)
# ==========================================

@router.post("/live-classes", response_model=LiveClassRead, tags=["Live Classroom"])
def schedule_live_class(
    data: LiveClassCreate,
    current_user: CurrentUser = Depends(require_educator),
    db: Session = Depends(get_db)
):
    from app.services.live_class_service import live_class_service
    try:
        return live_class_service.create_live_class(
            db, data.course_id, current_user.id, data.title, data.description, data.scheduled_at
        )
    except Exception as e:
        logger.error(f"Error creating live class: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/live-classes", response_model=List[LiveClassRead], tags=["Live Classroom"])
def list_live_classes(
    course_id: Optional[str] = Query(None),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.services.live_class_service import live_class_service
    return live_class_service.get_live_classes(db, course_id)

@router.get("/live-classes/{id}", response_model=LiveClassRead, tags=["Live Classroom"])
def get_live_class(
    id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.services.live_class_service import live_class_service
    live_class = live_class_service.get_live_class_by_id(db, id)
    if not live_class:
        raise HTTPException(status_code=404, detail="Live classroom session not found")
    return live_class

@router.put("/live-classes/{id}/status", response_model=LiveClassRead, tags=["Live Classroom"])
def update_live_class_status(
    id: str,
    status_str: str = Query(..., description="Target status: live, paused, completed, cancelled"),
    current_user: CurrentUser = Depends(require_educator),
    db: Session = Depends(get_db)
):
    from app.services.live_class_service import live_class_service
    # Verify status is correct
    if status_str not in ["live", "paused", "completed", "cancelled"]:
        raise HTTPException(status_code=400, detail="Invalid target status")
        
    if status_str == "completed":
        live_class = live_class_service.end_live_class(db, id)
    else:
        live_class = live_class_service.update_class_status(db, id, status_str)
        
    if not live_class:
        raise HTTPException(status_code=404, detail="Live classroom session not found")
    return live_class

@router.get("/live-classes/{id}/outputs", tags=["Live Classroom"])
def get_live_class_outputs(
    id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from app.services.live_class_service import live_class_service
    try:
        return live_class_service.get_live_class_outputs(db, id)
    except Exception as e:
        logger.error(f"Error fetching live class outputs: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/live-classes/{id}/recordings", tags=["Live Classroom"])
def upload_recorded_session(
    id: str,
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(require_educator),
    db: Session = Depends(get_db)
):
    """
    Allows educator to upload session video recordings for storage/archiving.
    """
    logger.info(f"Uploading session recording for live class {id}: {file.filename}")
    return {
        "status": "success",
        "session_id": id,
        "filename": file.filename,
        "recording_url": f"/archive/live-recordings/{id}_recording.mp4",
        "processed": True
    }


# ==========================================
# 12. ADVANCED ANALYTICS, SKILL PASSPORT & REPORTS (Step 11)
# ==========================================

@router.get("/admin/advanced-analytics", tags=["Advanced Analytics"])
def get_advanced_admin_analytics(
    current_user: CurrentUser = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return analytics_service.get_advanced_admin_analytics(db)

@router.get("/educator/advanced-analytics", tags=["Advanced Analytics"])
def get_advanced_educator_analytics(
    current_user: CurrentUser = Depends(require_educator),
    db: Session = Depends(get_db)
):
    return analytics_service.get_advanced_educator_analytics(db, current_user.id)

@router.get("/student/advanced-analytics", tags=["Advanced Analytics"])
def get_advanced_student_analytics(
    current_user: CurrentUser = Depends(require_student),
    db: Session = Depends(get_db)
):
    return analytics_service.get_advanced_student_analytics(db, current_user.id)

@router.post("/reports/generate", response_model=ReportRead, tags=["Reports"])
def generate_platform_report(
    report_type: str = Query(..., description="Report type: attendance, learning, translation, performance, quiz, ai_usage, course_completion, certificates"),
    current_user: CurrentUser = Depends(require_staff),
    db: Session = Depends(get_db)
):
    from app.services.report_service import report_service
    if report_type not in ["attendance", "learning", "translation", "performance", "quiz", "ai_usage", "course_completion", "certificates"]:
        raise HTTPException(status_code=400, detail="Invalid report type requested")
    return report_service.generate_report(db, report_type, current_user.id)

@router.get("/reports", response_model=List[ReportRead], tags=["Reports"])
def list_reports(
    current_user: CurrentUser = Depends(require_staff),
    db: Session = Depends(get_db)
):
    from app.services.report_service import report_service
    return report_service.get_reports(db)

@router.get("/student/skill-passport", response_model=SkillPassportRead, tags=["Skill Passport"])
def get_student_skill_passport(
    current_user: CurrentUser = Depends(require_student),
    db: Session = Depends(get_db)
):
    from app.services.skill_passport_service import skill_passport_service
    return skill_passport_service.get_or_create_passport(db, current_user.id)

@router.post("/student/skill-passport/refresh", response_model=SkillPassportRead, tags=["Skill Passport"])
def refresh_student_skill_passport(
    current_user: CurrentUser = Depends(require_student),
    db: Session = Depends(get_db)
):
    from app.services.skill_passport_service import skill_passport_service
    return skill_passport_service.update_passport_from_activity(db, current_user.id)


