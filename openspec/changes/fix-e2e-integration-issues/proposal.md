# Fix E2E Integration Issues

## Why

E2E 测试发现前后端存在多处集成问题，导致约 50% 的功能无法正常工作。主要问题包括：

1. **API 字段名不匹配** - 前端和后端使用不同的字段命名约定
2. **API 端点路径/参数不一致** - 查询参数名称不匹配
3. **错误处理不当** - 前端未正确处理错误响应导致页面崩溃
4. **认证流程不一致** - 中间件和前端使用不同的 token 存储机制

这些问题阻塞了核心用户流程（体重记录、运动记录、成分分析等），必须修复才能进入生产环境。

## What Changes

### 1. 统一 API 字段命名 (后端适配前端)

由于后端 schema 定义已在规范中，选择**修改前端**以匹配后端 API：

| 问题 | 前端当前 | 后端期望 | 修复位置 |
|------|----------|----------|----------|
| 体重记录创建 | `weight` | `weight_kg` | `frontend/hooks/use-body-logs.ts` |
| 体重记录响应 | `weight` | `weight_kg` | `frontend/types/api.ts` |
| 运动记录创建 | `duration` | `duration_minutes` | `frontend/hooks/use-body-logs.ts` |
| 运动记录响应 | `duration` | `duration_minutes` | `frontend/types/api.ts` |
| 体重日志查询 | `start_date/end_date` | `date_from/date_to` | `frontend/hooks/use-body-logs.ts` |
| 运动日志查询 | `start_date/end_date` | `date_from/date_to` | `frontend/hooks/use-body-logs.ts` |

### 2. 修复 Insights API 端点

| 问题 | 前端调用 | 后端实际 | 修复方案 |
|------|----------|----------|----------|
| 获取指定日期洞察 | `GET /insights/{date}` | `GET /insight/daily?date=` | 修改前端调用路径 |
| 生成洞察 | `POST /insights/generate` | `POST /insight/generate` | 修改前端调用路径 |

### 3. 修复成分分析错误处理

- 前端 `IngredientPage` 组件未正确处理 API 错误响应
- 错误信息被当作 React 子节点渲染导致崩溃

### 4. 修复认证中间件

- 中间件检查 cookie 中的 `auth-storage`
- 前端实际存储 token 在 localStorage
- 需要统一存储机制

### 5. 完成 AI 聊天功能

- AI 助手页面显示"正在开发中"占位符
- 需要连接到已实现的 `/chat/message` API

## Impact

### Affected Specs

- `body-tracking` - 无规范变更，仅前端实现修复
- `daily-insights` - 无规范变更，仅前端实现修复
- `ingredient-analysis` - 无规范变更，仅前端实现修复
- `ai-chat` - 无规范变更，仅前端实现修复
- `auth` - 无规范变更，仅中间件实现修复

### Affected Code

**前端修改：**
- `frontend/types/api.ts` - 修正类型定义
- `frontend/hooks/use-body-logs.ts` - 修正 API 调用字段
- `frontend/hooks/use-insights.ts` - 修正 API 端点路径
- `frontend/hooks/use-ingredient.ts` - 修正请求字段
- `frontend/app/(main)/ingredient/page.tsx` - 添加错误处理
- `frontend/app/(main)/assistant/page.tsx` - 连接 Chat API
- `frontend/middleware.ts` - 修正 token 检查逻辑
- `frontend/components/floating-chat.tsx` - 连接 Chat API

**后端无变更** - 后端 API 已按规范实现，问题在前端未正确对接。

### Migration Path

纯前端修复，无数据迁移需求。部署后立即生效。

### Testing Requirements

- 所有修复完成后重新运行 E2E 测试
- 核心用户流程验证：注册 → 登录 → 记录体重 → 记录运动 → 成分分析 → AI 聊天
