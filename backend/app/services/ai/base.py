"""Base AI service interface."""
from abc import ABC, abstractmethod
from typing import List, Dict, Any
from datetime import date

from app.schemas.food import FoodParseResult
from app.schemas.logs import IngredientAnalyzeResult, InsightData


class BaseAIService(ABC):
    """Abstract base class for AI services."""
    
    @abstractmethod
    async def parse_food(self, text: str, user_goal: str) -> FoodParseResult:
        """Parse natural language food input into structured items.
        
        Args:
            text: Natural language food description
            user_goal: User's health goal (cut/bulk/gain/maintain)
            
        Returns:
            FoodParseResult with structured food items and calorie ranges
        """
        pass
    
    @abstractmethod
    async def analyze_ingredient(self, text: str, user_goal: str) -> IngredientAnalyzeResult:
        """Analyze ingredient list or nutrition label.
        
        Args:
            text: Ingredient list or nutrition label text
            user_goal: User's health goal
            
        Returns:
            IngredientAnalyzeResult with verdict and suggestions
        """
        pass
    
    @abstractmethod
    async def generate_insight(
        self,
        date: date,
        food_logs: List[Dict[str, Any]],
        workout_logs: List[Dict[str, Any]],
        body_logs: List[Dict[str, Any]],
        user_profile: Dict[str, Any],
    ) -> InsightData:
        """Generate daily insight based on user's logs.
        
        Args:
            date: Date for the insight
            food_logs: List of food logs for the day
            workout_logs: List of workout logs for the day
            body_logs: List of body logs for the day
            user_profile: User's profile data
            
        Returns:
            InsightData with gap summary, reasons, and next actions
        """
        pass
    
    @abstractmethod
    async def chat(
        self,
        message: str,
        context: Dict[str, Any],
        history: List[Dict[str, str]],
        user_profile: Dict[str, Any],
    ) -> str:
        """Generate chat response.
        
        Args:
            message: User's message
            context: Context data (page, date, etc.)
            history: Previous chat messages
            user_profile: User's profile data
            
        Returns:
            AI response string
        """
        pass

