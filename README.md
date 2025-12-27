# 🏥 HealthApp - AI-Powered Health Tracking

[English](#english) | [中文](#中文)

---

## English

### Introduction

HealthApp is a modern AI-powered health tracking application for monitoring nutrition, exercise, and wellness with personalized AI recommendations.

### Features

- 🍽️ **Food Logging** - AI-powered food recognition and nutrition tracking
- ⚖️ **Weight & Exercise** - Monitor body metrics and workouts
- 🔬 **Ingredient Analysis** - Analyze food ingredients for health insights
- 📊 **Dashboard** - Visualize health trends and analytics
- 🤖 **AI Assistant** - Get personalized health advice
- 📱 **Mobile-First** - Responsive design for all devices

### Tech Stack

| Frontend | Backend |
|----------|---------|
| Next.js 16 | FastAPI |
| React 19 | PostgreSQL |
| TailwindCSS 4 | SQLAlchemy (Async) |
| Zustand | JWT Auth |
| TanStack Query | OpenAI API |
| Radix UI | Alembic |

### Quick Start

\`\`\`bash
# Clone repository
git clone https://github.com/staruhub/Healthapp.git
cd Healthapp

# Start PostgreSQL
docker-compose up -d

# Backend
cd backend && uv sync && uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8001

# Frontend (new terminal)
cd frontend && pnpm install && pnpm dev
\`\`\`

**Access:** Frontend http://localhost:3000 | API http://localhost:8001/docs

---

## 中文

### 项目简介

HealthApp 是一个现代化的 AI 驱动健康追踪应用，帮助用户监控营养、运动和健康状况，提供个性化 AI 建议。

### 功能特性

- 🍽️ **食物记录** - AI 智能识别食物和营养追踪
- ⚖️ **体重运动** - 监控身体指标和运动进度
- 🔬 **成分分析** - 分析食品配料，提供健康洞察
- 📊 **仪表盘** - 可视化健康趋势和分析
- �� **AI 助手** - 获取个性化健康建议
- 📱 **移动优先** - 响应式设计，适配所有设备

### 快速开始

\`\`\`bash
# 克隆仓库
git clone https://github.com/staruhub/Healthapp.git
cd Healthapp

# 启动 PostgreSQL
docker-compose up -d

# 后端
cd backend && uv sync && uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8001

# 前端（新终端）
cd frontend && pnpm install && pnpm dev
\`\`\`

### 环境配置

**后端 (.env)**
\`\`\`
DATABASE_URL=postgresql+asyncpg://healthapp:healthapp_dev_2024@localhost:5432/healthapp_db
SECRET_KEY=your-secret-key  # openssl rand -hex 32
AI_MODE=mock
\`\`\`

**前端 (.env.local)**
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:8001
\`\`\`

### 项目结构

\`\`\`
Healthapp/
├── backend/           # FastAPI 后端
│   ├── app/api/v1/   # API 路由
│   ├── app/models/   # 数据模型
│   ├── app/schemas/  # Pydantic 模式
│   └── alembic/      # 数据库迁移
├── frontend/         # Next.js 前端
│   ├── app/          # 页面路由
│   ├── components/   # React 组件
│   ├── hooks/        # 自定义 Hooks
│   └── store/        # 状态管理
└── openspec/         # 规范文档
\`\`\`

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| 数据库连接失败 | docker-compose restart |
| 端口被占用 | lsof -i :8001 找到并终止进程 |
| 前端无法连接后端 | 检查 CORS 和 API URL 配置 |

### 贡献

1. Fork 仓库
2. 创建分支: git checkout -b feature/NewFeature
3. 提交: git commit -m 'Add NewFeature'
4. 推送: git push origin feature/NewFeature
5. 提交 Pull Request

### License

MIT License

---

Made with ❤️ by [staruhub](https://github.com/staruhub)
