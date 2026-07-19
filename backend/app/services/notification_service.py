import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Notification
from app.schemas.schemas import NotificationCreate

logger = logging.getLogger("notification_service")

class NotificationService:
    def list_notifications(self, db: Session, user_id: str, unread_only: bool = False) -> List[Notification]:
        """
        Retrieves user notifications.
        """
        logger.info(f"Listing notifications for user {user_id} (unread_only={unread_only})")
        query = db.query(Notification).filter(Notification.user_id == user_id)
        if unread_only:
            query = query.filter(Notification.is_read == False)
        return query.order_by(Notification.created_at.desc()).all()

    def create_notification(self, db: Session, data: NotificationCreate) -> Notification:
        """
        Sends a new notification to a user.
        """
        logger.info(f"Creating notification for user {data.user_id}: {data.title}")
        notification = Notification(
            user_id=data.user_id,
            title=data.title,
            message=data.message,
            is_read=False
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification

    def mark_as_read(self, db: Session, notification_id: str, user_id: str) -> Notification:
        """
        Marks a specific notification as read.
        """
        logger.info(f"Marking notification {notification_id} as read for user {user_id}")
        notification = db.query(Notification).filter(
            Notification.id == notification_id, Notification.user_id == user_id
        ).first()
        if not notification:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
        
        notification.is_read = True
        db.commit()
        db.refresh(notification)
        return notification

    # ==========================================
    # TEMPLATE TRIGGERS FOR REALTIME NOTIFICATIONS
    # ==========================================

    def send_live_class_reminder(self, db: Session, user_id: str, class_title: str, scheduled_time: str) -> Notification:
        return self.create_notification(
            db, 
            NotificationCreate(
                user_id=user_id,
                title="Live Class Reminder",
                message=f"Don't forget! The live class '{class_title}' is scheduled at {scheduled_time}."
            )
        )

    def send_class_started(self, db: Session, user_id: str, class_title: str) -> Notification:
        return self.create_notification(
            db,
            NotificationCreate(
                user_id=user_id,
                title="Class Started",
                message=f"The live session '{class_title}' has started. Join now to get live translations!"
            )
        )

    def send_class_ending_soon(self, db: Session, user_id: str, class_title: str) -> Notification:
        return self.create_notification(
            db,
            NotificationCreate(
                user_id=user_id,
                title="Class Ending Soon",
                message=f"The live session '{class_title}' is wrapping up. Be sure to ask your doubts now."
            )
        )

    def send_assignment_reminder(self, db: Session, user_id: str, assignment_title: str, due_date: str) -> Notification:
        return self.create_notification(
            db,
            NotificationCreate(
                user_id=user_id,
                title="Assignment Due Reminder",
                message=f"Friendly reminder: The assignment '{assignment_title}' is due by {due_date}."
            )
        )

    def send_quiz_reminder(self, db: Session, user_id: str, quiz_title: str) -> Notification:
        return self.create_notification(
            db,
            NotificationCreate(
                user_id=user_id,
                title="Quiz Reminder",
                message=f"Test your knowledge! Remember to complete the quiz: '{quiz_title}'."
            )
        )

    def send_ai_mentor_reminder(self, db: Session, user_id: str, suggestion: str) -> Notification:
        return self.create_notification(
            db,
            NotificationCreate(
                user_id=user_id,
                title="AI Mentor Suggestion",
                message=f"Your AI Mentor suggests: {suggestion}"
            )
        )

    def send_certificate_notification(self, db: Session, user_id: str, course_title: str) -> Notification:
        return self.create_notification(
            db,
            NotificationCreate(
                user_id=user_id,
                title="Certificate Earned!",
                message=f"Congratulations! You have successfully completed the course '{course_title}' and earned a certificate."
            )
        )

notification_service = NotificationService()

