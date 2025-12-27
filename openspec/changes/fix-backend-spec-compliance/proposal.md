# Fix Backend Spec Compliance

## Why

后端代码审查发现多处未按规范实现的问题：

1. **Bug**: 仪表板 `get_weekly_insight()` 函数在计算 `workout_days` 时错误地查询了 `FoodLog` 而非 `WorkoutLog`，导致锻炼天数统计不正确
2. **缺失实现**: Body/Workout 删除端点未实现（规范 `body-tracking/spec.md` "Data Deletion" requirement 已定义）
3. **缺失实现**: 聊天斜杠命令未实现（规范 `ai-chat/spec.md` "Quick Commands" requirement 已定义）

这些问题导致后端实现与已批准的规范不一致。

## What Changes

### Bug 修复
- **dashboard.py:127**: 修复 `get_weekly_insight()` 中的 WorkoutLog 查询错误

### 实现已定义规范
- **body.py**: 添加 `DELETE /api/v1/body/logs/{log_id}` 端点
- **workout.py**: 添加 `DELETE /api/v1/workout/logs/{log_id}` 端点
- **ingredient.py**: 添加 `DELETE /api/v1/ingredient/checks/{check_id}` 端点
- **chat.py**: 实现斜杠命令处理 (`/analyze_today`, `/ingredient`)

## Impact

### Affected Specs
无需修改规范 - 规范已正确定义，仅需修复实现

### Affected Code
| 文件 | 修改类型 |
|------|----------|
| `backend/app/api/v1/dashboard.py` | Bug 修复 (FoodLog → WorkoutLog) |
| `backend/app/api/v1/body.py` | 添加删除端点 |
| `backend/app/api/v1/workout.py` | 添加删除端点 |
| `backend/app/api/v1/ingredient.py` | 添加删除端点 |
| `backend/app/api/v1/chat.py` | 实现斜杠命令 |

### Migration Path
1. 修复 dashboard bug
2. 添加删除端点（遵循现有模式）
3. 实现斜杠命令（集成现有 AI 服务）
4. 验证所有修改符合规范

### Risk Assessment
- **低风险**: 所有修改都是增量性的，不影响现有功能
- **向后兼容**: 删除端点是新增 API，不影响现有客户端
- **测试覆盖**: 需要添加相应的 API 测试
