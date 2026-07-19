import logging
import datetime
import uuid
from typing import Optional, List
from sqlalchemy.orm import Session
from app.models.models import LiveAttendance

logger = logging.getLogger("attendance_service")

class AttendanceService:
    def record_join(self, db: Session, session_id: str, student_id: str, language_preference: str = "English") -> LiveAttendance:
        session_uuid = uuid.UUID(session_id) if isinstance(session_id, str) else session_id
        student_uuid = uuid.UUID(student_id) if isinstance(student_id, str) else student_id
        
        logger.info(f"Recording student {student_id} joining class {session_id} in {language_preference}")
        
        # Check if record already exists
        record = db.query(LiveAttendance).filter(
            LiveAttendance.session_id == session_uuid,
            LiveAttendance.student_id == student_uuid
        ).first()
        
        if record:
            record.joined_at = datetime.datetime.utcnow()
            record.left_at = None
            record.language_preference = language_preference
        else:
            record = LiveAttendance(
                session_id=session_uuid,
                student_id=student_uuid,
                joined_at=datetime.datetime.utcnow(),
                language_preference=language_preference,
                watch_time_seconds=0,
                engagement_score=0.0
            )
            db.add(record)
            
        db.commit()
        db.refresh(record)
        return record

    def record_leave(self, db: Session, session_id: str, student_id: str) -> Optional[LiveAttendance]:
        session_uuid = uuid.UUID(session_id) if isinstance(session_id, str) else session_id
        student_uuid = uuid.UUID(student_id) if isinstance(student_id, str) else student_id
        
        logger.info(f"Recording student {student_id} leaving class {session_id}")
        
        record = db.query(LiveAttendance).filter(
            LiveAttendance.session_id == session_uuid,
            LiveAttendance.student_id == student_uuid
        ).first()
        
        if record:
            record.left_at = datetime.datetime.utcnow()
            
            # Calculate additional watch time
            delta = record.left_at - record.joined_at
            session_watch_seconds = int(delta.total_seconds())
            if session_watch_seconds > 0:
                record.watch_time_seconds += session_watch_seconds
            
            # Simple heuristic for engagement score based on watch duration (cap at 100.0)
            # Say 15 mins (900 secs) is standard high engagement
            engagement = min((record.watch_time_seconds / 900.0) * 100.0, 100.0)
            record.engagement_score = round(engagement, 2)
            
            db.commit()
            db.refresh(record)
            return record
            
        return None

    def get_attendance_for_session(self, db: Session, session_id: str) -> List[LiveAttendance]:
        session_uuid = uuid.UUID(session_id) if isinstance(session_id, str) else session_id
        return db.query(LiveAttendance).filter(LiveAttendance.session_id == session_uuid).all()

attendance_service = AttendanceService()
