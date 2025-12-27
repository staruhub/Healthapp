"""Food logging schemas."""
import uuid
from datetime import date
from typing import List
from pydantic import BaseModel, Field


class FoodItem(BaseModel):
    """Individual food item parsed from natural language."""
    name: str
    portion_assumption: str
    portion_options: List[str] = Field(default_factory=list)
    kcal_min: int = Field(..., ge=0)
    kcal_max: int = Field(..., ge=0)
    notes: str = ""


class FoodParseRequest(BaseModel):
    """Request to parse natural language food input."""
    text: str = Field(..., min_length=1, description="Natural language food description")
    user_goal: str = Field(default="maintain", description="User's health goal")
    meal_type: str = Field(default="snack", description="Meal type: breakfast, lunch, dinner, snack")


class FoodParseResult(BaseModel):
    """Result of food parsing."""
    items: List[FoodItem]
    total_kcal_min: int = Field(..., ge=0)
    total_kcal_max: int = Field(..., ge=0)
    cautions: str = ""


class FoodLogCreate(BaseModel):
    """Create a food log entry."""
    date: date
    raw_input: str
    items: List[FoodItem]
    total_kcal_min: int
    total_kcal_max: int
    cautions: str = ""


class FrontendFoodItem(BaseModel):
    """Frontend-compatible food item format."""
    name: str
    calories_min: int = Field(..., ge=0)
    calories_max: int = Field(..., ge=0)
    portion: str
    meal_type: str = "snack"


class FrontendFoodLogCreate(BaseModel):
    """Frontend-compatible food log create request."""
    date: date
    food_items: List[FrontendFoodItem]


class FoodLogResponse(BaseModel):
    """Food log response."""
    id: uuid.UUID
    user_id: uuid.UUID
    date: date
    raw_input: str
    items_json: dict
    total_kcal_min: int
    total_kcal_max: int
    cautions: str
    
    class Config:
        from_attributes = True

