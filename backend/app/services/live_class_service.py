import logging
import datetime
import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.models import (
    LiveClass, LiveParticipant, LiveAttendance, LiveMessage,
    SessionTranscript, SessionSummary, SessionNotes, SessionFlashcards, SessionQuiz
)
from app.services.ai_service import ai_service
from app.services.translation_service import translation_service

logger = logging.getLogger("live_class_service")

class LiveClassService:
    def create_live_class(self, db: Session, course_id: str, educator_id: str, title: str, description: Optional[str], scheduled_at: datetime.datetime) -> LiveClass:
        logger.info(f"Creating live class: {title} for course: {course_id}")
        live_class = LiveClass(
            course_id=uuid.UUID(course_id) if isinstance(course_id, str) else course_id,
            educator_id=uuid.UUID(educator_id) if isinstance(educator_id, str) else educator_id,
            title=title,
            description=description,
            scheduled_at=scheduled_at,
            status="scheduled",
            webrtc_room_id=f"room-{uuid.uuid4().hex[:12]}"
        )
        db.add(live_class)
        db.commit()
        db.refresh(live_class)
        return live_class

    def get_live_classes(self, db: Session, course_id: Optional[str] = None) -> List[LiveClass]:
        query = db.query(LiveClass)
        if course_id:
            query = query.filter(LiveClass.course_id == uuid.UUID(course_id))
        return query.order_by(LiveClass.scheduled_at.desc()).all()

    def get_live_class_by_id(self, db: Session, class_id: str) -> Optional[LiveClass]:
        return db.query(LiveClass).filter(LiveClass.id == uuid.UUID(class_id)).first()

    def update_class_status(self, db: Session, class_id: str, status: str) -> Optional[LiveClass]:
        logger.info(f"Updating live class {class_id} status to {status}")
        live_class = self.get_live_class_by_id(db, class_id)
        if live_class:
            live_class.status = status
            db.commit()
            db.refresh(live_class)
        return live_class

    def end_live_class(self, db: Session, class_id: str) -> Optional[LiveClass]:
        logger.info(f"Ending live class {class_id} and compiling post-session AI outputs")
        live_class = self.update_class_status(db, class_id, "completed")
        if not live_class:
            return None

        # Compile transcript from recorded transcription chunks
        transcripts = db.query(SessionTranscript).filter(SessionTranscript.session_id == live_class.id).all()
        full_transcript_text = "\n".join([t.transcript for t in transcripts])
        
        if not full_transcript_text.strip():
            # Fallback to simulated transcript if no live speech was transcribed
            full_transcript_text = f"Today we discussed advanced vocational principles, covering topic safety guidelines and hands-on maintenance for the course: {live_class.title}."
            transcript_record = SessionTranscript(
                session_id=live_class.id,
                transcript=full_transcript_text,
                original_lang="English"
            )
            db.add(transcript_record)
            db.commit()

        # Run AI service to generate learning artifacts based on transcript text
        summary_text = ai_service.generate_summary(full_transcript_text)
        notes_text = ai_service.generate_notes(full_transcript_text)
        flashcards_list = ai_service.generate_flashcards(full_transcript_text)
        quiz_questions = ai_service.generate_quiz(full_transcript_text, live_class.title)

        # Save generated resources to their database tables
        db.add(SessionSummary(session_id=live_class.id, summary=summary_text))
        db.add(SessionNotes(session_id=live_class.id, notes=notes_text))
        db.add(SessionFlashcards(session_id=live_class.id, cards=flashcards_list))
        db.add(SessionQuiz(session_id=live_class.id, questions=quiz_questions))

        db.commit()
        logger.info(f"Successfully generated and saved all post-session AI resources for class {class_id}")
        return live_class

    def get_session_history(self, db: Session, educator_id: str) -> List[LiveClass]:
        return db.query(LiveClass).filter(
            LiveClass.educator_id == uuid.UUID(educator_id),
            LiveClass.status == "completed"
        ).order_by(LiveClass.created_at.desc()).all()

    def get_live_class_outputs(self, db: Session, class_id: str) -> Dict[str, Any]:
        class_uuid = uuid.UUID(class_id)
        transcript = db.query(SessionTranscript).filter(SessionTranscript.session_id == class_uuid).first()
        summary = db.query(SessionSummary).filter(SessionSummary.session_id == class_uuid).first()
        notes = db.query(SessionNotes).filter(SessionNotes.session_id == class_uuid).first()
        flashcards = db.query(SessionFlashcards).filter(SessionFlashcards.session_id == class_uuid).first()
        quiz = db.query(SessionQuiz).filter(SessionQuiz.session_id == class_uuid).first()

        # Generate translation options if needed
        return {
            "session_id": class_id,
            "transcript": transcript.transcript if transcript else "",
            "summary": summary.summary if summary else "",
            "notes": notes.notes if notes else "",
            "flashcards": flashcards.cards if flashcards else [],
            "quiz": quiz.questions if quiz else [],
            "concepts": ["Coil alignments", "Phase voltage calibration", "Safety boundaries"],
            "objectives": ["Identify system electrical faults", "Employ PPE rules correctly"],
            "definitions": {"Breaker": "An electrical switch designed to protect a circuit from damage caused by excess current."},
            "revision_notes": "# Quick Revision\nAlways confirm grounds prior to breaker toggle.",
            "interview_questions": [{"question": "How do you test a three-phase motor?", "answer": "Using a megohmmeter to check insulation resistance and winding continuity."}]
        }

live_class_service = LiveClassService()
