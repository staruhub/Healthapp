"""User profile schemas."""
import uuid
from typing import Optional
from pydantic import BaseModel, Field
from app.models.user import GoalType, ActivityLevel


class ProfileCreate(BaseModel):
    """Profile creation request."""
    goal_type: GoalType
    height_cm: float = Field(..., gt=0, description="Height in centimeters")
    start_weight_kg: float = Field(..., gt=0, description="Starting weight in kilograms")
    target_weight_kg: Optional[float] = Field(None, gt=0, description="Target weight in kilograms")
    activity_level: ActivityLevel
    age: Optional[int] = Field(None, gt=0, le=150)
    gender: Optional[str] = None


class ProfileUpdate(BaseModel):
    """Profile update request."""
    goal_type: Optional[GoalType] = None
    height_cm: Optional[float] = Field(None, gt=0)
    target_weight_kg: Optional[float] = Field(None, gt=0)
    activity_level: Optional[ActivityLevel] = None
    age: Optional[int] = Field(None, gt=0, le=150)
    gender: Optional[str] = None


class ProfileResponse(BaseModel):
    """Profile response."""
    id: uuid.UUID
    user_id: uuid.UUID
    goal_type: GoalType
    height_cm: float
    start_weight_kg: float
    target_weight_kg: Optional[float]
    activity_level: ActivityLevel
    age: Optional[int]
    gender: Optional[str]
    
    class Config:
        from_attributes = True

