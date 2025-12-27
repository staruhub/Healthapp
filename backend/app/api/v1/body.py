"""Body tracking endpoints."""
from datetime import date
from typing import Annotated, List
from uuid import UUID
from fastapi import APIRouter, Depends, Query, Response, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.logs import BodyLog
from app.schemas.logs import BodyLogCreate, BodyLogResponse
from app.utils.dependencies import CurrentUser

router = APIRouter(prefix="/body", tags=["body"])


@router.post("/logs", response_model=BodyLogResponse, status_code=201)
async def create_body_log(
    log_data: BodyLogCreate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Create a body weight log entry."""
    new_log = BodyLog(
        user_id=current_user.id,
        **log_data.model_dump(),
    )
    
    db.add(new_log)
    await db.flush()
    await db.refresh(new_log)
    
    return new_log


@router.get("/logs", response_model=List[BodyLogResponse])
async def get_body_logs(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    date_from: date = Query(...),
    date_to: date = Query(...),
):
    """Get body logs for a date range."""
    result = await db.execute(
        select(BodyLog)
        .where(
            BodyLog.user_id == current_user.id,
            BodyLog.date >= date_from,
            BodyLog.date <= date_to,
        )
        .order_by(BodyLog.date.desc())
    )
    logs = result.scalars().all()

    return logs


@router.delete("/logs/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_body_log(
    log_id: UUID,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Delete a body log entry."""
    result = await db.execute(
        select(BodyLog).where(
            BodyLog.id == log_id,
            BodyLog.user_id == current_user.id,
        )
    )
    log = result.scalar_one_or_none()

    if not log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Body log not found",
        )

    await db.delete(log)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

