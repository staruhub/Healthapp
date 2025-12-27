import type {
  User,
  FoodLog,
  BodyLog,
  WorkoutLog,
  IngredientAnalysisResult,
  DailyInsight,
  DashboardData,
} from "@/types/api"

export const mockUser: User = {
  id: "mock-user-1",
  email: "demo@example.com",
  name: "演示用户",
  profile: {
    name: "演示用户",
    age: 30,
    gender: "male",
    height: 175,
    weight: 70,
    goal: "maintain",
    target_calories: 2000,
  },
  created_at: new Date().toISOString(),
}

export const mockFoodLogs: FoodLog[] = [
  {
    id: "food-1",
    user_id: "mock-user-1",
    date: new Date().toISOString().split("T")[0],
    food_items: [
      {
        name: "煎蛋",
        calories_min: 150,
        calories_max: 180,
        portion: "2个",
        meal_type: "breakfast",
      },
      {
        name: "全麦面包",
        calories_min: 200,
        calories_max: 250,
        portion: "2片",
        meal_type: "breakfast",
      },
    ],
    total_calories: 415,
    created_at: new Date().toISOString(),
  },
]

export const mockBodyLogs: BodyLog[] = [
  {
    id: "body-1",
    user_id: "mock-user-1",
    date: new Date().toISOString().split("T")[0],
    weight_kg: 70.5,
    created_at: new Date().toISOString(),
  },
]

export const mockWorkoutLogs: WorkoutLog[] = [
  {
    id: "workout-1",
    user_id: "mock-user-1",
    date: new Date().toISOString().split("T")[0],
    workout_type: "跑步",
    duration_minutes: 30,
    notes: "轻松跑",
    created_at: new Date().toISOString(),
  },
]

export const mockIngredientAnalysis: IngredientAnalysisResult = {
  verdict: {
    category: "不推荐",
    reason: "含有较多添加糖和人工添加剂,不利于健康目标",
    suggestions: [
      "建议选择无糖或低糖替代品",
      "食用香精和焦糖色属于添加剂,尽量避免",
    ],
  },
  details: "该产品主要成分包括水、白砂糖、食用香精、柠檬酸、焦糖色",
}

export const mockDailyInsight: DailyInsight = {
  id: "insight-1",
  user_id: "mock-user-1",
  date: new Date().toISOString().split("T")[0],
  gap_analysis: "今日摄入热量约415卡,距离目标2000卡还有1585卡缺口",
  attribution: ["早餐摄入较少,建议增加蛋白质", "运动消耗约300卡,表现良好"],
  recommendations: [
    "午餐和晚餐需要补充足够的蛋白质和碳水化合物",
    "保持当前运动强度",
    "多喝水,保持每日2L水分摄入",
  ],
  cautions: ["以上建议仅供参考,如有疾病请咨询医生"],
  created_at: new Date().toISOString(),
}

export const mockDashboardData: DashboardData = {
  weight_trends: [
    { date: "2024-01-01", weight: 72.0 },
    { date: "2024-01-02", weight: 71.8 },
    { date: "2024-01-03", weight: 71.5 },
    { date: "2024-01-04", weight: 71.2 },
    { date: "2024-01-05", weight: 71.0 },
    { date: "2024-01-06", weight: 70.8 },
    { date: "2024-01-07", weight: 70.5 },
  ],
  completion_rate: {
    calories: 75,
    workouts: 85,
  },
  weekly_insights: [
    "本周体重下降1.5kg,进展良好",
    "运动完成率85%,超出预期",
    "饮食控制较好,建议继续保持",
  ],
}
