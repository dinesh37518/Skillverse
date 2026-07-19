import logging
from typing import Dict, Any
from supabase import Client
from fastapi import HTTPException, status
from app.core.supabase_client import get_supabase
from app.schemas.schemas import UserSignUp, UserLogin

logger = logging.getLogger("auth_service")

class AuthService:
    def __init__(self):
        self.supabase: Client = get_supabase()

    def signup(self, signup_data: UserSignUp) -> Dict[str, Any]:
        """
        Wraps Supabase sign up client.
        Triggers automatic PostgreSQL profile sync.
        """
        logger.info(f"Initiating signup for email: {signup_data.email} as role: {signup_data.role}")
        try:
            response = self.supabase.auth.sign_up({
                "email": signup_data.email,
                "password": signup_data.password,
                "options": {
                    "data": {
                        "full_name": signup_data.full_name,
                        "role": signup_data.role
                    }
                }
            })
            if not response.user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Signup failed. Verify parameters and try again."
                )
            
            return {
                "id": response.user.id,
                "email": response.user.email,
                "role": signup_data.role,
                "message": "User registered successfully. Check email for confirmation link."
            }
        except Exception as e:
            logger.error(f"Error in signup: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Registration failed: {str(e)}"
            )

    def login(self, login_data: UserLogin) -> Dict[str, Any]:
        """
        Wraps Supabase signInWithPassword client.
        """
        logger.info(f"Initiating login for email: {login_data.email}")
        try:
            response = self.supabase.auth.sign_in_with_password({
                "email": login_data.email,
                "password": login_data.password
            })
            if not response.session:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid login credentials."
                )
            
            role = response.user.user_metadata.get("role") if response.user else "student"
            return {
                "access_token": response.session.access_token,
                "token_type": "bearer",
                "refresh_token": response.session.refresh_token,
                "role": role or "student"
            }
        except Exception as e:
            logger.error(f"Error in login: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Authentication failed: {str(e)}"
            )

    def refresh_token(self, refresh_token: str) -> Dict[str, Any]:
        """
        Refreshes session access token using the refresh token.
        """
        logger.info("Initiating token refresh request")
        try:
            response = self.supabase.auth.refresh_session(refresh_token)
            if not response.session:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Session refresh failed."
                )
            role = response.user.user_metadata.get("role") if response.user else "student"
            return {
                "access_token": response.session.access_token,
                "token_type": "bearer",
                "refresh_token": response.session.refresh_token,
                "role": role or "student"
            }
        except Exception as e:
            logger.error(f"Error in refreshing token: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Failed to refresh access token: {str(e)}"
            )

auth_service = AuthService()
