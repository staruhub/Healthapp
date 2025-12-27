<![CDATA[<div align="center">

# 🏥 HealthApp

### AI-Powered Health & Nutrition Tracking

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.1-black.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB.svg)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1.svg)](https://www.postgresql.org/)

[Features](#-features) · [Quick Start](#-quick-start) · [Documentation](#-api-documentation) · [中文文档](#-中文文档)

---

**Track nutrition, exercise, and wellness with AI-powered personalized insights**

</div>

---

## ⚠️ Security Notice

> **Important**: Please ensure you're using the latest security-patched versions:
> - Next.js: `16.0.10+` or `16.1.x` (CVE-2025-66478)
> - React: `19.2.3+` (CVE-2025-55182, CVE-2025-55183, CVE-2025-55184)
> 
> Run `npm audit` regularly and keep dependencies updated.

---

## ✨ Features

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

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Description |
|:-----------|:-------:|:------------|
| [Next.js](https://nextjs.org/) | `16.1.x` | React framework with App Router & Turbopack |
| [React](https://react.dev/) | `19.2.x` | UI library with Actions & Server Components |
| [TailwindCSS](https://tailwindcss.com/) | `4.x` | Utility-first CSS (CSS-first config) |
| [Zustand](https://zustand-demo.pmnd.rs/) | `5.x` | Lightweight state management |
| [TanStack Query](https://tanstack.com/query) | `5.x` | Server state management |
| [Radix UI](https://www.radix-ui.com/) | `latest` | Accessible UI primitives |

### Backend

| Technology | Version | Description |
|:-----------|:-------:|:------------|
| [FastAPI](https://fastapi.tiangolo.com/) | `0.115+` | High-performance Python web framework |
| [PostgreSQL](https://www.postgresql.org/) | `15+` | Relational database |
| [SQLAlchemy](https://www.sqlalchemy.org/) | `2.0` | Async ORM |
| [Alembic](https://alembic.sqlalchemy.org/) | `1.14+` | Database migrations |
| [Pydantic](https://pydantic.dev/) | `2.x` | Data validation |
| [OpenAI API](https://openai.com/) | `GPT-4` | AI integration |

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Installation |
|------|---------|--------------|
| Python | 3.11+ | [python.org](https://www.python.org/downloads/) |
| Node.js | 20+ | [nodejs.org](https://nodejs.org/) |
| pnpm | 9+ | `npm install -g pnpm` |
| uv | Latest | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| Docker | Latest | [docker.com](https://www.docker.com/) |

### One-Command Setup

```bash
# Clone and enter directory
git clone https://github.com/staruhub/Healthapp.git && cd Healthapp

# Start database
docker-compose up -d

# Terminal 1: Backend
cd backend && cp .env.example .env
uv sync && uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8001

# Terminal 2: Frontend
cd frontend && echo "NEXT_PUBLIC_API_URL=http://localhost:8001" > .env.local
pnpm install && pnpm dev
```

🎉 **Access the app:**
- 🌐 Frontend: [http://localhost:3000](http://localhost:3000)
- 📚 API Docs: [http://localhost:8001/docs](http://localhost:8001/docs)

---

## ⚙️ Configuration

### Backend `.env`

```env
# Database
DATABASE_URL=postgresql+asyncpg://healthapp:healthapp_dev_2024@localhost:5432/healthapp_db

# Security (REQUIRED: openssl rand -hex 32)
SECRET_KEY=your-super-secret-key-here

# AI Mode: "mock" (dev) | "real" (prod)
AI_MODE=mock
OPENAI_API_KEY=sk-...  # Required when AI_MODE=real

# CORS
CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8001
NEXT_PUBLIC_AI_MODE=mock
```

---

## 📚 API Documentation

### Endpoints Overview

| Method | Endpoint | Description |
|:------:|----------|-------------|
| `POST` | `/api/v1/auth/register` | User registration |
| `POST` | `/api/v1/auth/login` | User login |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |
| `GET` | `/api/v1/food/logs` | Get food logs |
| `POST` | `/api/v1/food/parse` | AI food parsing |
| `GET` | `/api/v1/body/logs` | Get body metrics |
| `GET` | `/api/v1/dashboard/summary` | Dashboard data |
| `POST` | `/api/v1/chat` | AI chat assistant |

Interactive documentation available at:
- **Swagger UI**: `GET /docs`
- **ReDoc**: `GET /redoc`
- **Health Check**: `GET /health`

---

## 📁 Project Structure

```
Healthapp/
├── backend/                    # FastAPI Backend
│   ├── app/
│   │   ├── api/v1/            # API Routes
│   │   │   ├── auth.py        # Authentication
│   │   │   ├── food.py        # Food logging
│   │   │   ├── body.py        # Body metrics
│   │   │   ├── workout.py     # Workout tracking
│   │   │   ├── dashboard.py   # Dashboard
│   │   │   ├── chat.py        # AI chat
│   │   │   └── ingredient.py  # Ingredient analysis
│   │   ├── models/            # SQLAlchemy Models
│   │   ├── schemas/           # Pydantic Schemas
│   │   ├── services/ai/       # AI Service Layer
│   │   └── utils/             # Utilities
│   ├── alembic/               # Database Migrations
│   └── pyproject.toml
│
├── frontend/                   # Next.js Frontend
│   ├── app/                   # App Router Pages
│   │   ├── (auth)/            # Auth pages
│   │   └── (main)/            # Main app pages
│   ├── components/            # React Components
│   │   ├── ui/                # Base UI
│   │   ├── chat/              # Chat components
│   │   └── onboarding/        # Onboarding flow
│   ├── hooks/                 # Custom React Hooks
│   ├── store/                 # Zustand State
│   ├── lib/                   # Utilities
│   └── types/                 # TypeScript Types
│
├── openspec/                  # Project Specifications
├── docker-compose.yml
└── README.md
```

---

## 🔧 Troubleshooting

<details>
<summary><b>Database Connection Failed</b></summary>

```bash
# Check container status
docker ps | grep postgres

# Restart container
docker-compose restart

# View logs
docker-compose logs postgres
```

</details>

<details>
<summary><b>Port Already in Use</b></summary>

```bash
# Find process
lsof -i :8001

# Kill process
kill -9 <PID>

# Or use different port
uv run uvicorn app.main:app --reload --port 8002
```

</details>

<details>
<summary><b>Frontend Cannot Connect to Backend</b></summary>

1. Verify backend: `curl http://localhost:8001/health`
2. Check `NEXT_PUBLIC_API_URL` in `.env.local`
3. Verify CORS settings in backend `.env`
4. Clear browser cache and restart

</details>

<details>
<summary><b>Token/Authentication Issues</b></summary>

```bash
# Clear stored tokens in browser
localStorage.removeItem('auth-storage')
# Then refresh the page
```

</details>

---

## ❓ FAQ

<details>
<summary><b>What is AI_MODE?</b></summary>

- `mock`: Returns pre-defined responses (no API costs, for development)
- `real`: Uses OpenAI GPT-4 API (requires `OPENAI_API_KEY`)

</details>

<details>
<summary><b>How to reset the database?</b></summary>

```bash
dropdb healthapp_db && createdb healthapp_db
cd backend && uv run alembic upgrade head
```

</details>

<details>
<summary><b>How to generate a secure SECRET_KEY?</b></summary>

```bash
openssl rand -hex 32
```

</details>

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** feature branch: `git checkout -b feature/AmazingFeature`
3. **Commit** changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to branch: `git push origin feature/AmazingFeature`
5. **Open** Pull Request

### Commit Convention

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting |
| `refactor` | Code refactoring |
| `test` | Adding tests |
| `chore` | Maintenance |

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) for details.

---

## 🇨🇳 中文文档

<details>
<summary><b>点击展开中文说明</b></summary>

### 功能特性

- 🍽️ **智能食物记录** - AI 驱动的食物识别，自动计算营养成分
- ⚖️ **身体指标追踪** - 追踪体重、BMI、体脂率和健身进度
- 🏋️ **运动追踪** - 记录运动时长、消耗卡路里和运动强度
- 🔬 **成分分析** - 扫描分析食品配料，提供健康洞察
- 📊 **数据仪表盘** - 交互式图表可视化健康趋势
- 🤖 **AI 健康助手** - 获取个性化营养和健身建议

### 快速开始

```bash
# 克隆仓库
git clone https://github.com/staruhub/Healthapp.git && cd Healthapp

# 启动数据库
docker-compose up -d

# 启动后端
cd backend && cp .env.example .env
uv sync && uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8001

# 启动前端（新终端）
cd frontend && echo "NEXT_PUBLIC_API_URL=http://localhost:8001" > .env.local
pnpm install && pnpm dev
```

### 环境要求

| 依赖 | 版本 | 安装方式 |
|------|------|----------|
| Python | 3.11+ | [python.org](https://www.python.org/downloads/) |
| Node.js | 20+ | [nodejs.org](https://nodejs.org/) |
| pnpm | 9+ | `npm install -g pnpm` |
| uv | 最新版 | `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| Docker | 最新版 | [docker.com](https://www.docker.com/) |

</details>

---

<div align="center">

**[staruhub](https://github.com/staruhub)**

⭐ **Star this repo if you find it helpful!** ⭐

</div>
]]>
