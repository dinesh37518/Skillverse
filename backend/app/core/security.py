from typing import Optional, List
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core.config import settings

security_scheme = HTTPBearer()

class CurrentUser:
    def __init__(self, id: str, email: str, role: str):
        self.id = id
        self.email = email
        self.role = role

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)) -> CurrentUser:
    token = credentials.credentials
    try:
        # Decodes the Supabase Auth JWT using the configured secret key
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated"
        )
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        
        # Pull role from custom user metadata inside auth claims
        app_metadata = payload.get("app_metadata", {})
        user_metadata = payload.get("user_metadata", {})
        role: str = app_metadata.get("role") or user_metadata.get("role") or "student"
        
        if user_id is None or email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication credentials (missing subject or email)."
            )
            
        return CurrentUser(id=user_id, email=email, role=role)
        
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate JWT signature: {str(e)}"
        )

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation restricted to roles: {self.allowed_roles}. Current role: {current_user.role}"
            )
        return current_user

# Role-specific verification dependencies
require_student = RoleChecker(["student"])
require_educator = RoleChecker(["educator"])
require_admin = RoleChecker(["admin"])
require_staff = RoleChecker(["educator", "admin"])
