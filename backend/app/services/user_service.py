import logging
from typing import Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Profile, LanguagePreference, UserRole, Role
from app.schemas.schemas import ProfileUpdate, LanguagePreferenceUpdate

logger = logging.getLogger("user_service")

class UserService:
    def get_profile(self, db: Session, user_id: str) -> Optional[Profile]:
        """
        Retrieves user profile from database.
        """
        logger.info(f"Fetching profile for user: {user_id}")
        return db.query(Profile).filter(Profile.id == user_id).first()

    def update_profile(self, db: Session, user_id: str, profile_data: ProfileUpdate) -> Profile:
        """
        Updates name details in Profile.
        """
        logger.info(f"Updating profile details for user: {user_id}")
        profile = self.get_profile(db, user_id)
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found")
        
        if profile_data.full_name is not None:
            profile.full_name = profile_data.full_name
            
        db.commit()
        db.refresh(profile)
        return profile

    def get_language_preference(self, db: Session, user_id: str) -> Optional[LanguagePreference]:
        """
        Fetches language preferences for user.
        """
        logger.info(f"Fetching language preference for user: {user_id}")
        return db.query(LanguagePreference).filter(LanguagePreference.user_id == user_id).first()

    def update_language_preference(
        self, db: Session, user_id: str, lang_data: LanguagePreferenceUpdate
    ) -> LanguagePreference:
        """
        Updates language selection details.
        """
        logger.info(f"Updating language preferences for user: {user_id}")
        pref = self.get_language_preference(db, user_id)
        if not pref:
            # Create a new record if not exists
            pref = LanguagePreference(user_id=user_id)
            db.add(pref)
            
        if lang_data.app_language is not None:
            pref.app_language = lang_data.app_language
        if lang_data.classroom_language is not None:
            pref.classroom_language = lang_data.classroom_language
            
        db.commit()
        db.refresh(pref)
        return pref

user_service = UserService()
