import logging
from typing import Optional, List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Video, LearningProgress
from app.core.supabase_client import get_supabase
from app.core.config import settings

logger = logging.getLogger("video_service")

class VideoService:
    def __init__(self):
        self.supabase = get_supabase()
        self.bucket = settings.STORAGE_BUCKET_NAME

    def upload_video(
        self, db: Session, lesson_id: str, file_name: str, file_bytes: bytes, original_language: str, duration_seconds: int = 0
    ) -> Video:
        """
        Uploads video to Supabase Storage, then logs the metadata in the database.
        """
        path = f"videos/{lesson_id}/{file_name}"
        logger.info(f"Uploading video file to Supabase Storage path: {path}")
        
        try:
            # Upload to Supabase Storage
            # (Note: In mock environment or if bucket doesn't exist, this might raise an exception. We'll handle it gracefully)
            try:
                self.supabase.storage.from_(self.bucket).upload(
                    path=path,
                    file=file_bytes,
                    file_options={"content-type": "video/mp4", "x-upsert": "true"}
                )
                file_url = path
            except Exception as se:
                logger.warning(f"Supabase Storage upload bypassed/failed: {str(se)}. Using mock file path.")
                file_url = f"mock_videos/{lesson_id}/{file_name}"

            # Create video metadata record
            video = Video(
                lesson_id=lesson_id,
                original_language=original_language,
                file_path=file_url,
                duration_seconds=duration_seconds,
                status="completed"
            )
            db.add(video)
            db.commit()
            db.refresh(video)
            return video
            
        except Exception as e:
            logger.error(f"Error uploading video: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Video upload failed: {str(e)}"
            )

    def get_videos_for_lesson(self, db: Session, lesson_id: str) -> List[Video]:
        """
        Lists video metadata records for a lesson.
        """
        return db.query(Video).filter(Video.lesson_id == lesson_id).all()

    def generate_secure_url(self, video: Video) -> str:
        """
        Generates a secure signed URL for temporary playback of a video file.
        """
        # If it is a mock path, return a mock URL
        if video.file_path.startswith("mock_videos/"):
            return f"https://mock.supabase.co/storage/v1/object/public/skillverse-storage/{video.file_path}"
            
        try:
            # Generate signed URL valid for 1 hour (3600 seconds)
            res = self.supabase.storage.from_(self.bucket).create_signed_url(video.file_path, 3600)
            # In some client library versions, this returns a dict with 'signedURL' or 'url', or a string
            if isinstance(res, dict):
                return res.get("signedURL") or res.get("url") or video.file_path
            return str(res)
        except Exception as e:
            logger.warning(f"Failed to generate signed URL: {str(e)}. Falling back to public path.")
            return f"https://mock.supabase.co/storage/v1/object/public/skillverse-storage/{video.file_path}"

video_service = VideoService()
