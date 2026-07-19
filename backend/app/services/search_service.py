import logging
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_, cast, String
from app.models.models import Course, Lesson, Video, Pdf, Ppt, Note, Quiz, Flashcard
from app.schemas.schemas import SearchResultItem

logger = logging.getLogger("search_service")

class SearchService:
    def universal_search(self, db: Session, query_str: str, language: str = "English") -> List[SearchResultItem]:
        """
        Queries all learning resources matching the text query.
        """
        logger.info(f"Universal Search running: query_str='{query_str}' language='{language}'")
        if not query_str or query_str.strip() == "":
            return []
            
        results: List[SearchResultItem] = []
        term = f"%{query_str}%"

        # 1. Search Courses
        courses = db.query(Course).filter(
            or_(
                Course.title.ilike(term),
                Course.description.ilike(term),
                Course.category.ilike(term)
            )
        ).limit(5).all()
        for c in courses:
            results.append(SearchResultItem(
                id=str(c.id),
                type="course",
                title=c.title,
                description=c.description,
                relevance_score=0.95,
                url=None
            ))

        # 2. Search Lessons
        lessons = db.query(Lesson).filter(
            or_(
                Lesson.title.ilike(term),
                Lesson.content_text.ilike(term)
            )
        ).limit(5).all()
        for l in lessons:
            results.append(SearchResultItem(
                id=str(l.id),
                type="lesson",
                title=l.title,
                description=l.content_text[:120] if l.content_text else None,
                relevance_score=0.90,
                url=None
            ))

        # 3. Search Videos
        videos = db.query(Video).filter(
            Video.original_language.ilike(term)
        ).limit(3).all()
        for v in videos:
            results.append(SearchResultItem(
                id=str(v.id),
                type="video",
                title=f"Lesson Video ({v.original_language})",
                description=f"Original video stored at {v.file_path}",
                relevance_score=0.85,
                url=v.file_path
            ))

        # 4. Search PDFs
        pdfs = db.query(Pdf).filter(
            or_(
                Pdf.title.ilike(term),
                Pdf.parsed_text.ilike(term)
            )
        ).limit(3).all()
        for p in pdfs:
            results.append(SearchResultItem(
                id=str(p.id),
                type="pdf",
                title=p.title,
                description="Parsed PDF document content match.",
                relevance_score=0.88,
                url=p.file_path
            ))

        # 5. Search PPTs
        ppts = db.query(Ppt).filter(
            or_(
                Ppt.title.ilike(term),
                Ppt.parsed_text.ilike(term)
            )
        ).limit(3).all()
        for pt in ppts:
            results.append(SearchResultItem(
                id=str(pt.id),
                type="ppt",
                title=pt.title,
                description="Parsed PPT presentation slides match.",
                relevance_score=0.87,
                url=pt.file_path
            ))

        # 6. Search Notes
        notes = db.query(Note).filter(
            or_(
                Note.title.ilike(term),
                Note.content.ilike(term)
            )
        ).limit(3).all()
        for n in notes:
            results.append(SearchResultItem(
                id=str(n.id),
                type="notes",
                title=n.title,
                description=n.content[:120] if n.content else None,
                relevance_score=0.89,
                url=None
            ))

        # 7. Search Flashcards
        flashcards = db.query(Flashcard).filter(
            or_(
                Flashcard.deck_name.ilike(term),
                cast(Flashcard.cards, String).ilike(term)
            )
        ).limit(3).all()
        for f in flashcards:
            results.append(SearchResultItem(
                id=str(f.id),
                type="flashcard",
                title=f.deck_name or "Lesson Flashcards Deck",
                description="Flashcards study cards match.",
                relevance_score=0.82,
                url=None
            ))

        # 8. Search Quizzes
        quizzes = db.query(Quiz).filter(
            or_(
                Quiz.title.ilike(term),
                cast(Quiz.questions, String).ilike(term)
            )
        ).limit(3).all()
        for q in quizzes:
            results.append(SearchResultItem(
                id=str(q.id),
                type="quiz",
                title=q.title,
                description="Interactive lesson assessment questions match.",
                relevance_score=0.84,
                url=None
            ))

        # Sort combined results by relevance score descending
        results.sort(key=lambda x: x.relevance_score, reverse=True)
        return results

search_service = SearchService()
