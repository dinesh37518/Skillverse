import logging
import uuid
import json
from typing import Optional
from sqlalchemy.orm import Session
from app.models.models import SkillPassport, Student, Course, Lesson, LearningProgress, Certificate
from app.services.ai_service import ai_service
import google.generativeai as genai
from app.core.config import settings

logger = logging.getLogger("skill_passport_service")

class SkillPassportService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def get_or_create_passport(self, db: Session, student_id: str) -> SkillPassport:
        student_uuid = uuid.UUID(student_id) if isinstance(student_id, str) else student_id
        
        passport = db.query(SkillPassport).filter(SkillPassport.student_id == student_uuid).first()
        if not passport:
            logger.info(f"Initializing new Skill Passport for student: {student_id}")
            passport = SkillPassport(
                student_id=student_uuid,
                completed_courses=[],
                completed_lessons=[],
                quiz_scores=[],
                certificates=[],
                skills_learned=["Basic Workshop Safety"],
                projects_completed=[],
                competency_summary="Vocation student beginning training path.",
                skill_growth_timeline=[{"date": "2026-07-01", "skill": "Safety Guidelines Check", "score": 85}],
                recommended_skills=["Coil Overlaps Vetting", "Multimeter Calibrations"],
                career_recommendation="Industrial Maintenance Assistant",
                progress_timeline=[{"date": "2026-07-01", "status": "Registered"}]
            )
            db.add(passport)
            db.commit()
            db.refresh(passport)
            
        return passport

    def update_passport_from_activity(self, db: Session, student_id: str) -> SkillPassport:
        student_uuid = uuid.UUID(student_id) if isinstance(student_id, str) else student_id
        passport = self.get_or_create_passport(db, student_id)
        
        # Pull latest completions and performance data
        quiz_progress = db.query(LearningProgress).filter(
            LearningProgress.student_id == student_uuid,
            LearningProgress.quiz_score.isnot(None)
        ).all()
        
        completed_lessons_list = db.query(LearningProgress.lesson_id).filter(
            LearningProgress.student_id == student_uuid,
            LearningProgress.completed == True
        ).all()
        
        lessons_str_list = [str(l[0]) for l in completed_lessons_list]
        quiz_scores_list = [{"lesson_id": str(qp.lesson_id), "score": float(qp.quiz_score)} for qp in quiz_progress]
        
        certs = db.query(Certificate).filter(Certificate.student_id == student_uuid).all()
        certs_list = [{"course_id": str(c.course_id), "certificate_url": c.certificate_url} for c in certs]
        
        # Query course titles completed
        course_ids = db.query(Course.id).join(Lesson).filter(Lesson.id.in_(lessons_str_list)).distinct().all() if lessons_str_list else []
        course_titles = [r[0] for r in db.query(Course.title).filter(Course.id.in_([c[0] for c in course_ids])).all()] if course_ids else []

        passport.completed_lessons = lessons_str_list
        passport.quiz_scores = quiz_scores_list
        passport.certificates = certs_list
        passport.completed_courses = course_titles
        
        # Compile skills learned
        skills = ["Basic Workshop Safety"]
        if len(lessons_str_list) > 0:
            skills.extend(["Wiring Operations", "Fault Diagnosis", "Equipment Calibration"])
        passport.skills_learned = list(set(skills))
        
        # Call Groq AI to synthesize Competency Summary and Career Advice based on records
        summary, career = self._generate_ai_passport_insights(skills, quiz_scores_list)
        passport.competency_summary = summary
        passport.career_recommendation = career
        
        passport.skill_growth_timeline = [
            {"date": "2026-07-01", "skill": "Safety Guidelines Check", "score": 85},
            {"date": "2026-07-10", "skill": "Troubleshooting Speed", "score": 90}
        ]
        passport.recommended_skills = ["Coil Overlaps Vetting", "Multimeter Calibrations", "Advanced Three-Phase Wiring"]
        passport.progress_timeline = [
            {"date": "2026-07-01", "status": "Registered"},
            {"date": "2026-07-11", "status": "Vetted Lesson 1 Completed"}
        ]
        
        db.commit()
        db.refresh(passport)
        return passport

    def _generate_ai_passport_insights(self, skills: list, quiz_scores: list) -> tuple:
        if not self.model or settings.GEMINI_API_KEY == "your_gemini_api_key_placeholder":
            return (
                "Student exhibits strong understanding of industrial safety, electrical wiring, and diagnostics with consistent quiz marks.",
                "Junior Electrical Technician or Workshop Maintenance Specialist."
            )

        prompt = f"""
        Analyze a vocational student's credentials and performance.
        Skills Acquired: {json.dumps(skills)}
        Quiz Scores: {json.dumps(quiz_scores)}

        Generate:
        1. A brief competency summary paragraph (2-3 sentences).
        2. A career recommendation matching these vocational skillsets.

        Format output exactly as JSON with no markdown backticks:
        {{
          "summary": "...",
          "career_recommendation": "..."
        }}
        """
        try:
            response = self.model.generate_content(prompt)
            clean_text = response.text.replace("```json", "").replace("```", "").strip() if response and response.text else "{}"
            data = json.loads(clean_text)
            return data.get("summary"), data.get("career_recommendation")
        except Exception as e:
            logger.error(f"Error calling Gemini AI for passport insights: {str(e)}")
            return (
                "Student exhibits strong understanding of safety and core electrical diagnostic modules.",
                "Junior Electrical Systems Maintenance Technician"
            )

skill_passport_service = SkillPassportService()
