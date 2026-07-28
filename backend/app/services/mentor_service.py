import json
import logging
import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func
import google.generativeai as genai
from app.core.config import settings
from app.models.models import (
    Student, Course, Lesson, LearningProgress, Analytics,
    Bookmark, LiveSession, AIChatHistory
)
from app.schemas.schemas import LearningGoalUpdate

logger = logging.getLogger("mentor_service")

class MentorService:
    def __init__(self):
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def get_mentor_dashboard(self, db: Session, student_id: str) -> Dict[str, Any]:
        """
        Gathers progress data, calculates streaks, retrieves bookmarks & analytics,
        and prompts the AI model to generate personalized suggestions and goals.
        """
        logger.info(f"Generating personal mentor dashboard for student {student_id}")

        # 1. Get student record
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            return self._get_empty_dashboard_fallback()

        details = dict(student.details or {})
        enrolled_course_ids = details.get("enrolled_courses", [])

        # 2. Query enrolled courses & lessons
        courses = db.query(Course).filter(Course.id.in_(enrolled_course_ids)).all() if enrolled_course_ids else []
        course_map = {str(c.id): c for c in courses}
        
        all_lessons = []
        if enrolled_course_ids:
            all_lessons = db.query(Lesson).filter(Lesson.course_id.in_(enrolled_course_ids)).order_by(Lesson.order_index.asc()).all()
        
        # 3. Query learning progress
        progress_records = db.query(LearningProgress).filter(
            LearningProgress.student_id == student_id
        ).all()
        progress_map = {str(p.lesson_id): p for p in progress_records}

        # Calculate progress stats
        completed_count = sum(1 for p in progress_records if p.completed)
        total_lessons_count = len(all_lessons)
        progress_percent = (completed_count / total_lessons_count * 100.0) if total_lessons_count > 0 else 0.0

        # Strong & Weak Topics identification based on quiz scores
        weak_topics = []
        improved_topics = []
        quiz_scores = []

        for p in progress_records:
            if p.quiz_score is not None:
                quiz_scores.append(float(p.quiz_score))
                lesson = db.query(Lesson).filter(Lesson.id == p.lesson_id).first()
                if lesson:
                    course = course_map.get(str(lesson.course_id))
                    category = course.category if course else "Vocational"
                    score_val = float(p.quiz_score)
                    if score_val < 75.0:
                        weak_topics.append({
                            "topic": lesson.title,
                            "score": score_val,
                            "category": category
                        })
                    else:
                        improved_topics.append({
                            "topic": lesson.title,
                            "score": score_val,
                            "category": category
                        })

        # 4. Calculate Streak
        streak = self._calculate_streak(db, student_id, details)
        details["streak"] = streak
        details["last_activity_date"] = datetime.date.today().isoformat()
        
        # Award Badges Dynamically
        badges = details.get("badges", [])
        self._award_badges_dynamically(badges, streak, completed_count, len(quiz_scores))
        details["badges"] = badges

        student.details = details
        db.commit()

        # 5. Bookmarked lessons
        bookmarks = db.query(Bookmark).filter(
            Bookmark.student_id == student_id,
            Bookmark.item_type == "lesson"
        ).all()
        bookmarked_ids = [str(b.item_id) for b in bookmarks]

        # 6. Time Spent Learning (sum of durations in play_video logs)
        play_logs = db.query(Analytics).filter(
            Analytics.user_id == student_id,
            Analytics.event_type == "play_video"
        ).all()
        
        total_time_spent_secs = 0
        video_completions = []
        for log in play_logs:
            meta = log.event_metadata or {}
            total_time_spent_secs += meta.get("time_spent_seconds", 300) # default 5 mins if missing
            if "completion_percentage" in meta:
                video_completions.append(meta["completion_percentage"])

        avg_video_completion = sum(video_completions) / len(video_completions) if video_completions else 0.0

        # 7. AI Chat History Context
        chats = db.query(AIChatHistory).filter(
            AIChatHistory.user_id == student_id
        ).order_by(AIChatHistory.created_at.desc()).limit(5).all()
        chat_topics = [c.message for c in chats if c.role == "user"]

        # 8. Upcoming Live Sessions
        upcoming_sessions = []
        if enrolled_course_ids:
            sessions = db.query(LiveSession).filter(
                LiveSession.course_id.in_(enrolled_course_ids),
                LiveSession.scheduled_at >= datetime.datetime.utcnow()
            ).order_by(LiveSession.scheduled_at.asc()).limit(3).all()
            for s in sessions:
                course = course_map.get(str(s.course_id))
                upcoming_sessions.append({
                    "id": str(s.id),
                    "title": s.title,
                    "course_title": course.title if course else "Course",
                    "scheduled_at": s.scheduled_at.isoformat()
                })

        # 9. Next Recommended Lesson & Revisions
        recommended_lessons = []
        recommended_revisions = []

        # Find first uncompleted lesson
        next_lesson = None
        for lesson in all_lessons:
            prog = progress_map.get(str(lesson.id))
            if not prog or not prog.completed:
                next_lesson = lesson
                break
        
        if next_lesson:
            course = course_map.get(str(next_lesson.course_id))
            recommended_lessons.append({
                "id": str(next_lesson.id),
                "title": next_lesson.title,
                "course_title": course.title if course else "Course",
                "type": "Next Lesson"
            })
        elif all_lessons:
            # Fallback to reviewing the last lesson
            last_l = all_lessons[-1]
            course = course_map.get(str(last_l.course_id))
            recommended_lessons.append({
                "id": str(last_l.id),
                "title": last_l.title,
                "course_title": course.title if course else "Course",
                "type": "Review"
            })

        # Revisions: recommend lessons where quiz score < 75 or bookmarked
        for lesson in all_lessons:
            prog = progress_map.get(str(lesson.id))
            is_bookmarked = str(lesson.id) in bookmarked_ids
            low_score = prog and prog.quiz_score is not None and float(prog.quiz_score) < 75.0
            
            if low_score or is_bookmarked:
                course = course_map.get(str(lesson.course_id))
                recommended_revisions.append({
                    "id": str(lesson.id),
                    "title": lesson.title,
                    "course_title": course.title if course else "Course",
                    "reason": "Needs Score Improvement" if low_score else "Bookmarked Study"
                })

        # Slice to avoid clutter
        recommended_revisions = recommended_revisions[:3]

        # 10. Goals
        today_goal = details.get("today_goal", {
            "text": "Complete 1 video and practice 1 quiz today",
            "completed": False,
            "progress": 0.0
        })
        weekly_goal = details.get("weekly_goal", {
            "text": "Spend 2 hours learning and complete 3 lessons",
            "completed": False,
            "progress": 0.0
        })

        # Calculate goal completion dynamically based on progress of today / week
        # (This is simulated based on today's activities log vs target)
        today_events_count = db.query(Analytics).filter(
            Analytics.user_id == student_id,
            Analytics.created_at >= datetime.datetime.combine(datetime.date.today(), datetime.time.min)
        ).count()
        today_goal["progress"] = min(today_events_count / 3.0, 1.0)
        today_goal["completed"] = today_goal["progress"] >= 1.0

        week_events_count = db.query(Analytics).filter(
            Analytics.user_id == student_id,
            Analytics.created_at >= datetime.datetime.utcnow() - datetime.timedelta(days=7)
        ).count()
        weekly_goal["progress"] = min(week_events_count / 10.0, 1.0)
        weekly_goal["completed"] = weekly_goal["progress"] >= 1.0

        # Update goals back in details
        details["today_goal"] = today_goal
        details["weekly_goal"] = weekly_goal
        student.details = details
        db.commit()

        # 11. Skill Growth (Calculated based on categories of completed lessons)
        skill_growth_data = self._calculate_skill_growth(db, progress_records, course_map)

        # 12. Call AI Groq to predict weaknesses, motivational insights & pathways
        ai_data = self._get_ai_insights(
            student_name=details.get("full_name", "Student"),
            progress_percent=progress_percent,
            completed_count=completed_count,
            streak=streak,
            weak_topics=weak_topics,
            improved_topics=improved_topics,
            chat_topics=chat_topics,
            courses=[c.title for c in courses]
        )

        return {
            "learning_progress": round(progress_percent, 1),
            "today_goal": today_goal,
            "weekly_goal": weekly_goal,
            "skill_growth": skill_growth_data,
            "learning_streak": streak,
            "recommended_lessons": recommended_lessons,
            "recommended_revisions": recommended_revisions,
            "ai_suggestions": ai_data,
            "upcoming_live_sessions": upcoming_sessions,
            "recently_weak_topics": weak_topics[:3],
            "recently_improved_topics": improved_topics[:3],
            "motivational_messages": ai_data.get("motivational_messages", ["Keep pushing your boundaries! You are doing great."]),
            "badges": [b for b in badges if b.get("active", True)]
        }

    def update_mentor_goals(self, db: Session, student_id: str, data: LearningGoalUpdate) -> Dict[str, Any]:
        """
        Updates the learning goals inside student details.
        """
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise Exception("Student not found")

        details = dict(student.details or {})
        
        today_goal = details.get("today_goal", {"text": "", "completed": False, "progress": 0.0})
        weekly_goal = details.get("weekly_goal", {"text": "", "completed": False, "progress": 0.0})

        if data.today_goal_text is not None:
            today_goal["text"] = data.today_goal_text
        if data.weekly_goal_text is not None:
            weekly_goal["text"] = data.weekly_goal_text
        if data.today_progress is not None:
            today_goal["progress"] = data.today_progress
            today_goal["completed"] = data.today_progress >= 1.0
        if data.weekly_progress is not None:
            weekly_goal["progress"] = data.weekly_progress
            weekly_goal["completed"] = data.weekly_progress >= 1.0

        details["today_goal"] = today_goal
        details["weekly_goal"] = weekly_goal
        student.details = details
        db.commit()

        return {"status": "success", "today_goal": today_goal, "weekly_goal": weekly_goal}

    def generate_personalized_assignment(
        self, db: Session, student_id: str, lesson_id: str, topic_name: str
    ) -> Dict[str, Any]:
        """
        Generates a custom vocational assignment focused on a specific weak topic using AI.
        """
        logger.info(f"Generating personalized assignment on {topic_name} for student {student_id}")
        
        prompt = f"""
        Generate a personalized vocational training assignment for a student struggling with the topic: "{topic_name}".
        Provide exactly 3 multiple choice questions that test conceptual understanding and practical troubleshooting of this topic.
        
        Your response MUST be valid JSON with this structure:
        {{
          "title": "Topic Mastery Assignment: [Topic Name]",
          "description": "A tailored assignment targeting specific conceptual difficulties in [Topic Name].",
          "questions": [
            {{
              "question": "Question text...",
              "options": ["Option A", "Option B", "Option C", "Option D"],
              "correct_index": 0,
              "explanation": "Why this answer is correct..."
            }}
          ]
        }}
        """

        try:
            if not self.model or settings.GEMINI_API_KEY == "your_gemini_api_key_placeholder":
                # Fallback mock response
                return {
                    "title": f"Mastery Checkpoint: {topic_name}",
                    "description": f"Personalized practice questions targeting troubleshooting and safety in {topic_name}.",
                    "questions": [
                        {
                          "question": f"Which protocol is essential for securing components in {topic_name}?",
                          "options": ["Standard Insulation checks", "Double-grounding circuit lines", "Voltage isolation lockouts", "Non-conductive barriers"],
                          "correct_index": 2,
                          "explanation": "Lockout/Tagout (LOTO) protocols prevent accidental re-energization during maintenance."
                        },
                        {
                          "question": "What is the primary indicator of calibration drift in industrial systems?",
                          "options": ["Rapid thermal changes", "Fluctuating impedance values", "Visual degradation of conductors", "Response lag in controls"],
                          "correct_index": 3,
                          "explanation": "Lag in controller response is a classic signature of calibration sensor drift."
                        }
                    ]
                }

            response = self.model.generate_content(f"{prompt}\nReturn valid JSON only with no markdown formatting.")
            clean_text = response.text.replace("```json", "").replace("```", "").strip() if response and response.text else "{}"
            return json.loads(clean_text)
        except Exception as e:
            logger.error(f"Error calling Gemini AI for custom assignment: {str(e)}")
            return {
                "title": f"AI Directed Assignment: {topic_name}",
                "description": f"Review questions targeting concepts of {topic_name}.",
                "questions": [
                    {
                      "question": "Self-check conceptual question",
                      "options": ["Correct Choice", "Option B", "Option C", "Option D"],
                      "correct_index": 0,
                      "explanation": "Conceptual review of troubleshooting principles."
                    }
                ]
            }

    # ==========================================
    # HELPER METRICS & AI COMPILATION METHODS
    # ==========================================

    def _calculate_streak(self, db: Session, student_id: str, details: Dict[str, Any]) -> int:
        """
        Computes consecutive active days based on student analytics event logs.
        """
        streak = details.get("streak", 0)
        last_date_str = details.get("last_activity_date")
        
        # Check if active today
        today = datetime.date.today()
        
        if last_date_str:
            last_date = datetime.date.fromisoformat(last_date_str)
            delta = (today - last_date).days
            if delta == 1:
                # Active yesterday and today
                streak += 1
            elif delta > 1:
                # Broke streak
                streak = 1
            # If delta == 0, keep streak unchanged
        else:
            streak = 1

        return streak

    def _award_badges_dynamically(self, badges: List[Dict[str, Any]], streak: int, completed_count: int, quiz_count: int):
        """
        Awards reward badges based on learning milestones.
        """
        existing_names = {b["name"] for b in badges}

        badge_rules = [
            {
                "name": "First Steps",
                "description": "Enrolled in your first course!",
                "icon": "school",
                "condition": completed_count >= 0
            },
            {
                "name": "Streak Starter",
                "description": "Maintained a 3-day learning streak.",
                "icon": "local_fire_department",
                "condition": streak >= 3
            },
            {
                "name": "Weekly Warrior",
                "description": "Maintained a 7-day learning streak.",
                "icon": "workspace_premium",
                "condition": streak >= 7
            },
            {
                "name": "Quiz Master",
                "description": "Solved 5 or more educational quizzes.",
                "icon": "psychology",
                "condition": quiz_count >= 5
            },
            {
                "name": "Fast Learner",
                "description": "Completed 5 vocational lessons.",
                "icon": "speed",
                "condition": completed_count >= 5
            }
        ]

        for rule in badge_rules:
            if rule["condition"] and rule["name"] not in existing_names:
                badges.append({
                    "name": rule["name"],
                    "description": rule["description"],
                    "icon": rule["icon"],
                    "date_earned": datetime.date.today().isoformat(),
                    "active": True
                })

    def _calculate_skill_growth(self, db: Session, progress: List[LearningProgress], course_map: Dict[str, Course]) -> List[Dict[str, Any]]:
        """
        Aggregates lessons completed per vocational category to gauge skill levels.
        """
        category_scores: Dict[str, float] = {}
        category_counts: Dict[str, int] = {}
        
        # Seed default vocational categories
        default_categories = ["Electrical", "Plumbing", "Machining", "Carpentry"]
        for cat in default_categories:
            category_scores[cat] = 10.0 # start baseline at 10%
            category_counts[cat] = 0

        # Calculate actual completed lessons per category
        for p in progress:
            if p.completed:
                from app.models.models import Lesson
                lesson = db.query(Lesson).filter(Lesson.id == p.lesson_id).first()
                if lesson:
                    course = course_map.get(str(lesson.course_id))
                    if course:
                        cat = course.category
                        if cat not in category_scores:
                            category_scores[cat] = 10.0
                            category_counts[cat] = 0
                        category_counts[cat] += 1
                        # Increment level by 15% per completed lesson
                        category_scores[cat] = min(category_scores[cat] + 15.0, 100.0)

        return [{"skill": k, "level": round(v)} for k, v in category_scores.items()]

    def _get_ai_insights(
        self, student_name: str, progress_percent: float, completed_count: int,
        streak: int, weak_topics: List[Dict[str, Any]], improved_topics: List[Dict[str, Any]],
        chat_topics: List[str], courses: List[str]
    ) -> Dict[str, Any]:
        """
        Calls Groq API to compile predictions, learning difficulties, career plans, and motivational quotes.
        """
        # Build prompt listing the metrics
        prompt = f"""
        Assemble study advice and career plans for student: "{student_name}".
        Metrics:
        - Completed lessons: {completed_count} ({progress_percent}% overall course completion).
        - Streak: {streak} days.
        - Enrolled Courses: {", ".join(courses)}.
        - Recently Weak Topics (Quiz < 75%): {json.dumps(weak_topics)}.
        - Recently Improved Topics (Quiz >= 75%): {json.dumps(improved_topics)}.
        - Recent Chat Doubt Queries: {json.dumps(chat_topics)}.
        
        Generate exactly:
        1. 2 predicted weak areas (specific skills or chapters they need to review).
        2. 1 predicted learning difficulty (e.g. struggles with formula calculations or schematics).
        3. 2 career pathways based on their course profile.
        4. 2 additional learning resources (e.g. youtube tutorials, books).
        5. 2 motivational messages customized to push them to master their weak areas.
        
        Your response MUST be valid JSON with this structure:
        {{
          "predicted_weak_areas": ["...", "..."],
          "predicted_learning_difficulties": ["..."],
          "career_pathways": ["...", "..."],
          "additional_resources": [
             {{"title": "...", "type": "video/article", "url": "..."}},
             {{"title": "...", "type": "video/article", "url": "..."}}
          ],
          "motivational_messages": ["...", "..."]
        }}
        """

        try:
            if not self.model or settings.GEMINI_API_KEY == "your_gemini_api_key_placeholder":
                raise Exception("Using mock fallback")

            response = self.model.generate_content(f"{prompt}\nReturn valid JSON format only with no markdown formatting.")
            clean_text = response.text.replace("```json", "").replace("```", "").strip() if response and response.text else "{}"
            return json.loads(clean_text)
        except Exception:
            # Fallback values
            weak_area_fallbacks = ["Motor Phase Alignment & Voltage Ratios"]
            if weak_topics:
                weak_area_fallbacks.append(f"Review of {weak_topics[0]['topic']}")
            else:
                weak_area_fallbacks.append("Troubleshooting control circuits")

            return {
                "predicted_weak_areas": weak_area_fallbacks,
                "predicted_learning_difficulties": ["Interpretation of multimeters & wiring diagrams under load"],
                "career_pathways": [
                    "Industrial Maintenance Electrician",
                    "Renewable Grid Control Technician"
                ],
                "additional_resources": [
                    {"title": "Introductory Wiring Schematics 101", "type": "video", "url": "https://www.youtube.com/watch?v=mock1"},
                    {"title": "National Electrical Safety Code (NESC) Handbook", "type": "article", "url": "https://example.com/nesc-pdf"}
                ],
                "motivational_messages": [
                    f"Hi {student_name}, you're on a {streak}-day learning streak! Don't let circuits hold you back. Revise your weak topics to unlock the 'Quiz Master' badge!",
                    "Continuous practice is the key to mastering industrial safety. Try a quick quiz today to test your grounding concepts!"
                ]
            }

    def _get_empty_dashboard_fallback(self) -> Dict[str, Any]:
        """
        Dashboard fallback for fresh students with zero activities.
        """
        return {
            "learning_progress": 0.0,
            "today_goal": {
                "text": "Enroll in your first course and complete lesson 1",
                "completed": False,
                "progress": 0.0
            },
            "weekly_goal": {
                "text": "Complete 3 lessons and practice weekly quizzes",
                "completed": False,
                "progress": 0.0
            },
            "skill_growth": [
                {"skill": "Electrical", "level": 10},
                {"skill": "Plumbing", "level": 10},
                {"skill": "Machining", "level": 10},
                {"skill": "Carpentry", "level": 10}
            ],
            "learning_streak": 0,
            "recommended_lessons": [],
            "recommended_revisions": [],
            "ai_suggestions": {
                "predicted_weak_areas": ["N/A - Please complete your first quiz"],
                "predicted_learning_difficulties": ["N/A - Start lessons to predict analytics"],
                "career_pathways": ["Junior Vocational Technician"],
                "additional_resources": [
                    {"title": "Introduction to Vocational Skills", "type": "article", "url": "https://example.com/intro"}
                ],
                "motivational_messages": ["Welcome to SkillVerse AI! Tap on any course to enroll and begin your learning path today."]
            },
            "upcoming_live_sessions": [],
            "recently_weak_topics": [],
            "recently_improved_topics": [],
            "motivational_messages": ["Welcome! Let's start by choosing a course that fits your learning goals."],
            "badges": []
        }

mentor_service = MentorService()
