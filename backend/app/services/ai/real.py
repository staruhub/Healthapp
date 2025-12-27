"""Real AI service using OpenAI API."""
import json
import httpx
from typing import List, Dict, Any
from datetime import date

from app.services.ai.base import BaseAIService
from app.schemas.food import FoodParseResult, FoodItem
from app.schemas.logs import IngredientAnalyzeResult, IngredientVerdict, InsightData


class RealAIService(BaseAIService):
    """Real AI service using OpenAI GPT-4."""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.openai.com/v1/chat/completions"
        self.model = "gpt-4"
        self.timeout = 10.0
    
    async def _call_openai(self, messages: List[Dict[str, str]], temperature: float = 0.7) -> str:
        """Call OpenAI API with retry logic."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            for attempt in range(2):  # Retry once
                try:
                    response = await client.post(self.base_url, headers=headers, json=payload)
                    response.raise_for_status()
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
                except Exception as e:
                    if attempt == 1:  # Last attempt
                        raise ValueError(f"OpenAI API error: {str(e)}")
                    continue
        
        raise ValueError("Failed to get response from OpenAI")
    
    async def parse_food(self, text: str, user_goal: str) -> FoodParseResult:
        """Parse food using OpenAI."""
        prompt = f"""Parse the following food description into structured JSON. User goal: {user_goal}

Food description: {text}

Return ONLY valid JSON in this exact format:
{{
  "items": [
    {{
      "name": "food name",
      "portion_assumption": "description of assumed portion",
      "portion_options": ["0.5x", "1x", "1.5x", "2x"],
      "kcal_min": 100,
      "kcal_max": 150,
      "notes": "estimation notes"
    }}
  ],
  "total_kcal_min": 100,
  "total_kcal_max": 150,
  "cautions": "any warnings or notes"
}}"""
        
        messages = [
            {"role": "system", "content": "You are a nutrition expert. Always respond with valid JSON only."},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_openai(messages, temperature=0.3)
        
        # Parse JSON response
        try:
            data = json.loads(response)
            return FoodParseResult(**data)
        except Exception as e:
            raise ValueError(f"Failed to parse AI response: {str(e)}")
    
    async def analyze_ingredient(self, text: str, user_goal: str) -> IngredientAnalyzeResult:
        """Analyze ingredients using OpenAI."""
        prompt = f"""Analyze these ingredients for someone with goal: {user_goal}

Ingredients: {text}

Return ONLY valid JSON in this exact format:
{{
  "verdict": {{
    "category": "推荐 or 谨慎 or 不推荐",
    "reason": "brief explanation",
    "suggestions": ["suggestion 1", "suggestion 2"]
  }},
  "details": "detailed analysis"
}}"""
        
        messages = [
            {"role": "system", "content": "You are a nutrition expert. Always respond with valid JSON only."},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_openai(messages, temperature=0.3)
        
        try:
            data = json.loads(response)
            return IngredientAnalyzeResult(**data)
        except Exception as e:
            raise ValueError(f"Failed to parse AI response: {str(e)}")
    
    async def generate_insight(
        self,
        date: date,
        food_logs: List[Dict[str, Any]],
        workout_logs: List[Dict[str, Any]],
        body_logs: List[Dict[str, Any]],
        user_profile: Dict[str, Any],
    ) -> InsightData:
        """Generate daily insight using OpenAI."""
        prompt = f"""Generate a daily health insight for {date}.

User profile: {json.dumps(user_profile)}
Food logs: {json.dumps(food_logs)}
Workout logs: {json.dumps(workout_logs)}
Body logs: {json.dumps(body_logs)}

Return ONLY valid JSON in this exact format:
{{
  "gap_summary": "brief summary of progress vs goals",
  "reasons": ["reason 1", "reason 2"],
  "next_actions": ["action 1", "action 2"]
}}"""
        
        messages = [
            {"role": "system", "content": "You are a health coach. Always respond with valid JSON only."},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_openai(messages, temperature=0.5)
        
        try:
            data = json.loads(response)
            return InsightData(**data)
        except Exception as e:
            raise ValueError(f"Failed to parse AI response: {str(e)}")

    async def chat(
        self,
        message: str,
        context: Dict[str, Any],
        history: List[Dict[str, str]],
        user_profile: Dict[str, Any],
    ) -> str:
        """Generate chat response using OpenAI."""
        system_prompt = """You are a helpful health and wellness assistant.

IMPORTANT BOUNDARIES:
- Do NOT provide medical diagnoses
- Do NOT recommend specific medications
- Do NOT replace professional medical advice
- Always suggest consulting healthcare professionals for medical concerns

You CAN help with:
- General nutrition information
- Exercise guidance
- Wellness tips
- Interpreting health data trends
- Answering questions about healthy habits"""

        # Build conversation history
        messages = [{"role": "system", "content": system_prompt}]

        # Add context
        if context:
            context_msg = f"Context: {json.dumps(context)}"
            messages.append({"role": "system", "content": context_msg})

        # Add user profile
        if user_profile:
            profile_msg = f"User profile: {json.dumps(user_profile)}"
            messages.append({"role": "system", "content": profile_msg})

        # Add history
        for msg in history[-5:]:  # Last 5 messages
            messages.append({"role": "user", "content": msg.get("message", "")})
            messages.append({"role": "assistant", "content": msg.get("response", "")})

        # Add current message
        messages.append({"role": "user", "content": message})

        response = await self._call_openai(messages, temperature=0.7)
        return response
