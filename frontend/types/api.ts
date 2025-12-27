// Auth types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface RefreshTokenRequest {
  refresh_token: string
}

// Profile types
export interface ProfileData {
  name: string
  age: number
  gender: "male" | "female" | "other"
  height: number // cm
  weight: number // kg
  goal: "cut" | "bulk" | "gain" | "maintain"
  target_calories?: number
}

export interface User {
  id: string
  email: string
  name: string
  profile?: ProfileData
  created_at: string
}

// Food logging types
export type MealType = "breakfast" | "lunch" | "dinner" | "snack"

export interface FoodParseRequest {
  text: string
  meal_type?: MealType
}

export interface FoodItem {
  name: string
  calories_min: number
  calories_max: number
  portion: string
  meal_type?: MealType
}

export interface FoodLog {
  id: string
  user_id: string
  date: string
  food_items: FoodItem[]
  total_calories: number
  created_at: string
}

// Body tracking types
export interface BodyLog {
  id: string
  user_id: string
  date: string
  weight_kg: number
  notes?: string
  created_at?: string
}

export interface WorkoutLog {
  id: string
  user_id: string
  date: string
  workout_type: string
  duration_minutes: number
  notes?: string
  created_at?: string
}

// Ingredient analysis types
export interface IngredientAnalysisRequest {
  text: string
  user_goal?: string
}

export interface IngredientVerdict {
  category: string // "推荐", "谨慎", "不推荐"
  reason: string
  suggestions: string[]
}

export interface IngredientAnalysisResult {
  verdict: IngredientVerdict
  details: string
}

export interface IngredientCheckResponse {
  id: string
  user_id: string
  raw_input: string
  result_json: {
    verdict: IngredientVerdict
    details: string
  }
}

// Daily insights types
export interface DailyInsight {
  id: string
  user_id: string
  date: string
  gap_analysis: string
  attribution: string[]
  recommendations: string[]
  cautions?: string[]
  created_at: string
}

export interface GenerateInsightRequest {
  date: string
}

// Chat types
export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface ChatRequest {
  message: string
  context?: {
    page?: string
    date?: string
  }
}

export interface ChatResponse {
  response: string
}

export interface ChatHistoryItem {
  id: string
  message: string
  response: string
  context_json?: {
    page?: string
    date?: string
  }
}

// Dashboard types
export interface DashboardData {
  weight_trends: {
    date: string
    weight: number
  }[]
  completion_rate: {
    calories: number
    workouts: number
  }
  weekly_insights: string[]
}