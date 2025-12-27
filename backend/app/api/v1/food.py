"""Food logging endpoints."""
from datetime import date
from typing import Annotated, List
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.logs import FoodLog
from app.models.user import Profile
from app.schemas.food import FoodParseRequest, FoodParseResult, FoodLogCreate, FoodLogResponse, FrontendFoodLogCreate
from app.utils.dependencies import CurrentUser
from app.services.ai import get_ai_service

router = APIRouter(prefix="/food", tags=["food"])


@router.post("/parse")
async def parse_food(
    request: FoodParseRequest,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Parse natural language food input using AI.

    Returns items in frontend-compatible format with calories_min/max and portion.
    """
    # Get user profile for goal context
    result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = result.scalar_one_or_none()

    user_goal = profile.goal_type.value if profile else "maintain"

    # Use AI service to parse food
    ai_service = get_ai_service()
    parse_result = await ai_service.parse_food(request.text, user_goal)

    # Transform to frontend-compatible format
    return [
        {
            "name": item.name,
            "calories_min": item.kcal_min,
            "calories_max": item.kcal_max,
            "portion": item.portion_assumption,
            "meal_type": request.meal_type,
        }
        for item in parse_result.items
    ]


@router.post("/logs", status_code=status.HTTP_201_CREATED)
async def create_food_log(
    log_data: FrontendFoodLogCreate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Create a food log entry.

    Accepts frontend-compatible format with food_items array.
    """
    # Convert frontend format to internal format
    items_json = {
        "items": [
            {
                "name": item.name,
                "kcal_min": item.calories_min,
                "kcal_max": item.calories_max,
                "portion_assumption": item.portion,
                "meal_type": item.meal_type,
            }
            for item in log_data.food_items
        ]
    }

    # Calculate totals
    total_kcal_min = sum(item.calories_min for item in log_data.food_items)
    total_kcal_max = sum(item.calories_max for item in log_data.food_items)

    # Build raw input from item names
    raw_input = ", ".join(item.name for item in log_data.food_items)

    new_log = FoodLog(
        user_id=current_user.id,
        date=log_data.date,
        raw_input=raw_input,
        items_json=items_json,
        total_kcal_min=total_kcal_min,
        total_kcal_max=total_kcal_max,
        cautions="",
    )

    db.add(new_log)
    await db.flush()
    await db.refresh(new_log)

    # Return frontend-compatible format
    return {
        "id": str(new_log.id),
        "user_id": str(new_log.user_id),
        "date": new_log.date.isoformat(),
        "food_items": [
            {
                "name": item.get("name", ""),
                "calories_min": item.get("kcal_min", 0),
                "calories_max": item.get("kcal_max", 0),
                "portion": item.get("portion_assumption", ""),
                "meal_type": item.get("meal_type", "snack"),
            }
            for item in new_log.items_json.get("items", [])
        ],
        "total_calories": new_log.total_kcal_max,
        "created_at": new_log.created_at.isoformat() if new_log.created_at else None,
    }


@router.get("/logs")
async def get_food_logs(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    date: date = Query(None, description="Single date to query"),
    date_from: date = Query(None, description="Start date for range query"),
    date_to: date = Query(None, description="End date for range query"),
):
    """Get food logs for a date or date range.

    Supports two query modes:
    - Single date: ?date=2025-12-26
    - Date range: ?date_from=2025-12-20&date_to=2025-12-26
    """
    # Determine query range
    if date:
        query_from = date
        query_to = date
    elif date_from and date_to:
        query_from = date_from
        query_to = date_to
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must provide either 'date' or both 'date_from' and 'date_to'",
        )

    result = await db.execute(
        select(FoodLog)
        .where(
            FoodLog.user_id == current_user.id,
            FoodLog.date >= query_from,
            FoodLog.date <= query_to,
        )
        .order_by(FoodLog.date.desc(), FoodLog.created_at.desc())
    )
    logs = result.scalars().all()

    # Transform to frontend-compatible format
    return [
        {
            "id": str(log.id),
            "user_id": str(log.user_id),
            "date": log.date.isoformat(),
            "food_items": [
                {
                    "name": item.get("name", ""),
                    "calories_min": item.get("kcal_min", 0),
                    "calories_max": item.get("kcal_max", 0),
                    "portion": item.get("portion_assumption", ""),
                    "meal_type": item.get("meal_type", "snack"),
                }
                for item in log.items_json.get("items", [])
            ],
            "total_calories": log.total_kcal_max,
            "created_at": log.created_at.isoformat() if log.created_at else None,
        }
        for log in logs
    ]


@router.delete("/logs/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_food_log(
    log_id: str,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Delete a food log entry."""
    import uuid
    
    try:
        log_uuid = uuid.UUID(log_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid log ID format",
        )
    
    result = await db.execute(
        select(FoodLog).where(
            FoodLog.id == log_uuid,
            FoodLog.user_id == current_user.id,
        )
    )
    log = result.scalar_one_or_none()
    
    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Food log not found",
        )
    
    await db.delete(log)
    await db.flush()

