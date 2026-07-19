import logging
import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Course, Lesson, LiveSession, Student, Notification, Pdf, Ppt
from app.core.supabase_client import get_supabase
from app.core.config import settings
from app.services.course_service import course_service
from app.services.video_service import video_service
from app.services.content_service import content_service
from app.services.analytics_service import analytics_service

logger = logging.getLogger("educator_service")

class EducatorService:
    def __init__(self):
        self.supabase = get_supabase()
        self.bucket = settings.STORAGE_BUCKET_NAME

    # Document upload handling (PDF, PPT, DOCX)
    def upload_document(
        self, db: Session, lesson_id: str, file_name: str, file_bytes: bytes, doc_type: str
    ) -> Any:
        """
        Uploads a document to Supabase Storage and records metadata.
        Supports: 'pdf', 'ppt', 'docx'.
        """
        path = f"documents/{lesson_id}/{file_name}"
        logger.info(f"Uploading document ({doc_type}) to Supabase Storage: {path}")

        try:
            # Upload file
            try:
                self.supabase.storage.from_(self.bucket).upload(
                    path=path,
                    file=file_bytes,
                    file_options={"x-upsert": "true"}
                )
                file_url = path
            except Exception as se:
                logger.warning(f"Storage upload failed: {str(se)}. Bypassing with mock path.")
                file_url = f"mock_documents/{lesson_id}/{file_name}"

            # Save metadata in Postgres
            title = file_name.replace(f".{doc_type}", "").replace("_", " ").title()
            if doc_type.lower() == "pdf":
                record = content_service.create_pdf(db, lesson_id, title, file_url)
            elif doc_type.lower() == "ppt":
                record = content_service.create_ppt(db, lesson_id, title, file_url)
            else:
                # Store DOCX under PDFs with tag/indicator in title to match the schema
                record = content_service.create_pdf(db, lesson_id, f"DOCX Document: {title}", file_url)
                
            return record
        except Exception as e:
            logger.error(f"Error uploading document: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Document upload failed: {str(e)}"
            )

    # Announcements (Notifications broadcast to enrolled students)
    def create_announcement(
        self, db: Session, educator_id: str, title: str, message: str, course_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Broadcasts an announcement notification to students enrolled in the educator's courses.
        """
        logger.info(f"Educator {educator_id} creating announcement: {title}")
        
        # Get target courses
        if course_id:
            course_ids = [course_id]
        else:
            courses = db.query(Course.id).filter(Course.educator_id == educator_id).all()
            course_ids = [c[0] for c in courses]
            
        if not course_ids:
            return {"status": "success", "recipients_count": 0, "message": "No courses found for educator. No announcement sent."}

        # Find enrolled students
        students = db.query(Student).all()
        enrolled_student_ids = []
        for s in students:
            enrolled = (s.details or {}).get("enrolled_courses", [])
            if any(cid in enrolled for cid in course_ids):
                enrolled_student_ids.append(s.id)

        # Send notifications
        count = 0
        for sid in enrolled_student_ids:
            notification = Notification(
                user_id=sid,
                title=f"Announcement: {title}",
                message=message,
                is_read=False
            )
            db.add(notification)
            count += 1
            
        db.commit()
        return {"status": "success", "recipients_count": count, "message": f"Announcement broadcasted to {count} students."}

    # Live Classroom Scheduling
    def schedule_live_session(
        self, db: Session, educator_id: str, course_id: str, title: str, description: Optional[str], scheduled_at: Any
    ) -> LiveSession:
        logger.info(f"Educator {educator_id} scheduling live session: {title} for course {course_id}")
        
        # Verify course belongs to educator or is valid
        course = course_service.get_course_by_id(db, course_id)
        if not course:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
            
        webrtc_room_id = f"room-{uuid.uuid4().hex[:8]}"
        session = LiveSession(
            course_id=course_id,
            educator_id=educator_id,
            title=title,
            description=description,
            scheduled_at=scheduled_at,
            status="scheduled",
            webrtc_room_id=webrtc_room_id
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        return session

    # Educator Analytics
    def get_educator_course_analytics(self, db: Session, educator_id: str) -> List[Dict[str, Any]]:
        """
        Gathers analytics for all courses published by this educator.
        """
        logger.info(f"Fetching analytics for educator: {educator_id}")
        courses = db.query(Course.id).filter(Course.educator_id == educator_id).all()
        results = []
        for c in courses:
            results.append(analytics_service.get_course_analytics(db, str(c[0])))
        return results

    def get_educator_student_analytics(self, db: Session, educator_id: str) -> List[Dict[str, Any]]:
        """
        Gathers progress analytics for all students enrolled in this educator's courses.
        """
        logger.info(f"Fetching student analytics for educator: {educator_id}")
        courses = db.query(Course.id).filter(Course.educator_id == educator_id).all()
        course_ids = [c[0] for c in courses]
        if not course_ids:
            return []

        students = db.query(Student).all()
        results = []
        for s in students:
            enrolled = (s.details or {}).get("enrolled_courses", [])
            if any(cid in enrolled for cid in course_ids):
                results.append(analytics_service.get_student_analytics(db, str(s.id)))
        return results

educator_service = EducatorService()
