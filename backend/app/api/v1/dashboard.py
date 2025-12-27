"""Dashboard data endpoints."""
from datetime import date, timedelta
from typing import Annotated, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from pydantic import BaseModel

from app.database import get_db
from app.models.logs import BodyLog, FoodLog, WorkoutLog, Insight
from app.utils.dependencies import CurrentUser

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


class WeightTrendPoint(BaseModel):
    """Weight trend data point."""
    date: date
    weight_kg: float


class WeightTrendResponse(BaseModel):
    """Weight trend response."""
    data: List[WeightTrendPoint]
    period_days: int


class CompletionRateResponse(BaseModel):
    """Completion rate response."""
    rate: float  # 0.0 to 1.0
    days_logged: int
    total_days: int


class WeeklyInsightResponse(BaseModel):
    """Weekly insight summary."""
    summary: str
    avg_calories: int
    workout_days: int


class DashboardResponse(BaseModel):
    """Unified dashboard response."""
    weight_trends: List[dict]  # [{date: str, weight: float}]
    completion_rate: dict  # {calories: float, workouts: int}
    weekly_insights: List[str]


@router.get("", response_model=DashboardResponse)
async def get_dashboard(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    days: int = Query(7, ge=1, le=90, description="Number of days to include"),
):
    """Get unified dashboard data."""
    end_date = date.today()
    start_date = end_date - timedelta(days=days - 1)

    # Weight trends
    weight_result = await db.execute(
        select(BodyLog)
        .where(
            BodyLog.user_id == current_user.id,
            BodyLog.date >= start_date,
            BodyLog.date <= end_date,
        )
        .order_by(BodyLog.date.asc())
    )
    weight_logs = weight_result.scalars().all()
    weight_trends = [
        {"date": log.date.isoformat(), "weight": log.weight_kg}
        for log in weight_logs
    ]

    # Completion rate - count days with food logs
    food_days_result = await db.execute(
        select(func.count(func.distinct(FoodLog.date)))
        .where(
            FoodLog.user_id == current_user.id,
            FoodLog.date >= start_date,
            FoodLog.date <= end_date,
        )
    )
    food_days_logged = food_days_result.scalar() or 0
    calories_rate = food_days_logged / days if days > 0 else 0.0

    # Count workout days
    workout_days_result = await db.execute(
        select(func.count(func.distinct(WorkoutLog.date)))
        .where(
            WorkoutLog.user_id == current_user.id,
            WorkoutLog.date >= start_date,
            WorkoutLog.date <= end_date,
        )
    )
    workout_days = workout_days_result.scalar() or 0

    # Get food logs for weekly insight
    food_result = await db.execute(
        select(FoodLog)
        .where(
            FoodLog.user_id == current_user.id,
            FoodLog.date >= start_date,
            FoodLog.date <= end_date,
        )
    )
    food_logs = food_result.scalars().all()
    total_calories = sum(log.total_kcal_max for log in food_logs)
    avg_calories = int(total_calories / days) if food_logs else 0

    weekly_insights = [
        f"本周记录了 {len(food_logs)} 餐，平均每日 {avg_calories} kcal",
        f"运动天数: {workout_days} 天",
        f"记录完成率: {int(calories_rate * 100)}%",
    ]

    return DashboardResponse(
        weight_trends=weight_trends,
        completion_rate={"calories": calories_rate, "workouts": workout_days},
        weekly_insights=weekly_insights,
    )


@router.get("/weight-trend", response_model=WeightTrendResponse)
async def get_weight_trend(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    days: int = Query(7, ge=1, le=90, description="Number of days to include"),
):
    """Get weight trend data."""
    end_date = date.today()
    start_date = end_date - timedelta(days=days - 1)
    
    result = await db.execute(
        select(BodyLog)
        .where(
            BodyLog.user_id == current_user.id,
            BodyLog.date >= start_date,
            BodyLog.date <= end_date,
        )
        .order_by(BodyLog.date.asc())
    )
    logs = result.scalars().all()
    
    data = [
        WeightTrendPoint(date=log.date, weight_kg=log.weight_kg)
        for log in logs
    ]
    
    return WeightTrendResponse(data=data, period_days=days)


@router.get("/completion-rate", response_model=CompletionRateResponse)
async def get_completion_rate(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    days: int = Query(7, ge=1, le=90),
):
    """Get logging completion rate."""
    end_date = date.today()
    start_date = end_date - timedelta(days=days - 1)
    
    # Count days with food logs
    result = await db.execute(
        select(func.count(func.distinct(FoodLog.date)))
        .where(
            FoodLog.user_id == current_user.id,
            FoodLog.date >= start_date,
            FoodLog.date <= end_date,
        )
    )
    days_logged = result.scalar() or 0
    
    rate = days_logged / days if days > 0 else 0.0
    
    return CompletionRateResponse(
        rate=rate,
        days_logged=days_logged,
        total_days=days,
    )


@router.get("/weekly-insight", response_model=WeeklyInsightResponse)
async def get_weekly_insight(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Get weekly summary insight."""
    end_date = date.today()
    start_date = end_date - timedelta(days=6)
    
    # Get food logs
    food_result = await db.execute(
        select(FoodLog)
        .where(
            FoodLog.user_id == current_user.id,
            FoodLog.date >= start_date,
            FoodLog.date <= end_date,
        )
    )
    food_logs = food_result.scalars().all()
    
    # Calculate average calories
    total_calories = sum(log.total_kcal_max for log in food_logs)
    avg_calories = int(total_calories / 7) if food_logs else 0
    
    # Count workout days
    workout_result = await db.execute(
        select(func.count(func.distinct(WorkoutLog.date)))
        .where(
            WorkoutLog.user_id == current_user.id,
            WorkoutLog.date >= start_date,
            WorkoutLog.date <= end_date,
        )
    )
    workout_days = workout_result.scalar() or 0
    
    summary = f"This week: {len(food_logs)} meals logged, averaging {avg_calories} kcal/day"
    
    return WeeklyInsightResponse(
        summary=summary,
        avg_calories=avg_calories,
        workout_days=workout_days,
    )

