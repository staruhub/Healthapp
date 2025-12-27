# Fix Backend Spec Compliance Tasks

## 1. Bug 修复
- [x] 1.1 修复 `backend/app/api/v1/dashboard.py:127` - 将 `FoodLog` 改为 `WorkoutLog`

## 2. 实现删除端点

### 2.1 Body Logs 删除
- [x] 2.1.1 在 `body.py` 添加 `DELETE /api/v1/body/logs/{log_id}` 端点
- [x] 2.1.2 验证用户只能删除自己的记录 (user_id 检查)
- [x] 2.1.3 返回 204 No Content 或 404 Not Found

### 2.2 Workout Logs 删除
- [x] 2.2.1 在 `workout.py` 添加 `DELETE /api/v1/workout/logs/{log_id}` 端点
- [x] 2.2.2 验证用户只能删除自己的记录 (user_id 检查)
- [x] 2.2.3 返回 204 No Content 或 404 Not Found

### 2.3 Ingredient Checks 删除
- [x] 2.3.1 在 `ingredient.py` 添加 `DELETE /api/v1/ingredient/checks/{check_id}` 端点
- [x] 2.3.2 验证用户只能删除自己的记录 (user_id 检查)
- [x] 2.3.3 返回 204 No Content 或 404 Not Found

## 3. 实现聊天斜杠命令

### 3.1 斜杠命令解析
- [x] 3.1.1 在 `chat.py` 添加斜杠命令检测逻辑
- [x] 3.1.2 解析命令和参数

### 3.2 /analyze_today 命令
- [x] 3.2.1 调用 insight 服务生成今日洞察
- [x] 3.2.2 返回结构化洞察结果

### 3.3 /ingredient 命令
- [x] 3.3.1 解析命令后的成分文本
- [x] 3.3.2 调用 ingredient analysis 服务
- [x] 3.3.3 返回结构化分析结果

### 3.4 未知命令处理
- [x] 3.4.1 返回帮助信息列出可用命令

## 4. 验证
- [x] 4.1 手动测试所有新端点
- [x] 4.2 验证 dashboard bug 已修复
- [x] 4.3 验证斜杠命令正常工作
