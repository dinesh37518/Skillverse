import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Course, Lesson
from app.schemas.schemas import CourseCreate, LessonCreate

logger = logging.getLogger("course_service")

class CourseService:
    def list_courses(
        self, db: Session, category: Optional[str] = None, language: Optional[str] = None, is_published: Optional[bool] = None
    ) -> List[Course]:
        """
        Retrieves all courses matching optional filters.
        """
        logger.info(f"Listing courses: category={category}, language={language}, is_published={is_published}")
        query = db.query(Course)
        if category:
            query = query.filter(Course.category.ilike(category))
        if language:
            query = query.filter(Course.language.ilike(language))
        if is_published is not None:
            query = query.filter(Course.is_published == is_published)
        return query.all()

    def get_course_by_id(self, db: Session, course_id: str) -> Optional[Course]:
        """
        Retrieves a course by its unique ID.
        """
        logger.info(f"Fetching course by ID: {course_id}")
        return db.query(Course).filter(Course.id == course_id).first()

    def create_course(self, db: Session, course_data: CourseCreate, educator_id: str) -> Course:
        """
        Creates a new course.
        """
        logger.info(f"Creating course: {course_data.title} for educator: {educator_id}")
        course = Course(
            title=course_data.title,
            description=course_data.description,
            category=course_data.category,
            language=course_data.language,
            educator_id=educator_id,
            is_published=False
        )
        db.add(course)
        db.commit()
        db.refresh(course)
        return course

    def update_course(self, db: Session, course_id: str, updates: dict) -> Course:
        """
        Updates course fields based on key-value dictionary.
        """
        logger.info(f"Updating course ID: {course_id}")
        course = self.get_course_by_id(db, course_id)
        if not course:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
            
        for key, value in updates.items():
            if hasattr(course, key) and value is not None:
                setattr(course, key, value)
                
        db.commit()
        db.refresh(course)
        return course

    def delete_course(self, db: Session, course_id: str) -> bool:
        """
        Deletes a course by its ID.
        """
        logger.info(f"Deleting course ID: {course_id}")
        course = self.get_course_by_id(db, course_id)
        if not course:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
            
        db.delete(course)
        db.commit()
        return True

    def get_lessons_for_course(self, db: Session, course_id: str) -> List[Lesson]:
        """
        Retrieves all lessons belonging to a course sorted by order_index.
        """
        logger.info(f"Fetching lessons for course ID: {course_id}")
        return db.query(Lesson).filter(Lesson.course_id == course_id).order_by(Lesson.order_index.asc()).all()

    def get_lesson_by_id(self, db: Session, lesson_id: str) -> Optional[Lesson]:
        """
        Retrieves a single lesson.
        """
        logger.info(f"Fetching lesson ID: {lesson_id}")
        return db.query(Lesson).filter(Lesson.id == lesson_id).first()

    def create_lesson(self, db: Session, course_id: str, lesson_data: LessonCreate) -> Lesson:
        """
        Appends a lesson to a course.
        """
        logger.info(f"Creating lesson: {lesson_data.title} for course ID: {course_id}")
        # Verify course exists
        course = self.get_course_by_id(db, course_id)
        if not course:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
            
        lesson = Lesson(
            course_id=course_id,
            title=lesson_data.title,
            content_text=lesson_data.content_text,
            order_index=lesson_data.order_index
        )
        db.add(lesson)
        db.commit()
        db.refresh(lesson)
        return lesson

course_service = CourseService()
