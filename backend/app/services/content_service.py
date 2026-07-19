import logging
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Pdf, Ppt, Note, Assignment, Quiz, Flashcard
from app.schemas.schemas import NoteCreate, QuizCreate, FlashcardDeckCreate

logger = logging.getLogger("content_service")

class ContentService:
    # 1. PDFs
    def create_pdf(self, db: Session, lesson_id: str, title: str, file_path: str) -> Pdf:
        logger.info(f"Creating PDF record for lesson {lesson_id}")
        pdf = Pdf(lesson_id=lesson_id, title=title, file_path=file_path, status="completed")
        db.add(pdf)
        db.commit()
        db.refresh(pdf)
        return pdf

    def get_pdfs_for_lesson(self, db: Session, lesson_id: str) -> List[Pdf]:
        return db.query(Pdf).filter(Pdf.lesson_id == lesson_id).all()

    # 2. PPTs
    def create_ppt(self, db: Session, lesson_id: str, title: str, file_path: str) -> Ppt:
        logger.info(f"Creating PPT record for lesson {lesson_id}")
        ppt = Ppt(lesson_id=lesson_id, title=title, file_path=file_path, status="completed")
        db.add(ppt)
        db.commit()
        db.refresh(ppt)
        return ppt

    def get_ppts_for_lesson(self, db: Session, lesson_id: str) -> List[Ppt]:
        return db.query(Ppt).filter(Ppt.lesson_id == lesson_id).all()

    # 3. Notes
    def create_note(self, db: Session, student_id: str, note_data: NoteCreate) -> Note:
        logger.info(f"Creating Note for student {student_id}")
        note = Note(
            lesson_id=note_data.lesson_id,
            student_id=student_id,
            title=note_data.title,
            content=note_data.content,
            is_ai_generated=note_data.is_ai_generated
        )
        db.add(note)
        db.commit()
        db.refresh(note)
        return note

    def get_notes_for_student(self, db: Session, student_id: str) -> List[Note]:
        return db.query(Note).filter(Note.student_id == student_id).all()

    def get_note_by_id(self, db: Session, note_id: str) -> Optional[Note]:
        return db.query(Note).filter(Note.id == note_id).first()

    def delete_note(self, db: Session, note_id: str, student_id: str) -> bool:
        note = db.query(Note).filter(Note.id == note_id, Note.student_id == student_id).first()
        if not note:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
        db.delete(note)
        db.commit()
        return True

    # 4. Assignments
    def create_assignment(
        self, db: Session, lesson_id: str, title: str, description: Optional[str], max_score: float, due_date: Any
    ) -> Assignment:
        logger.info(f"Creating Assignment for lesson {lesson_id}")
        assignment = Assignment(
            lesson_id=lesson_id,
            title=title,
            description=description,
            max_score=max_score,
            due_date=due_date
        )
        db.add(assignment)
        db.commit()
        db.refresh(assignment)
        return assignment

    def get_assignments_for_lesson(self, db: Session, lesson_id: str) -> List[Assignment]:
        return db.query(Assignment).filter(Assignment.lesson_id == lesson_id).all()

    # 5. Quizzes
    def create_quiz(self, db: Session, quiz_data: QuizCreate) -> Quiz:
        logger.info(f"Creating Quiz for lesson {quiz_data.lesson_id}")
        # Serialize questions to list of dicts for JSON column
        questions_list = [q.model_dump() for q in quiz_data.questions]
        quiz = Quiz(
            lesson_id=quiz_data.lesson_id,
            title=quiz_data.title,
            questions=questions_list
        )
        db.add(quiz)
        db.commit()
        db.refresh(quiz)
        return quiz

    def get_quizzes_for_lesson(self, db: Session, lesson_id: str) -> List[Quiz]:
        return db.query(Quiz).filter(Quiz.lesson_id == lesson_id).all()

    def get_quiz_by_id(self, db: Session, quiz_id: str) -> Optional[Quiz]:
        return db.query(Quiz).filter(Quiz.id == quiz_id).first()

    # 6. Flashcards
    def create_flashcard_deck(self, db: Session, deck_data: FlashcardDeckCreate) -> Flashcard:
        logger.info(f"Creating Flashcard Deck for lesson {deck_data.lesson_id}")
        cards_list = [c.model_dump() for c in deck_data.cards]
        flashcard = Flashcard(
            lesson_id=deck_data.lesson_id,
            deck_name=deck_data.deck_name,
            cards=cards_list
        )
        db.add(flashcard)
        db.commit()
        db.refresh(flashcard)
        return flashcard

    def get_flashcards_for_lesson(self, db: Session, lesson_id: str) -> List[Flashcard]:
        return db.query(Flashcard).filter(Flashcard.lesson_id == lesson_id).all()

content_service = ContentService()
