import logging
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Student, Bookmark, LearningProgress, Certificate, Course, Lesson, Quiz
from app.schemas.schemas import BookmarkCreate, LearningProgressUpdate
from app.services.course_service import course_service
from app.services.analytics_service import analytics_service

logger = logging.getLogger("student_service")

class StudentService:
    def get_student(self, db: Session, student_id: str) -> Student:
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student record not found")
        return student

    # Course enrollment stored in student's details JSONB
    def enroll_in_course(self, db: Session, student_id: str, course_id: str) -> Dict[str, Any]:
        logger.info(f"Student {student_id} enrolling in course {course_id}")
        # Verify course exists
        course = course_service.get_course_by_id(db, course_id)
        if not course:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")

        student = self.get_student(db, student_id)
        
        # Get existing details
        details = dict(student.details or {})
        enrolled_courses = details.get("enrolled_courses", [])
        
        if course_id not in enrolled_courses:
            enrolled_courses.append(course_id)
            details["enrolled_courses"] = enrolled_courses
            student.details = details
            db.commit()
            
            # Log analytics enrollment event
            analytics_service.log_event(
                db, 
                event_type="enroll_course", 
                user_id=student_id, 
                metadata={"course_id": course_id}
            )

        return {"status": "success", "message": f"Successfully enrolled in course {course_id}"}

    def get_enrolled_courses(self, db: Session, student_id: str) -> List[Course]:
        student = self.get_student(db, student_id)
        enrolled_ids = (student.details or {}).get("enrolled_courses", [])
        if not enrolled_ids:
            return []
        return db.query(Course).filter(Course.id.in_(enrolled_ids)).all()

    # Bookmarks
    def list_bookmarks(self, db: Session, student_id: str) -> List[Bookmark]:
        return db.query(Bookmark).filter(Bookmark.student_id == student_id).all()

    def create_bookmark(self, db: Session, student_id: str, data: BookmarkCreate) -> Bookmark:
        logger.info(f"Creating bookmark for student {student_id} on {data.item_type} {data.item_id}")
        
        # Check duplicate
        existing = db.query(Bookmark).filter(
            Bookmark.student_id == student_id,
            Bookmark.item_type == data.item_type,
            Bookmark.item_id == data.item_id
        ).first()
        if existing:
            return existing

        bookmark = Bookmark(
            student_id=student_id,
            item_type=data.item_type,
            item_id=data.item_id
        )
        db.add(bookmark)
        db.commit()
        db.refresh(bookmark)
        return bookmark

    def delete_bookmark(self, db: Session, student_id: str, bookmark_id: str) -> bool:
        bookmark = db.query(Bookmark).filter(Bookmark.id == bookmark_id, Bookmark.student_id == student_id).first()
        if not bookmark:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bookmark not found")
        db.delete(bookmark)
        db.commit()
        return True

    # Downloads
    def log_download(self, db: Session, student_id: str, item_type: str, item_id: str) -> Dict[str, Any]:
        logger.info(f"Student {student_id} downloaded {item_type} {item_id}")
        
        # Log to student details JSONB
        student = self.get_student(db, student_id)
        details = dict(student.details or {})
        downloads = details.get("downloads", [])
        
        download_record = {"item_type": item_type, "item_id": item_id}
        if download_record not in downloads:
            downloads.append(download_record)
            details["downloads"] = downloads
            student.details = details
            db.commit()

        # Log analytics download event
        analytics_service.log_event(
            db, 
            event_type="download", 
            user_id=student_id, 
            metadata={"item_type": item_type, "item_id": item_id}
        )
        return {"status": "success", "message": "Download tracked successfully"}

    def get_downloads(self, db: Session, student_id: str) -> List[Dict[str, Any]]:
        student = self.get_student(db, student_id)
        return (student.details or {}).get("downloads", [])

    # Learning Progress
    def get_learning_progress(self, db: Session, student_id: str) -> List[LearningProgress]:
        return db.query(LearningProgress).filter(LearningProgress.student_id == student_id).all()

    def update_learning_progress(
        self, db: Session, student_id: str, lesson_id: str, data: LearningProgressUpdate
    ) -> LearningProgress:
        logger.info(f"Updating progress for student {student_id} on lesson {lesson_id}")
        
        # Verify lesson exists
        lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        if not lesson:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Lesson not found")

        progress = db.query(LearningProgress).filter(
            LearningProgress.student_id == student_id,
            LearningProgress.lesson_id == lesson_id
        ).first()

        if not progress:
            progress = LearningProgress(
                student_id=student_id,
                lesson_id=lesson_id,
                completed=data.completed,
                quiz_score=data.quiz_score
            )
            db.add(progress)
        else:
            progress.completed = data.completed
            if data.quiz_score is not None:
                progress.quiz_score = data.quiz_score

        db.commit()
        db.refresh(progress)
        
        # Log play_video or solve_quiz events based on inputs
        if data.quiz_score is not None:
            analytics_service.log_event(
                db, 
                event_type="solve_quiz", 
                user_id=student_id, 
                metadata={"lesson_id": lesson_id, "score": float(data.quiz_score)}
            )
        else:
            analytics_service.log_event(
                db, 
                event_type="play_video", 
                user_id=student_id, 
                metadata={"lesson_id": lesson_id}
            )

        return progress

    # Certificates
    def get_certificates(self, db: Session, student_id: str) -> List[Certificate]:
        return db.query(Certificate).filter(Certificate.student_id == student_id).all()

    def generate_certificate(self, db: Session, student_id: str, course_id: str) -> Certificate:
        logger.info(f"Generating certificate for student {student_id} on course {course_id}")
        
        # Verify student completed all lessons in this course
        lessons = db.query(Lesson).filter(Lesson.course_id == course_id).all()
        if not lessons:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Course syllabus is empty.")
            
        completed_lessons_count = db.query(LearningProgress).filter(
            LearningProgress.student_id == student_id,
            LearningProgress.lesson_id.in_([l.id for l in lessons]),
            LearningProgress.completed == True
        ).count()
        
        if completed_lessons_count < len(lessons):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail=f"Course lessons not fully completed. Completed: {completed_lessons_count}/{len(lessons)}"
            )

        # Check duplicate certificate
        existing = db.query(Certificate).filter(
            Certificate.student_id == student_id,
            Certificate.course_id == course_id
        ).first()
        if existing:
            return existing

        # Issue new certificate
        cert_url = f"https://mock.supabase.co/storage/v1/object/public/certificates/{student_id}_{course_id}.pdf"
        certificate = Certificate(
            student_id=student_id,
            course_id=course_id,
            certificate_url=cert_url
        )
        db.add(certificate)
        db.commit()
        db.refresh(certificate)
        return certificate

student_service = StudentService()
