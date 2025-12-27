"""Workout tracking endpoints."""
from datetime import date
from typing import Annotated, List
from uuid import UUID
from fastapi import APIRouter, Depends, Query, Response, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.logs import WorkoutLog
from app.schemas.logs import WorkoutLogCreate, WorkoutLogResponse
from app.utils.dependencies import CurrentUser

router = APIRouter(prefix="/workout", tags=["workout"])


@router.post("/logs", response_model=WorkoutLogResponse, status_code=201)
async def create_workout_log(
    log_data: WorkoutLogCreate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Create a workout log entry."""
    new_log = WorkoutLog(
        user_id=current_user.id,
        **log_data.model_dump(),
    )
    
    db.add(new_log)
    await db.flush()
    await db.refresh(new_log)
    
    return new_log


@router.get("/logs", response_model=List[WorkoutLogResponse])
async def get_workout_logs(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    date_from: date = Query(...),
    date_to: date = Query(...),
):
    """Get workout logs for a date range."""
    result = await db.execute(
        select(WorkoutLog)
        .where(
            WorkoutLog.user_id == current_user.id,
            WorkoutLog.date >= date_from,
            WorkoutLog.date <= date_to,
        )
        .order_by(WorkoutLog.date.desc())
    )
    logs = result.scalars().all()

    return logs


@router.delete("/logs/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_workout_log(
    log_id: UUID,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Delete a workout log entry."""
    result = await db.execute(
        select(WorkoutLog).where(
            WorkoutLog.id == log_id,
            WorkoutLog.user_id == current_user.id,
        )
    )
    log = result.scalar_one_or_none()

    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout log not found",
        )

    await db.delete(log)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

