# AGENTS.md

This file provides guidance to Qoder (qoder.com) when working with code in this repository.

<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

## 项目架构

这是一个全栈健康追踪应用，采用前后端分离架构：

- **后端**: FastAPI + PostgreSQL + SQLAlchemy (异步)
- **前端**: Next.js 16 + React 19 + TailwindCSS 4 + Zustand
- **AI**: 支持 Mock 模式（开发）和 Real 模式（生产，使用 OpenAI）

### 目录结构

```
Healthapp/
├── backend/          # FastAPI 后端
│   ├── app/
│   │   ├── api/v1/        # API 路由: auth, profile, food, body, workout, ingredient, insight, chat, dashboard
│   │   ├── models/        # SQLAlchemy 模型: user.py, logs.py
│   │   ├── schemas/       # Pydantic 验证模式
│   │   ├── services/ai/   # AI 服务抽象: base.py, mock.py, real.py
│   │   ├── utils/         # 工具函数: security.py, dependencies.py
│   │   ├── config.py      # Pydantic Settings 配置
│   │   ├── database.py    # 异步数据库连接
│   │   └── main.py        # FastAPI 应用入口
│   └── alembic/      # 数据库迁移
├── frontend/         # Next.js 前端
│   ├── app/               # Next.js App Router
│   ├── components/        # React 组件: auth, body, chat, dashboard, food, etc.
│   ├── lib/               # 核心库: api-client.ts, auth.ts, utils.ts
│   ├── store/             # Zustand 状态管理
│   ├── hooks/             # React hooks
│   └── types/             # TypeScript 类型定义
└── openspec/         # OpenSpec 规范和变更提案
```

## 常用命令

### 数据库

```bash
# 启动 PostgreSQL (Docker)
docker-compose up -d

# 运行迁移
cd backend && uv run alembic upgrade head

# 创建新迁移
cd backend && uv run alembic revision --autogenerate -m "描述"

# 回滚迁移
cd backend && uv run alembic downgrade -1

# 重置数据库
dropdb healthapp_db && createdb healthapp_db && cd backend && uv run alembic upgrade head
```

### 后端开发

```bash
# 安装依赖
cd backend && uv sync

# 启动开发服务器 (端口 8001)
cd backend && uv run uvicorn app.main:app --reload --port 8001

# 运行测试
cd backend && uv run pytest

# API 文档
# http://localhost:8001/docs (Swagger)
# http://localhost:8001/redoc (ReDoc)
```

### 前端开发

```bash
# 安装依赖
cd frontend && pnpm install

# 启动开发服务器 (端口 3000)
cd frontend && pnpm dev

# 构建生产版本
cd frontend && pnpm build

# 启动生产服务器
cd frontend && pnpm start

# 运行 Linter
cd frontend && pnpm lint
```

## 环境配置

### 后端 (.env)

```bash
DATABASE_URL=postgresql+asyncpg://healthapp:healthapp_dev_2024@localhost:5432/healthapp_db
SECRET_KEY=<使用 openssl rand -hex 32 生成>
AI_MODE=mock  # 开发使用 mock，生产使用 real
OPENAI_API_KEY=  # AI_MODE=real 时必需
CORS_ORIGINS=["http://localhost:3000","http://localhost:3001"]
```

### 前端 (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_AI_MODE=mock
```

## 核心技术栈

### 后端

- **FastAPI** - 现代 Python Web 框架
- **SQLAlchemy 2.0** - 异步 ORM
- **Alembic** - 数据库迁移
- **Pydantic** - 数据验证和配置
- **JWT** - 认证 (python-jose)
- **bcrypt** - 密码哈希 (>= 5.0.0)
- **uv** - 快速 Python 包管理器

### 前端

- **Next.js 16** - React 框架 (App Router)
- **React 19** - UI 库
- **TailwindCSS 4** - 样式
- **Zustand** - 状态管理
- **TanStack Query** - 服务端状态
- **Axios** - HTTP 客户端 (带自动 token 刷新)
- **Radix UI** - 无障碍组件
- **React Hook Form + Zod** - 表单验证
- **pnpm** - 包管理器

## 关键实现细节

### 认证流程

1. 用户登录 → 后端返回 `access_token` (30分钟) 和 `refresh_token` (7天)
2. 前端存储在 `localStorage` (`auth-storage`)
3. `api-client.ts` 自动注入 `Authorization: Bearer` header
4. 401 响应 → 自动使用 `refresh_token` 刷新 → 重试原请求
5. 刷新失败 → 清除认证 → 重定向到 `/login`

### AI 服务抽象

- **base.py**: `AIService` 抽象基类，定义 `parse_food()`, `analyze_nutrition()`, `chat()` 等接口
- **mock.py**: 基于关键字的模拟实现，用于开发和测试
- **real.py**: OpenAI GPT-4 集成，用于生产环境
- 通过 `AI_MODE` 环境变量切换

### 数据库模型

- **User**: 用户账户 (email, hashed_password, profile)
- **FoodLog**: 食物记录
- **BodyLog**: 身体数据记录
- **WorkoutLog**: 运动记录
- 所有模型使用 UUID 主键和时间戳

## 开发工作流

### 添加新功能

1. **规划**: 如果是新能力、破坏性变更或架构改变，参考 `openspec/AGENTS.md` 创建提案
2. **后端**:
   - 在 `app/models/` 添加模型
   - 创建迁移: `alembic revision --autogenerate -m "描述"`
   - 在 `app/schemas/` 添加 Pydantic 模式
   - 在 `app/api/v1/` 添加路由
   - 在 `app/services/` 添加业务逻辑
   - 应用迁移: `alembic upgrade head`
3. **前端**:
   - 在 `types/` 添加 TypeScript 类型
   - 在 `components/` 创建组件
   - 在 `store/` 添加状态管理（如需要）
   - 在 `hooks/` 添加自定义 hooks（如需要）
4. **测试**: 通过 API 文档测试后端，通过浏览器测试前端

### 修改现有代码

- 始终查找现有代码并迭代，避免创建新代码
- 不要在尝试迭代现有模式之前大幅改变模式
- 保持代码库整洁有序
- 避免文件超过 200-300 行，超过时重构

## 注意事项

- **数据库**: 使用 `asyncpg` 驱动，所有查询必须是异步的
- **密码**: 使用原生 `bcrypt` (>= 5.0.0)，不使用 `passlib.hash.bcrypt`
- **CORS**: 确保 `CORS_ORIGINS` 包含前端 URL
- **端口**: 后端默认 8001，前端默认 3000
- **环境**: 区分 dev/test/prod，避免在代码中使用 mock 数据（仅测试使用）
- **Token**: Access token 30分钟过期，Refresh token 7天过期
- **API**: 所有 API 路由在 `/api/v1` 前缀下

## 故障排除

### 数据库连接失败
```bash
docker ps  # 检查 PostgreSQL 容器是否运行
docker-compose restart  # 重启容器
```

### 端口占用
```bash
lsof -i :8001  # 查找占用后端端口的进程
lsof -i :3000  # 查找占用前端端口的进程
kill -9 <PID>  # 杀死进程
```

### 前端无法连接后端
- 检查 `NEXT_PUBLIC_API_URL` 配置
- 检查后端 `CORS_ORIGINS` 包含前端 URL
- 确认后端正在运行: `curl http://localhost:8001/health`

### 认证问题
- Token 过期 → 使用 `/auth/refresh` 刷新
- 401 错误 → 检查 `localStorage` 中的 `auth-storage`
- 清除认证: `localStorage.removeItem('auth-storage')`