"""Ingredient analysis endpoints."""
from typing import Annotated, List
from uuid import UUID
from fastapi import APIRouter, Depends, Response, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.logs import IngredientCheck
from app.models.user import Profile
from app.schemas.logs import IngredientAnalyzeRequest, IngredientAnalyzeResult, IngredientCheckResponse
from app.utils.dependencies import CurrentUser
from app.services.ai import get_ai_service

router = APIRouter(prefix="/ingredient", tags=["ingredient"])


@router.post("/analyze", response_model=IngredientAnalyzeResult)
async def analyze_ingredient(
    request: IngredientAnalyzeRequest,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Analyze ingredients using AI."""
    # Get user profile for goal context
    result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = result.scalar_one_or_none()
    
    user_goal = profile.goal_type.value if profile else "maintain"
    
    # Use AI service to analyze
    ai_service = get_ai_service()
    analysis_result = await ai_service.analyze_ingredient(request.text, user_goal)
    
    # Save to database
    check = IngredientCheck(
        user_id=current_user.id,
        raw_input=request.text,
        result_json=analysis_result.model_dump(),
    )
    db.add(check)
    await db.flush()
    
    return analysis_result


@router.get("/checks", response_model=List[IngredientCheckResponse])
async def get_ingredient_checks(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Get ingredient check history."""
    result = await db.execute(
        select(IngredientCheck)
        .where(IngredientCheck.user_id == current_user.id)
        .order_by(IngredientCheck.created_at.desc())
        .limit(50)
    )
    checks = result.scalars().all()

    return checks


@router.delete("/checks/{check_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_ingredient_check(
    check_id: UUID,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Delete an ingredient check entry."""
    result = await db.execute(
        select(IngredientCheck).where(
            IngredientCheck.id == check_id,
            IngredientCheck.user_id == current_user.id,
        )
    )
    check = result.scalar_one_or_none()

    if not check:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ingredient check not found",
        )

    await db.delete(check)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

