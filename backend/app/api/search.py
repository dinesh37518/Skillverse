import logging
from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import SearchResultItem
from app.services.search_service import search_service

logger = logging.getLogger("search_api")
router = APIRouter()

@router.get("/search", response_model=List[SearchResultItem])
def universal_search(
    query: str = Query(..., description="Universal search query across courses, lessons, and content"),
    language: str = Query("English", description="Target language context"),
    db: Session = Depends(get_db)
):
    """
    Performs a semantic text query across course, lesson, videos, pdfs, ppts, flashcards, and quizzes.
    """
    logger.info(f"Universal AI Search query: '{query}' in language: {language}")
    return search_service.universal_search(db, query, language)
