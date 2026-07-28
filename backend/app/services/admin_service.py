import logging
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.models import Educator, Profile, Course, UserRole, Role
from app.core.supabase_client import get_supabase
from app.services.analytics_service import analytics_service

logger = logging.getLogger("admin_service")

class AdminService:
    def __init__(self):
        self.supabase = get_supabase()

    def list_educators(self, db: Session) -> List[Dict[str, Any]]:
        """
        Lists all educators with their profile full name.
        """
        logger.info("Admin fetching list of all educators")
        educators = db.query(Educator).all()
        results = []
        for e in educators:
            profile = db.query(Profile).filter(Profile.id == e.id).first()
            name = profile.full_name if profile else "Unknown Educator"
            results.append({
                "id": str(e.id),
                "full_name": name,
                "email": e.email,
                "password": e.password,
                "bio": e.bio,
                "specialization": e.specialization,
                "approved": e.approved,
                "approved_by": str(e.approved_by) if e.approved_by else None,
                "approved_at": e.approved_at,
                "status": e.status,
                "created_at": e.created_at
            })
        return results

    def add_educator(self, db: Session, email: str, password: str, full_name: str) -> Dict[str, Any]:
        """
        Creates an educator user in Supabase auth and synchronizes role.
        """
        logger.info(f"Admin adding new educator with email: {email}")
        try:
            # Create user in Supabase auth with educator role
            response = self.supabase.auth.admin.create_user({
                "email": email,
                "password": password,
                "user_metadata": {
                    "full_name": full_name,
                    "role": "educator"
                },
                "email_confirm": True
            })
            if not response.user:
                raise HTTPException(status_code=400, detail="Failed to create educator user in Supabase Auth.")
                
            # DB trigger automatically creates Profile, LanguagePreference, UserRole, and Educator
            # We will fetch and update the educator profile to approved and active
            educator = db.query(Educator).filter(Educator.id == response.user.id).first()
            if educator:
                educator.approved = True
                educator.status = "active"
                educator.email = email
                educator.password = password
                db.commit()
                
            return {
                "id": response.user.id,
                "email": response.user.email,
                "full_name": full_name,
                "status": "active"
            }
        except Exception as e:
            logger.error(f"Error admin adding educator: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to add educator: {str(e)}"
            )

    def update_educator_status(
        self, db: Session, educator_id: str, admin_id: str, approved: Optional[bool], status_str: Optional[str]
    ) -> Dict[str, Any]:
        """
        Approves, suspends, or activates an educator.
        """
        logger.info(f"Admin updating educator {educator_id} status: approved={approved}, status={status_str}")
        educator = db.query(Educator).filter(Educator.id == educator_id).first()
        if not educator:
            raise HTTPException(status_code=404, detail="Educator profile not found")

        import datetime
        if approved is not None:
            educator.approved = approved
            if approved:
                educator.approved_by = admin_id
                educator.approved_at = datetime.datetime.utcnow()
                educator.status = "active"
                
        if status_str is not None:
            if status_str in ["active", "suspended", "pending"]:
                educator.status = status_str
                
        db.commit()
        db.refresh(educator)
        return {
            "id": str(educator.id),
            "approved": educator.approved,
            "status": educator.status
        }

    def update_educator_details(
        self, db: Session, educator_id: str, email: Optional[str] = None, password: Optional[str] = None,
        full_name: Optional[str] = None, specialization: Optional[str] = None, bio: Optional[str] = None,
        status: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Updates the educator's details both in Supabase Auth and the local Postgres tables.
        """
        logger.info(f"Admin updating educator {educator_id} details")
        educator = db.query(Educator).filter(Educator.id == educator_id).first()
        if not educator:
            raise HTTPException(status_code=404, detail="Educator profile not found")

        profile = db.query(Profile).filter(Profile.id == educator.id).first()
        
        # 1. Update Supabase Auth if email or password or name are changing
        update_attrs = {}
        if email:
            update_attrs["email"] = email
        if password:
            update_attrs["password"] = password
        if full_name:
            if not update_attrs.get("user_metadata"):
                update_attrs["user_metadata"] = {}
            update_attrs["user_metadata"]["full_name"] = full_name
            
        if update_attrs:
            try:
                self.supabase.auth.admin.update_user_by_id(educator_id, update_attrs)
            except Exception as e:
                logger.warning(f"Failed to update user in Supabase auth: {str(e)}")

        # 2. Update local DB tables
        if full_name and profile:
            profile.full_name = full_name
        if email:
            educator.email = email
        if password:
            educator.password = password
        if specialization is not None:
            educator.specialization = specialization
        if bio is not None:
            educator.bio = bio
        if status is not None:
            educator.status = status
            
        db.commit()
        db.refresh(educator)
        if profile:
            db.refresh(profile)
            
        return {
            "id": str(educator.id),
            "full_name": profile.full_name if profile else "Unknown Educator",
            "email": educator.email,
            "password": educator.password,
            "specialization": educator.specialization,
            "bio": educator.bio,
            "status": educator.status
        }

    def delete_educator(self, db: Session, educator_id: str) -> bool:
        """
        Removes educator from Supabase auth and postgres.
        """
        logger.info(f"Admin deleting educator: {educator_id}")
        try:
            self.supabase.auth.admin.delete_user(educator_id)
            # Cascade delete in PostgreSQL deletes Profile/Educator
            return True
        except Exception as e:
            logger.warning(f"Supabase user deletion failed: {str(e)}. Deleting profile directly in DB.")
            profile = db.query(Profile).filter(Profile.id == educator_id).first()
            if profile:
                db.delete(profile)
                db.commit()
                return True
            return False

    def list_all_courses(self, db: Session) -> List[Course]:
        return db.query(Course).all()

    def get_platform_reports(self, db: Session) -> Dict[str, Any]:
        return analytics_service.get_platform_report(db)

    # Languages and settings in-memory/fallback database configuration
    _system_settings = {
        "maintenance_mode": False,
        "allow_guest_mode": True,
        "max_upload_size_mb": 500
    }
    _languages = [
        "English", "Assamese", "Bengali", "Bodo", "Dogri", "Gujarati", 
        "Hindi", "Kannada", "Kashmiri", "Konkani", "Maithili", "Malayalam", 
        "Manipuri", "Marathi", "Nepali", "Odia", "Punjabi", "Sanskrit", 
        "Santali", "Sindhi", "Tamil", "Telugu", "Urdu"
    ]

    def get_languages(self) -> List[str]:
        return self._languages

    def update_languages(self, new_languages: List[str]) -> List[str]:
        self._languages = new_languages
        return self._languages

    def get_system_settings(self) -> Dict[str, Any]:
        return self._system_settings

    def update_system_settings(self, settings_data: Dict[str, Any]) -> Dict[str, Any]:
        self._system_settings.update(settings_data)
        return self._system_settings

admin_service = AdminService()
