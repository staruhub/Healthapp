"""Mock AI service for development and testing."""
import random
from typing import List, Dict, Any
from datetime import date

from app.services.ai.base import BaseAIService
from app.schemas.food import FoodParseResult, FoodItem
from app.schemas.logs import IngredientAnalyzeResult, IngredientVerdict, InsightData


class MockAIService(BaseAIService):
    """Mock AI service with keyword-based pattern matching."""
    
    # Common food items with calorie ranges (per typical portion)
    FOOD_DATABASE = {
        "鸡蛋": (60, 80, "medium egg ~50g"),
        "红薯": (100, 150, "medium sweet potato ~150g"),
        "米饭": (150, 200, "1 bowl ~150g"),
        "鸡胸肉": (150, 200, "100g"),
        "牛肉": (200, 250, "100g"),
        "苹果": (50, 80, "medium apple ~150g"),
        "香蕉": (80, 120, "medium banana ~120g"),
        "面包": (200, 300, "2 slices ~80g"),
        "牛奶": (100, 150, "1 cup ~250ml"),
        "酸奶": (80, 120, "1 cup ~200g"),
    }
    
    async def parse_food(self, text: str, user_goal: str) -> FoodParseResult:
        """Parse food using keyword matching."""
        items = []
        total_min = 0
        total_max = 0
        
        # Simple keyword extraction
        for food_name, (kcal_min, kcal_max, portion) in self.FOOD_DATABASE.items():
            if food_name in text:
                # Extract quantity if present
                quantity = 1
                for word in text.split():
                    if word.isdigit():
                        quantity = int(word)
                        break
                    elif word in ["一个", "一碗", "一杯"]:
                        quantity = 1
                    elif word in ["两个", "两碗"]:
                        quantity = 2
                
                item = FoodItem(
                    name=food_name,
                    portion_assumption=f"{quantity}x {portion}",
                    portion_options=["0.5x", "1x", "1.5x", "2x"],
                    kcal_min=kcal_min * quantity,
                    kcal_max=kcal_max * quantity,
                    notes=f"Estimated based on typical {portion}"
                )
                items.append(item)
                total_min += item.kcal_min
                total_max += item.kcal_max
        
        # If no matches, create a generic item
        if not items:
            items.append(FoodItem(
                name="Mixed meal",
                portion_assumption="1 serving",
                portion_options=["0.5x", "1x", "1.5x", "2x"],
                kcal_min=200,
                kcal_max=400,
                notes="Generic estimate - please adjust portion"
            ))
            total_min = 200
            total_max = 400
        
        cautions = ""
        if user_goal == "cut" and total_max > 500:
            cautions = "High calorie meal for weight loss goal. Consider smaller portions."
        
        return FoodParseResult(
            items=items,
            total_kcal_min=total_min,
            total_kcal_max=total_max,
            cautions=cautions
        )
    
    async def analyze_ingredient(self, text: str, user_goal: str) -> IngredientAnalyzeResult:
        """Analyze ingredients using keyword matching."""
        text_lower = text.lower()
        
        # Simple keyword-based analysis
        bad_keywords = ["糖", "sugar", "油", "oil", "盐", "salt", "添加剂", "additive"]
        good_keywords = ["蛋白", "protein", "纤维", "fiber", "维生素", "vitamin"]
        
        bad_count = sum(1 for kw in bad_keywords if kw in text_lower)
        good_count = sum(1 for kw in good_keywords if kw in text_lower)
        
        if bad_count > good_count:
            category = "谨慎"
            reason = "Contains ingredients that may not align with your health goals"
            suggestions = ["Look for alternatives with less sugar/salt", "Check portion sizes"]
        elif good_count > 0:
            category = "推荐"
            reason = "Contains beneficial nutrients aligned with your goals"
            suggestions = ["Good choice for your health goals", "Maintain moderate portions"]
        else:
            category = "谨慎"
            reason = "Unable to determine nutritional value from ingredients"
            suggestions = ["Consult nutrition label", "Consider whole food alternatives"]
        
        verdict = IngredientVerdict(
            category=category,
            reason=reason,
            suggestions=suggestions
        )
        
        return IngredientAnalyzeResult(
            verdict=verdict,
            details=f"Analysis based on ingredient keywords. Goal: {user_goal}"
        )

    async def generate_insight(
        self,
        date: date,
        food_logs: List[Dict[str, Any]],
        workout_logs: List[Dict[str, Any]],
        body_logs: List[Dict[str, Any]],
        user_profile: Dict[str, Any],
    ) -> InsightData:
        """Generate mock daily insight."""
        total_calories = sum(log.get("total_kcal_max", 0) for log in food_logs)
        workout_minutes = sum(log.get("duration_minutes", 0) for log in workout_logs)
        goal = user_profile.get("goal_type", "maintain")

        # Simple goal-based analysis
        target_calories = {
            "cut": 1800,
            "maintain": 2200,
            "bulk": 2800,
            "gain": 2800,
        }.get(goal, 2200)

        gap = target_calories - total_calories

        if abs(gap) < 200:
            gap_summary = f"Great job! You're on track with your {goal} goal."
            reasons = [
                f"Consumed ~{total_calories} kcal (target: {target_calories})",
                f"Completed {workout_minutes} minutes of exercise" if workout_minutes > 0 else "No exercise logged today"
            ]
            next_actions = ["Keep up the good work!", "Stay consistent tomorrow"]
        elif gap > 0:
            gap_summary = f"You're {gap} kcal below your target for {goal}."
            reasons = [
                f"Only consumed {total_calories} kcal (target: {target_calories})",
                "May need more protein/carbs to meet goals"
            ]
            next_actions = [
                "Add a protein-rich snack",
                "Consider a balanced meal to reach target"
            ]
        else:
            gap_summary = f"You're {abs(gap)} kcal above your target for {goal}."
            reasons = [
                f"Consumed {total_calories} kcal (target: {target_calories})",
                "Higher intake than planned"
            ]
            next_actions = [
                "Adjust portions tomorrow",
                "Increase physical activity"
            ]

        return InsightData(
            gap_summary=gap_summary,
            reasons=reasons,
            next_actions=next_actions
        )

    async def chat(
        self,
        message: str,
        context: Dict[str, Any],
        history: List[Dict[str, str]],
        user_profile: Dict[str, Any],
    ) -> str:
        """Generate mock chat response."""
        message_lower = message.lower()

        # Simple keyword-based responses
        if any(kw in message_lower for kw in ["hello", "hi", "你好"]):
            return "Hello! I'm your health assistant. How can I help you today?"

        elif any(kw in message_lower for kw in ["calorie", "卡路里", "热量"]):
            return "Calorie needs vary based on your goals. For weight loss, aim for a 300-500 calorie deficit. For muscle gain, a 300-500 surplus. Always prioritize whole foods and adequate protein!"

        elif any(kw in message_lower for kw in ["protein", "蛋白质"]):
            return "Aim for 1.6-2.2g of protein per kg of body weight for muscle building, or 1.2-1.6g for general health. Good sources include chicken, fish, eggs, tofu, and legumes."

        elif any(kw in message_lower for kw in ["workout", "exercise", "运动"]):
            return "For best results, combine resistance training 3-4x/week with cardio 2-3x/week. Rest days are important for recovery!"

        elif any(kw in message_lower for kw in ["weight", "体重"]):
            return "Healthy weight loss is 0.5-1kg per week. Weight fluctuates daily due to water retention, so focus on weekly trends rather than daily changes."

        else:
            return f"I understand you're asking about: '{message}'. As a health assistant, I can help with nutrition, exercise, and wellness questions. Please note: I cannot provide medical diagnoses or replace professional medical advice."

