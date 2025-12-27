"""Daily insights endpoints."""
from datetime import date
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.logs import Insight, FoodLog, WorkoutLog, BodyLog
from app.models.user import Profile
from app.schemas.logs import InsightGenerateRequest, InsightResponse
from app.utils.dependencies import CurrentUser
from app.services.ai import get_ai_service

router = APIRouter(prefix="/insight", tags=["insight"])


@router.post("/generate", response_model=InsightResponse, status_code=201)
async def generate_insight(
    request: InsightGenerateRequest,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Generate daily insight using AI."""
    # Get user profile
    profile_result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = profile_result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found. Please complete onboarding first.",
        )
    
    # Get logs for the day
    food_result = await db.execute(
        select(FoodLog).where(
            FoodLog.user_id == current_user.id,
            FoodLog.date == request.date,
        )
    )
    food_logs = [
        {
            "raw_input": log.raw_input,
            "total_kcal_min": log.total_kcal_min,
            "total_kcal_max": log.total_kcal_max,
        }
        for log in food_result.scalars().all()
    ]
    
    workout_result = await db.execute(
        select(WorkoutLog).where(
            WorkoutLog.user_id == current_user.id,
            WorkoutLog.date == request.date,
        )
    )
    workout_logs = [
        {
            "workout_type": log.workout_type,
            "duration_minutes": log.duration_minutes,
        }
        for log in workout_result.scalars().all()
    ]
    
    body_result = await db.execute(
        select(BodyLog).where(
            BodyLog.user_id == current_user.id,
            BodyLog.date == request.date,
        )
    )
    body_logs = [
        {"weight_kg": log.weight_kg}
        for log in body_result.scalars().all()
    ]
    
    # Prepare user profile data
    user_profile = {
        "goal_type": profile.goal_type.value,
        "height_cm": profile.height_cm,
        "start_weight_kg": profile.start_weight_kg,
        "activity_level": profile.activity_level.value,
    }
    
    # Generate insight using AI
    ai_service = get_ai_service()
    insight_data = await ai_service.generate_insight(
        date=request.date,
        food_logs=food_logs,
        workout_logs=workout_logs,
        body_logs=body_logs,
        user_profile=user_profile,
    )
    
    # Save insight
    insight = Insight(
        user_id=current_user.id,
        date=request.date,
        insight_json=insight_data.model_dump(),
    )
    db.add(insight)
    await db.flush()
    await db.refresh(insight)
    
    return insight


@router.get("/daily", response_model=InsightResponse)
async def get_daily_insight(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    date: date = Query(...),
):
    """Get insight for a specific date."""
    result = await db.execute(
        select(Insight).where(
            Insight.user_id == current_user.id,
            Insight.date == date,
        )
    )
    insight = result.scalar_one_or_none()
    
    if not insight:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Insight not found for this date",
        )
    
    return insight

