<div align="center">

# 🏥 HealthApp

### AI-Powered Health & Nutrition Tracking

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1.svg)](https://www.postgresql.org/)

[English](#-english) · [中文](#-中文) · [Demo](#-demo) · [Documentation](#-api-documentation) · [Report Bug](https://github.com/staruhub/Healthapp/issues)

---

**Track nutrition, exercise, and wellness with AI-powered personalized insights**

</div>

---

## 📑 Table of Contents

<details open>
<summary><b>🌐 English</b></summary>

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#️-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)

</details>

<details open>
<summary><b>🇨🇳 中文</b></summary>

- [功能特性](#-功能特性)
- [快速开始](#-快速开始-1)
- [详细安装](#-详细安装)
- [环境配置](#️-环境配置)
- [项目结构](#-项目结构-1)

</details>

<details open>
<summary><b>📖 More</b></summary>

- [FAQ](#-faq)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

</details>

---

## 🌐 English

### ✨ Features

| Feature | Description |
|---------|-------------|
| 🍽️ **Smart Food Logging** | AI-powered food recognition with automatic nutrition calculation |
| ⚖️ **Body Metrics** | Track weight, BMI, body fat percentage, and fitness progress |
| 🏋️ **Workout Tracking** | Log exercises with duration, calories burned, and intensity |
| 🔬 **Ingredient Analysis** | Scan and analyze food ingredients for health insights |
| 📊 **Analytics Dashboard** | Visualize trends with interactive charts and statistics |
| 🤖 **AI Health Assistant** | Get personalized nutrition and fitness recommendations |
| 📱 **Mobile-First Design** | Responsive UI optimized for all devices |
| 🔐 **Secure Authentication** | JWT-based auth with token refresh mechanism |

### 🎬 Demo

> 🚧 **Screenshots coming soon** - The application is fully functional. Run locally to explore all features!

### 🛠️ Tech Stack

#### Frontend

| Technology | Version | Description |
|:-----------|:-------:|:------------|
| [Next.js](https://nextjs.org/) | `16.x` | React framework with App Router |
| [React](https://react.dev/) | `19.x` | UI library |
| [TailwindCSS](https://tailwindcss.com/) | `4.x` | Utility-first CSS |
| [Zustand](https://zustand-demo.pmnd.rs/) | `5.x` | State management |
| [TanStack Query](https://tanstack.com/query) | `5.x` | Server state management |
| [Radix UI](https://www.radix-ui.com/) | `latest` | Accessible components |

#### Backend

| Technology | Version | Description |
|:-----------|:-------:|:------------|
| [FastAPI](https://fastapi.tiangolo.com/) | `0.115+` | Python web framework |
| [PostgreSQL](https://www.postgresql.org/) | `15+` | Database |
| [SQLAlchemy](https://www.sqlalchemy.org/) | `2.0` | Async ORM |
| [Alembic](https://alembic.sqlalchemy.org/) | `1.14+` | Database migrations |
| [Pydantic](https://pydantic.dev/) | `2.x` | Data validation |
| [OpenAI API](https://openai.com/) | `GPT-4` | AI integration |

### 🚀 Quick Start

\`\`\`bash
# Clone the repository
git clone https://github.com/staruhub/Healthapp.git
cd Healthapp

# Start PostgreSQL with Docker
docker-compose up -d

# Setup and run backend (Terminal 1)
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8001

# Setup and run frontend (Terminal 2)
cd frontend
pnpm install
pnpm dev
\`\`\`

🎉 **Access the app:**
- 🌐 Frontend: [http://localhost:3000](http://localhost:3000)
- 📚 API Docs: [http://localhost:8001/docs](http://localhost:8001/docs)

### 📦 Installation

#### Prerequisites

| Requirement | Version | Installation |
|-------------|---------|--------------|
| Python | 3.11+ | [python.org](https://www.python.org/downloads/) |
| Node.js | 20+ | [nodejs.org](https://nodejs.org/) |
| pnpm | 9+ | \`npm install -g pnpm\` |
| uv | Latest | \`curl -LsSf https://astral.sh/uv/install.sh \| sh\` |
| Docker | Latest | [docker.com](https://www.docker.com/) |
| PostgreSQL | 15+ | Via Docker or [postgresql.org](https://www.postgresql.org/) |

#### Step-by-Step Installation

<details>
<summary><b>1️⃣ Clone Repository</b></summary>

\`\`\`bash
git clone https://github.com/staruhub/Healthapp.git
cd Healthapp
\`\`\`

</details>

<details>
<summary><b>2️⃣ Start Database</b></summary>

\`\`\`bash
# Using Docker (recommended)
docker-compose up -d

# Verify database is running
docker ps | grep postgres
\`\`\`

</details>

<details>
<summary><b>3️⃣ Setup Backend</b></summary>

\`\`\`bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your settings
# Generate SECRET_KEY: openssl rand -hex 32

# Install dependencies
uv sync

# Run database migrations
uv run alembic upgrade head

# Start development server
uv run uvicorn app.main:app --reload --port 8001
\`\`\`

</details>

<details>
<summary><b>4️⃣ Setup Frontend</b></summary>

\`\`\`bash
cd frontend

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8001" > .env.local

# Install dependencies
pnpm install

# Start development server
pnpm dev
\`\`\`

</details>

### ⚙️ Configuration

#### Backend Environment Variables (\`.env\`)

\`\`\`env
# Database
DATABASE_URL=postgresql+asyncpg://healthapp:healthapp_dev_2024@localhost:5432/healthapp_db

# Security (REQUIRED: generate with openssl rand -hex 32)
SECRET_KEY=your-super-secret-key-here

# AI Mode: "mock" for development, "real" for production
AI_MODE=mock

# OpenAI API Key (required when AI_MODE=real)
OPENAI_API_KEY=sk-...

# CORS Origins
CORS_ORIGINS=["http://localhost:3000","http://localhost:3001"]
\`\`\`

#### Frontend Environment Variables (\`.env.local\`)

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_AI_MODE=mock
\`\`\`

### 📚 API Documentation

| Endpoint | Description |
|----------|-------------|
| \`GET /docs\` | Swagger UI - Interactive API documentation |
| \`GET /redoc\` | ReDoc - Alternative API documentation |
| \`GET /health\` | Health check endpoint |

#### Key API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| \`POST\` | \`/api/v1/auth/register\` | User registration |
| \`POST\` | \`/api/v1/auth/login\` | User login |
| \`POST\` | \`/api/v1/auth/refresh\` | Refresh access token |
| \`GET\` | \`/api/v1/food/logs\` | Get food logs |
| \`POST\` | \`/api/v1/food/parse\` | AI food parsing |
| \`GET\` | \`/api/v1/body/logs\` | Get body metrics |
| \`GET\` | \`/api/v1/dashboard/summary\` | Dashboard data |
| \`POST\` | \`/api/v1/chat\` | AI chat assistant |

### 📁 Project Structure

\`\`\`
Healthapp/
├── 📂 backend/                 # FastAPI Backend
│   ├── 📂 app/
│   │   ├── 📂 api/v1/         # API Routes
│   │   │   ├── auth.py        # Authentication
│   │   │   ├── food.py        # Food logging
│   │   │   ├── body.py        # Body metrics
│   │   │   ├── workout.py     # Workout tracking
│   │   │   ├── dashboard.py   # Dashboard data
│   │   │   ├── chat.py        # AI chat
│   │   │   └── ingredient.py  # Ingredient analysis
│   │   ├── 📂 models/         # SQLAlchemy Models
│   │   ├── 📂 schemas/        # Pydantic Schemas
│   │   ├── 📂 services/ai/    # AI Service Layer
│   │   └── 📂 utils/          # Utilities
│   ├── 📂 alembic/            # Database Migrations
│   └── pyproject.toml         # Python dependencies
│
├── 📂 frontend/                # Next.js Frontend
│   ├── 📂 app/                # App Router Pages
│   │   ├── (auth)/            # Auth pages
│   │   └── (main)/            # Main app pages
│   ├── 📂 components/         # React Components
│   │   ├── ui/                # Base UI components
│   │   ├── chat/              # Chat components
│   │   └── onboarding/        # Onboarding flow
│   ├── 📂 hooks/              # Custom React Hooks
│   ├── 📂 store/              # Zustand State
│   ├── 📂 lib/                # Utilities
│   └── 📂 types/              # TypeScript Types
│
├── 📂 openspec/               # Project Specifications
├── docker-compose.yml         # Docker configuration
└── README.md                  # This file
\`\`\`

---

## 🇨🇳 中文

### ✨ 功能特性

| 功能 | 描述 |
|------|------|
| 🍽️ **智能食物记录** | AI 驱动的食物识别，自动计算营养成分 |
| ⚖️ **身体指标** | 追踪体重、BMI、体脂率和健身进度 |
| 🏋️ **运动追踪** | 记录运动时长、消耗卡路里和运动强度 |
| 🔬 **成分分析** | 扫描分析食品配料，提供健康洞察 |
| 📊 **数据仪表盘** | 交互式图表可视化健康趋势 |
| 🤖 **AI 健康助手** | 获取个性化营养和健身建议 |
| 📱 **移动优先** | 响应式 UI，适配所有设备 |
| 🔐 **安全认证** | 基于 JWT 的认证，支持 Token 刷新 |

### 🚀 快速开始

\`\`\`bash
# 克隆仓库
git clone https://github.com/staruhub/Healthapp.git
cd Healthapp

# 启动 PostgreSQL
docker-compose up -d

# 启动后端（终端 1）
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8001

# 启动前端（终端 2）
cd frontend
pnpm install
pnpm dev
\`\`\`

🎉 **访问应用：**
- 🌐 前端：[http://localhost:3000](http://localhost:3000)
- 📚 API 文档：[http://localhost:8001/docs](http://localhost:8001/docs)

### 📦 详细安装

#### 环境要求

| 依赖 | 版本 | 安装方式 |
|------|------|----------|
| Python | 3.11+ | [python.org](https://www.python.org/downloads/) |
| Node.js | 20+ | [nodejs.org](https://nodejs.org/) |
| pnpm | 9+ | \`npm install -g pnpm\` |
| uv | 最新版 | \`curl -LsSf https://astral.sh/uv/install.sh \| sh\` |
| Docker | 最新版 | [docker.com](https://www.docker.com/) |
| PostgreSQL | 15+ | 通过 Docker 或 [postgresql.org](https://www.postgresql.org/) |

### ⚙️ 环境配置

#### 后端环境变量 (\`.env\`)

\`\`\`env
# 数据库连接
DATABASE_URL=postgresql+asyncpg://healthapp:healthapp_dev_2024@localhost:5432/healthapp_db

# 安全密钥（必填：使用 openssl rand -hex 32 生成）
SECRET_KEY=your-super-secret-key-here

# AI 模式："mock" 开发环境，"real" 生产环境
AI_MODE=mock

# OpenAI API 密钥（AI_MODE=real 时必填）
OPENAI_API_KEY=sk-...
\`\`\`

#### 前端环境变量 (\`.env.local\`)

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8001
\`\`\`

### 📁 项目结构

\`\`\`
Healthapp/
├── 📂 backend/                 # FastAPI 后端
│   ├── 📂 app/
│   │   ├── 📂 api/v1/         # API 路由
│   │   ├── 📂 models/         # 数据库模型
│   │   ├── 📂 schemas/        # 数据验证
│   │   └── 📂 services/ai/    # AI 服务层
│   └── 📂 alembic/            # 数据库迁移
│
├── 📂 frontend/                # Next.js 前端
│   ├── 📂 app/                # 页面路由
│   ├── 📂 components/         # React 组件
│   ├── 📂 hooks/              # 自定义 Hooks
│   ├── 📂 store/              # 状态管理
│   └── 📂 types/              # TypeScript 类型
│
└── 📂 openspec/               # 项目规范文档
\`\`\`

---

## ❓ FAQ

<details>
<summary><b>Q: What is AI_MODE and when should I use "real"?</b></summary>

**A:** \`AI_MODE\` controls the AI service behavior:
- \`mock\`: Returns pre-defined responses (no API costs, for development)
- \`real\`: Uses OpenAI GPT-4 API (requires \`OPENAI_API_KEY\`, for production)

</details>

<details>
<summary><b>Q: How do I reset the database?</b></summary>

\`\`\`bash
# Drop and recreate the database
dropdb healthapp_db
createdb healthapp_db
cd backend && uv run alembic upgrade head
\`\`\`

</details>

<details>
<summary><b>Q: Can I use MySQL instead of PostgreSQL?</b></summary>

**A:** Currently, only PostgreSQL is supported due to async driver requirements (\`asyncpg\`). MySQL support may be added in future versions.

</details>

<details>
<summary><b>Q: 如何生成安全的 SECRET_KEY？</b></summary>

\`\`\`bash
openssl rand -hex 32
\`\`\`

</details>

<details>
<summary><b>Q: 前端如何处理 Token 过期？</b></summary>

**A:** 前端 \`api-client.ts\` 会自动处理：
1. 检测到 401 响应
2. 使用 refresh_token 获取新的 access_token
3. 自动重试原请求
4. 如果刷新失败，重定向到登录页

</details>

---

## 🔧 Troubleshooting

### Database Connection Failed

\`\`\`bash
# Check if PostgreSQL container is running
docker ps | grep postgres

# Restart the container
docker-compose restart

# Check logs
docker-compose logs postgres
\`\`\`

### Port Already in Use

\`\`\`bash
# Find process using port 8001
lsof -i :8001

# Kill the process
kill -9 <PID>

# Or use a different port
uv run uvicorn app.main:app --reload --port 8002
\`\`\`

### Frontend Cannot Connect to Backend

1. ✅ Verify backend is running: \`curl http://localhost:8001/health\`
2. ✅ Check \`NEXT_PUBLIC_API_URL\` in \`.env.local\`
3. ✅ Verify CORS settings in backend \`.env\`
4. ✅ Clear browser cache and restart frontend

### Token/Authentication Issues

\`\`\`bash
# Clear stored tokens in browser
localStorage.removeItem('auth-storage')

# Then refresh the page
\`\`\`

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch
   \`\`\`bash
   git checkout -b feature/AmazingFeature
   \`\`\`
3. **Commit** your changes
   \`\`\`bash
   git commit -m 'feat: add amazing feature'
   \`\`\`
4. **Push** to the branch
   \`\`\`bash
   git push origin feature/AmazingFeature
   \`\`\`
5. **Open** a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type | Description |
|------|-------------|
| \`feat\` | New feature |
| \`fix\` | Bug fix |
| \`docs\` | Documentation |
| \`style\` | Formatting |
| \`refactor\` | Code refactoring |
| \`test\` | Adding tests |
| \`chore\` | Maintenance |

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

\`\`\`
MIT License

Copyright (c) 2024 staruhub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
\`\`\`

---

## 📬 Contact

<div align="center">

**staruhub**

[![GitHub](https://img.shields.io/badge/GitHub-staruhub-181717?style=for-the-badge&logo=github)](https://github.com/staruhub)

---

<sub>Made with ❤️ and ☕ by [staruhub](https://github.com/staruhub)</sub>

⭐ **Star this repo if you find it helpful!** ⭐

</div>
