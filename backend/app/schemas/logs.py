"""Logging schemas for body, workout, ingredient, insight, and chat."""
import uuid
from datetime import date
from typing import Optional, List, Any
from pydantic import BaseModel, Field


# Body Logs
class BodyLogCreate(BaseModel):
    """Create a body weight log."""
    date: date
    weight_kg: float = Field(..., gt=0)
    notes: Optional[str] = None


class BodyLogResponse(BaseModel):
    """Body log response."""
    id: uuid.UUID
    user_id: uuid.UUID
    date: date
    weight_kg: float
    notes: Optional[str]
    
    class Config:
        from_attributes = True


# Workout Logs
class WorkoutLogCreate(BaseModel):
    """Create a workout log."""
    date: date
    workout_type: str = Field(..., min_length=1)
    duration_minutes: int = Field(..., gt=0)
    notes: Optional[str] = None


class WorkoutLogResponse(BaseModel):
    """Workout log response."""
    id: uuid.UUID
    user_id: uuid.UUID
    date: date
    workout_type: str
    duration_minutes: int
    notes: Optional[str]
    
    class Config:
        from_attributes = True


# Ingredient Analysis
class IngredientAnalyzeRequest(BaseModel):
    """Request to analyze ingredients."""
    text: str = Field(..., min_length=1)
    user_goal: str = Field(default="maintain")


class IngredientVerdict(BaseModel):
    """Ingredient analysis verdict."""
    category: str  # "推荐", "谨慎", "不推荐"
    reason: str
    suggestions: List[str] = Field(default_factory=list)


class IngredientAnalyzeResult(BaseModel):
    """Result of ingredient analysis."""
    verdict: IngredientVerdict
    details: str = ""


class IngredientCheckResponse(BaseModel):
    """Ingredient check response."""
    id: uuid.UUID
    user_id: uuid.UUID
    raw_input: str
    result_json: dict
    
    class Config:
        from_attributes = True


# Daily Insights
class InsightGenerateRequest(BaseModel):
    """Request to generate daily insight."""
    date: date


class InsightData(BaseModel):
    """Daily insight data."""
    gap_summary: str
    reasons: List[str]
    next_actions: List[str]


class InsightResponse(BaseModel):
    """Insight response."""
    id: uuid.UUID
    user_id: uuid.UUID
    date: date
    insight_json: dict
    
    class Config:
        from_attributes = True


# Chat
class ChatMessageRequest(BaseModel):
    """Chat message request."""
    message: str = Field(..., min_length=1)
    context: Optional[dict] = None  # page, date, etc.


class ChatMessageResponse(BaseModel):
    """Chat message response."""
    response: str
    
    class Config:
        from_attributes = True


class ChatHistoryResponse(BaseModel):
    """Chat history item."""
    id: uuid.UUID
    message: str
    response: str
    context_json: Optional[dict]
    
    class Config:
        from_attributes = True

