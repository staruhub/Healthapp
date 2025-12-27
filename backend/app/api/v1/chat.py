"""Chat assistant endpoints."""
from datetime import date
from typing import Annotated, List, Optional, Tuple
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.logs import ChatLog, FoodLog, WorkoutLog, BodyLog
from app.models.user import Profile
from app.schemas.logs import ChatMessageRequest, ChatMessageResponse, ChatHistoryResponse
from app.utils.dependencies import CurrentUser
from app.services.ai import get_ai_service

router = APIRouter(prefix="/chat", tags=["chat"])

# Slash command constants
AVAILABLE_COMMANDS = {
    "/analyze_today": "分析今日饮食摄入情况",
    "/ingredient": "分析配料表 (用法: /ingredient <配料文本>)",
}


def parse_slash_command(message: str) -> Tuple[Optional[str], Optional[str]]:
    """Parse slash command from message.

    Returns (command, args) tuple. Both are None if not a command.
    """
    message = message.strip()
    if not message.startswith("/"):
        return None, None

    parts = message.split(maxsplit=1)
    command = parts[0].lower()
    args = parts[1] if len(parts) > 1 else None

    return command, args


async def handle_analyze_today(
    current_user,
    db: AsyncSession,
    user_profile: dict,
) -> str:
    """Handle /analyze_today command."""
    today = date.today()

    # Get today's food logs
    food_result = await db.execute(
        select(FoodLog).where(
            FoodLog.user_id == current_user.id,
            FoodLog.date == today,
        )
    )
    food_logs = food_result.scalars().all()

    if not food_logs:
        return "今日暂无饮食记录。请先记录您的饮食，然后再使用此命令分析。"

    # Calculate totals
    total_min = sum(log.total_kcal_min for log in food_logs)
    total_max = sum(log.total_kcal_max for log in food_logs)

    # Get workout logs
    workout_result = await db.execute(
        select(WorkoutLog).where(
            WorkoutLog.user_id == current_user.id,
            WorkoutLog.date == today,
        )
    )
    workout_logs = workout_result.scalars().all()

    # Build response
    goal_type = user_profile.get("goal_type", "maintain")
    goal_text = {
        "cut": "减脂",
        "bulk": "增肌",
        "gain": "增重",
        "maintain": "维持体重",
    }.get(goal_type, "维持体重")

    response_parts = [
        f"📊 **今日饮食分析** ({today.strftime('%Y-%m-%d')})",
        "",
        f"🍽️ **已记录餐次**: {len(food_logs)} 餐",
        f"🔥 **估计摄入热量**: {total_min}-{total_max} kcal",
    ]

    if workout_logs:
        total_workout = sum(log.duration_minutes for log in workout_logs)
        response_parts.append(f"💪 **运动时长**: {total_workout} 分钟")
    else:
        response_parts.append("💪 **运动**: 今日暂无运动记录")

    response_parts.extend([
        "",
        f"🎯 **您的目标**: {goal_text}",
        "",
        "💡 *提示: 这只是估算值，实际热量可能因份量和烹饪方式有所不同。*",
    ])

    return "\n".join(response_parts)


async def handle_ingredient_command(
    args: Optional[str],
    current_user,
    db: AsyncSession,
    user_profile: dict,
) -> str:
    """Handle /ingredient command."""
    if not args or not args.strip():
        return "请提供配料表文本。用法: `/ingredient <配料文本>`\n\n例如: `/ingredient 水, 白砂糖, 食用盐, 柠檬酸`"

    # Get user goal
    user_goal = user_profile.get("goal_type", "maintain")

    # Use AI service to analyze
    ai_service = get_ai_service()
    try:
        analysis_result = await ai_service.analyze_ingredient(args.strip(), user_goal)

        # Format response
        verdict_emoji = {
            "recommend": "✅",
            "caution": "⚠️",
            "avoid": "❌",
        }.get(analysis_result.verdict, "❓")

        verdict_text = {
            "recommend": "推荐",
            "caution": "谨慎",
            "avoid": "不推荐",
        }.get(analysis_result.verdict, "未知")

        response_parts = [
            f"🔍 **配料分析结果**",
            "",
            f"{verdict_emoji} **结论**: {verdict_text}",
            "",
            "**分析理由**:",
        ]

        for reason in analysis_result.reasons:
            response_parts.append(f"- {reason}")

        if analysis_result.suggestions:
            response_parts.append("")
            response_parts.append("**建议**:")
            for suggestion in analysis_result.suggestions:
                response_parts.append(f"- {suggestion}")

        response_parts.extend([
            "",
            "⚠️ *免责声明: 此分析仅供参考，不构成医疗或营养建议。*",
        ])

        return "\n".join(response_parts)
    except Exception as e:
        return f"配料分析失败: {str(e)}"


def get_help_message() -> str:
    """Get help message for unknown commands."""
    lines = ["❓ **未知命令**", "", "可用命令:"]
    for cmd, desc in AVAILABLE_COMMANDS.items():
        lines.append(f"- `{cmd}` - {desc}")
    return "\n".join(lines)


@router.post("/message", response_model=ChatMessageResponse)
async def send_message(
    request: ChatMessageRequest,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Send a chat message and get AI response."""
    # Get user profile
    profile_result = await db.execute(select(Profile).where(Profile.user_id == current_user.id))
    profile = profile_result.scalar_one_or_none()

    user_profile = {}
    if profile:
        user_profile = {
            "goal_type": profile.goal_type.value,
            "height_cm": profile.height_cm,
            "activity_level": profile.activity_level.value,
        }

    # Check for slash commands
    command, args = parse_slash_command(request.message)

    if command:
        # Handle slash commands
        if command == "/analyze_today":
            response = await handle_analyze_today(current_user, db, user_profile)
        elif command == "/ingredient":
            response = await handle_ingredient_command(args, current_user, db, user_profile)
        else:
            response = get_help_message()
    else:
        # Regular chat - get recent chat history
        history_result = await db.execute(
            select(ChatLog)
            .where(ChatLog.user_id == current_user.id)
            .order_by(ChatLog.created_at.desc())
            .limit(10)
        )
        history_logs = history_result.scalars().all()
        history = [
            {"message": log.message, "response": log.response}
            for log in reversed(list(history_logs))
        ]

        # Generate AI response
        ai_service = get_ai_service()
        response = await ai_service.chat(
            message=request.message,
            context=request.context or {},
            history=history,
            user_profile=user_profile,
        )

    # Save chat log
    chat_log = ChatLog(
        user_id=current_user.id,
        message=request.message,
        response=response,
        context_json=request.context,
    )
    db.add(chat_log)
    await db.flush()

    return ChatMessageResponse(response=response)


@router.get("/history", response_model=List[ChatHistoryResponse])
async def get_chat_history(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    """Get chat history."""
    result = await db.execute(
        select(ChatLog)
        .where(ChatLog.user_id == current_user.id)
        .order_by(ChatLog.created_at.desc())
        .limit(50)
    )
    logs = result.scalars().all()
    
    return logs

