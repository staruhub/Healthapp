# Fix E2E Integration Issues Tasks

## 1. 修复 API 字段名不匹配 (P0)

### 1.1 修复 Body Logs API
- [x] 1.1.1 更新 `frontend/types/api.ts` 中 `BodyLog` 类型：`weight` → `weight_kg`
- [x] 1.1.2 更新 `frontend/hooks/use-body-logs.ts` 中 `useAddBodyLog`：发送 `weight_kg` 字段
- [x] 1.1.3 更新 `frontend/hooks/use-body-logs.ts` 中 `useBodyLogs`：参数名 `start_date/end_date` → `date_from/date_to`
- [x] 1.1.4 更新 `frontend/app/(main)/body/page.tsx` 中图表数据映射：`log.weight` → `log.weight_kg`

### 1.2 修复 Workout Logs API
- [x] 1.2.1 更新 `frontend/types/api.ts` 中 `WorkoutLog` 类型：`duration` → `duration_minutes`
- [x] 1.2.2 更新 `frontend/hooks/use-body-logs.ts` 中 `useAddWorkoutLog`：发送 `duration_minutes` 字段
- [x] 1.2.3 更新 `frontend/hooks/use-body-logs.ts` 中 `useWorkoutLogs`：参数名 `start_date/end_date` → `date_from/date_to`
- [x] 1.2.4 更新 `frontend/app/(main)/body/page.tsx` 中运动历史显示：`log.duration` → `log.duration_minutes`

## 2. 修复 Insights API 端点 (P0)

- [x] 2.1 更新 `frontend/hooks/use-insights.ts` 中 `useInsight`：路径从 `/insights/{date}` → `/insight/daily?date={date}`
- [x] 2.2 更新 `frontend/hooks/use-insights.ts` 中 `useGenerateInsight`：路径从 `/insights/generate` → `/insight/generate`
- [x] 2.3 更新响应字段映射：后端返回 `insight_json` 对象，前端需正确解析

## 3. 修复成分分析错误处理 (P1)

- [x] 3.1 检查 `frontend/hooks/use-ingredient.ts` 中请求字段：`ingredients` → `text`
- [x] 3.2 更新 `frontend/app/(main)/ingredient/page.tsx` 添加 try-catch 和错误边界
- [x] 3.3 处理 API 错误响应，显示友好错误消息而非崩溃

## 4. 修复认证中间件 (P0)

- [x] 4.1 分析 `frontend/middleware.ts` 当前实现
- [x] 4.2 统一 token 存储策略（localStorage 或 cookie）
- [x] 4.3 确保登录成功后正确重定向到主应用

## 5. 完成 AI 聊天功能 (P1)

- [x] 5.1 更新 `frontend/app/(main)/chat/page.tsx` 移除"开发中"占位符
- [x] 5.2 连接到 `/chat/message` API
- [x] 5.3 更新 `frontend/components/chat/chat-window.tsx` 启用实际聊天功能
- [x] 5.4 更新 `frontend/hooks/use-chat.ts` 确保 API 调用正确

## 6. 验证修复

- [x] 6.1 本地启动前后端服务
- [x] 6.2 手动测试用户注册/登录流程
- [x] 6.3 测试体重记录功能
- [x] 6.4 测试运动记录功能
- [x] 6.5 测试成分分析功能
- [x] 6.6 测试每日洞察功能
- [x] 6.7 测试 AI 聊天功能
- [x] 6.8 TypeScript 编译通过，无类型错误
