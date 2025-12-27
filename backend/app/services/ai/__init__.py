"""AI service abstraction."""
from app.services.ai.base import BaseAIService
from app.services.ai.mock import MockAIService
from app.services.ai.real import RealAIService
from app.config import settings


def get_ai_service() -> BaseAIService:
    """Factory function to get AI service based on configuration."""
    if settings.AI_MODE == "mock":
        return MockAIService()
    else:
        return RealAIService(api_key=settings.OPENAI_API_KEY or settings.ANTHROPIC_API_KEY)


__all__ = ["BaseAIService", "MockAIService", "RealAIService", "get_ai_service"]

