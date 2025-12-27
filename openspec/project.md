# Project Context

## Purpose
AI 个人健康管理网站 - 让用户以最低摩擦记录饮食/运动/体重，由 AI 完成数据解析、目标对齐、趋势洞察和行动建议，真正帮助用户实现健康目标。

**核心价值主张：**
- 极低摩擦输入：5秒内完成一餐记录（自然语言输入）
- AI即时解读：透明的估算依据 + 热量范围而非单点值
- 个性化建议：基于用户画像和历史数据的定制化行动建议
- 全局AI助手：随时问答健康相关问题

**目标用户：**
- 减脂新手（50%）：简单记录、热量估算、行动指导
- 健身进阶（30%）：蛋白质追踪、训练记录、数据趋势
- 体重维持（20%）：简单监控、异常预警

## Tech Stack

### 前端
- **框架**: Next.js 14.x (App Router)
- **UI库**: React 18.x
- **语言**: TypeScript 5.x
- **样式**: Tailwind CSS 3.x
- **组件库**: shadcn/ui (latest)
- **包管理器**: pnpm 8.x
- **状态管理**: Zustand 4.x (全局状态), React Query 5.x (服务端状态)
- **HTTP客户端**: Axios 1.x

### 后端
- **语言**: Python 3.11+
- **框架**: FastAPI 0.109+
- **包管理器**: uv (Astral)
- **ORM**: SQLAlchemy 2.0+ (async模式)
- **数据验证**: Pydantic V2
- **数据库迁移**: Alembic 1.x
- **数据库驱动**: asyncpg 0.29+
- **认证**: python-jose 3.x (JWT), passlib 1.7+ (bcrypt)
- **HTTP客户端**: httpx 0.26+ (异步调用AI)

### 数据库
- **主数据库**: PostgreSQL 15+
- **缓存**: Redis 7.x (可选，Rate Limiting)

### AI集成
- **模式**: Mock模式 (开发) / Real模式 (生产)
- **支持的LLM**: OpenAI API / Claude API / 其他兼容接口

## Project Conventions

### Code Style

**通用原则**
- 优先简单方案，避免过度工程
- 避免代码重复，查找现有实现再创建新代码
- 文件行数控制在 200-300 行以内，超过则重构
- 不编写一次性脚本文件
- 代码变更前先阅读现有代码，理解后再修改
- 仅修改与任务相关的代码，不触碰无关部分

**前端（TypeScript/React）**
- 遵循 Next.js App Router 最佳实践
- 组件使用函数式组件 + Hooks
- 类型优先：充分利用 TypeScript 类型系统
- 文件命名：kebab-case（如 `food-log.tsx`）
- 组件命名：PascalCase（如 `FoodLogCard`）
- 使用 shadcn/ui 组件，保持 UI 一致性
- CSS 使用 Tailwind utility classes

**后端（Python/FastAPI）**
- 遵循 PEP 8 规范
- 使用 async/await 异步模式
- 类型注解：所有函数参数和返回值
- 文件命名：snake_case（如 `food_service.py`）
- 类命名：PascalCase（如 `FoodLog`）
- Pydantic Schema 用于数据验证
- 环境变量通过 `.env` 文件管理

### Architecture Patterns

**前后端分离架构**
```
前端 (Next.js) ←─ HTTP/REST ─→ 后端 (FastAPI) ←→ 数据库 (PostgreSQL)
```

**前端架构**
- **页面组织**: App Router 按功能分组
  - `(auth)`: 认证相关页面
  - `(main)`: 业务主页面
  - `onboarding`: 用户引导
- **组件分层**:
  - `components/ui/`: shadcn/ui 基础组件
  - `components/<feature>/`: 业务功能组件
  - `app/<route>/`: 页面组件
- **状态管理**: Zustand（全局状态）+ React Query（服务端缓存）
- **API层**: 统一的 API 客户端封装（`lib/api.ts`）

**后端架构（三层分离）**
```
Router (接口层) → Service (业务逻辑层) → Model (数据模型层)
```
- **Router**: 定义路由、参数校验、依赖注入
- **Service**: 业务逻辑、AI调用、数据聚合
- **Model**: SQLAlchemy 模型、数据库访问

**AI服务抽象**
```python
# 基类定义接口
class BaseAIService(ABC):
    @abstractmethod
    async def parse_food(text: str) -> FoodParseResult: ...

# Mock实现（开发环境）
class MockAIService(BaseAIService): ...

# Real实现（生产环境）
class RealAIService(BaseAIService): ...

# 根据环境变量选择
ai_service = MockAIService() if AI_MODE == "mock" else RealAIService()
```

**数据访问控制**
- 所有业务查询强制携带 `user_id` 过滤
- 从 JWT Token 中提取当前用户 ID
- 禁止跨用户数据访问

### Testing Strategy

**测试金字塔**
```
         E2E 测试（少量）
            ↑
      集成测试（适量）
            ↑
      单元测试（大量）
```

**前端测试**
- **单元测试**: 工具函数、Hooks（Jest + React Testing Library）
- **组件测试**: 关键业务组件的渲染和交互
- **E2E测试**: 核心用户流程（Playwright/Cypress）
  - 注册 → 登录 → 记录饮食 → 查看解读

**后端测试**
- **单元测试**: Service 层业务逻辑（pytest + pytest-asyncio）
- **API测试**: 所有接口（FastAPI TestClient）
- **安全测试**:
  - 无 Token 访问 → 401
  - 跨用户访问 → 403
  - SQL注入防护

**AI输出测试**
- Mock 模式必须返回可解析的结构化数据
- Pydantic Schema 校验所有 AI 输出
- 异常情况的降级处理

**测试数据原则**
- 仅在测试中使用 mock 数据
- 开发环境使用真实数据库（本地/Docker）
- 生产环境禁用 mock 数据

### Git Workflow

**分支策略**
- `main`: 生产环境代码，受保护
- `develop`: 开发主分支
- `feature/<name>`: 功能分支
- `fix/<name>`: 修复分支

**提交约定**
```
<type>(<scope>): <subject>

[optional body]
```

**Type类型**:
- `feat`: 新功能
- `fix`: Bug修复
- `refactor`: 重构
- `test`: 测试
- `docs`: 文档
- `chore`: 构建/工具配置

**示例**:
```
feat(food): 实现自然语言饮食记录解析
fix(auth): 修复 Token 过期未刷新问题
refactor(dashboard): 优化体重趋势图渲染性能
```

**合并规则**
- 功能分支合并前需通过所有测试
- Code Review 至少一人批准（团队开发时）
- 保持提交历史清晰（squash merge 可选）

## Domain Context

### 健康管理核心概念

**用户目标类型 (goal_type)**
- `cut`: 减脂 - 热量赤字，优先控制总热量
- `bulk`: 增肌 - 热量盈余 + 高蛋白，配合力量训练
- `gain`: 增重 - 适度热量盈余
- `maintain`: 维持 - 热量平衡

**营养素三大类**
- **碳水化合物**: 主要能量来源，1g = 4kcal
- **蛋白质**: 肌肉修复/增长，1g = 4kcal
- **脂肪**: 激素合成/能量储备，1g = 9kcal

**热量估算原则**
- **范围而非单点**: 给出 min/max 区间，承认不确定性
- **假设透明**: 明确说明份量假设（如"中等大小红薯约150g"）
- **可调整**: 用户可选择不同份量，系统重新计算
- **误差提示**: 始终提醒"实际热量受烹饪方式、具体份量影响"

**配料表分析逻辑**
- 结合用户 goal_type 给出个性化建议
- 减脂人群：关注糖、油脂、添加剂
- 增肌人群：关注蛋白质含量、消化吸收
- 输出结构化：verdict (推荐/谨慎/不推荐) + reasons + suggestions

**每日解读生成逻辑**
- 基于当日 food_logs + workout_logs + body_logs
- 计算热量差距（摄入 vs 目标）
- 归因到具体餐次/食物
- 给出明日可执行的行动建议（最多3条）

### AI输出设计原则

**结构化输出（JSON Schema）**
- 所有AI接口返回严格的JSON格式
- 使用 Pydantic 模型校验
- 前端基于结构渲染，不依赖文本解析

**安全边界**
- 禁止给出医疗诊断（如"你可能患有糖尿病"）
- 禁止给出用药建议（如"建议服用二甲双胍"）
- 遇疾病相关问题 → 提示"请咨询专业医生"
- 不存储医疗敏感信息

**信息不足处理**
- 不编造数据填充空白
- 明确提示用户补充信息
- 示例：配料表文本不完整 → 返回 `{"verdict": null, "error": "信息不足，请提供完整配料表"}`

### 业务术语表

| 术语 | 英文 | 说明 |
|------|------|------|
| 饮食记录 | Food Log | 用户输入的餐次文本 + AI解析结果 |
| 运动记录 | Workout Log | 运动类型 + 时长 + 备注 |
| 体重记录 | Body Log | 体重数值 + 日期 + 备注 |
| 配料分析 | Ingredient Check | 配料表文本 → AI结构化评估 |
| 每日解读 | Daily Insight | 基于当日数据的AI总结 + 建议 |
| 聊天记录 | Chat Log | 用户与AI助手的对话历史 |
| 用户画像 | User Profile | 健康目标、身体数据、饮食偏好 |
| Mock模式 | Mock Mode | 使用预设规则模拟AI输出，无需真实API Key |
| Real模式 | Real Mode | 调用真实LLM API |

## Important Constraints

### 技术约束

**前端**
- AI API Key 绝对禁止暴露在前端代码或构建产物中
- 所有AI调用必须通过后端代理
- 支持降级：后端AI服务不可用时，前端展示友好提示
- 响应时间：非AI接口 ≤ 500ms，AI接口 ≤ 10s

**后端**
- 必须使用 async/await 异步模式
- 数据库查询必须强制携带 `user_id` 过滤
- JWT Token 过期时间：access_token 30分钟，refresh_token 7天
- AI输出必须通过 Pydantic 校验，校验失败返回错误而非放行
- 环境变量通过 `.env` 文件管理，敏感信息禁止硬编码

**数据库**
- PostgreSQL 15+ 版本
- 所有时间字段使用 UTC
- 用户数据物理隔离（通过 user_id）
- 敏感字段（密码）加密存储（bcrypt）

### 业务约束

**数据准确性**
- 热量估算承认误差，给范围而非单点
- 份量假设必须透明说明
- 不承诺"精确"，强调"参考"

**用户体验**
- 记录流程：5秒内完成一餐输入 + 提交
- 看板信息密度：坚持"10秒看懂"原则
- AI助手响应：10秒内返回（含等待提示）
- 页面加载：首屏 ≤ 2s

**数据隐私**
- 用户仅能访问本人数据
- 跨用户访问 → 403 Forbidden
- 敏感信息（密码、Token）禁止明文日志
- 遵守数据最小化原则（不收集非必要信息）

### 法律与合规约束

**医疗免责**
- 产品定位：健康管理工具，非医疗设备
- 所有页面需包含免责声明：
  > "本产品提供的建议仅供参考，不构成医疗诊断或治疗建议。如有健康问题，请咨询专业医生。"
- AI输出禁止给出诊断/用药建议
- 用户协议需明确告知数据使用范围

**数据安全**
- 传输加密：生产环境强制 HTTPS
- 存储加密：密码使用 bcrypt（salt rounds ≥ 12）
- 访问控制：基于 JWT 的认证 + 基于 user_id 的授权
- 日志脱敏：禁止记录密码、Token等敏感信息

## External Dependencies

### 必需依赖

**数据库服务**
- **PostgreSQL 15+**
  - 用途：主数据存储
  - 连接方式：asyncpg (异步驱动)
  - 环境变量：`DATABASE_URL`
  - 容灾：本地开发可用 Docker，生产建议托管服务（AWS RDS / Supabase / Neon）

### 可选依赖

**AI服务（Real模式）**
- **OpenAI API** 或 **Claude API** 或其他兼容接口
  - 用途：自然语言解析、配料分析、每日解读、聊天对话
  - 环境变量：`OPENAI_API_KEY` / `ANTHROPIC_API_KEY`
  - 降级策略：AI服务不可用时切换到 Mock 模式
  - 成本控制：设置 Rate Limiting，避免滥用

**缓存服务（可选）**
- **Redis 7.x**
  - 用途：Rate Limiting、Session存储、热数据缓存
  - 环境变量：`REDIS_URL`
  - 可选性：MVP阶段可跳过，后期优化加入

### 开发工具依赖

**包管理器**
- **前端**: pnpm 8.x (`npm install -g pnpm`)
- **后端**: uv (`curl -LsSf https://astral.sh/uv/install.sh | sh`)

**数据库迁移**
- **Alembic**: 后端集成，管理 schema 变更
  - 命令：`alembic revision --autogenerate -m "描述"`
  - 命令：`alembic upgrade head`

**API文档**
- **FastAPI自动生成**:
  - Swagger UI: `http://localhost:8000/docs`
  - ReDoc: `http://localhost:8000/redoc`
  - OpenAPI JSON: `http://localhost:8000/openapi.json`

### 部署环境要求

**开发环境**
- Node.js 18+ (前端)
- Python 3.11+ (后端)
- PostgreSQL 15+ (本地或Docker)

**生产环境建议**
- 前端：Vercel / Cloudflare Pages / Nginx
- 后端：Docker + Gunicorn + Uvicorn workers
- 数据库：托管 PostgreSQL (AWS RDS / Supabase / Neon)
- 反向代理：Nginx / Caddy
- HTTPS：Let's Encrypt 自动证书
- 监控：Sentry (错误追踪) + Datadog/Prometheus (性能监控)
