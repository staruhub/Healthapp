"""Authentication schemas."""
import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    """User registration request."""
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")


class UserLogin(BaseModel):
    """User login request."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 1800  # 30 minutes in seconds


class RefreshTokenRequest(BaseModel):
    """Refresh token request."""
    refresh_token: str


class UserResponse(BaseModel):
    """User response."""
    id: uuid.UUID
    email: str
    is_active: bool
    profile_completed: bool = False

    class Config:
        from_attributes = True


class ProfileData(BaseModel):
    """User profile data."""
    name: str
    age: Optional[int] = None
    gender: Optional[str] = None
    height: Optional[float] = None
    weight: Optional[float] = None
    goal: str = "maintain"
    target_calories: Optional[int] = None


class UserWithProfileResponse(BaseModel):
    """User response with profile data."""
    id: uuid.UUID
    email: str
    name: str = ""
    profile: Optional[ProfileData] = None
    created_at: datetime

    class Config:
        from_attributes = True
