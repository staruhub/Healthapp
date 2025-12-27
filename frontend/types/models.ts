// Domain model types
export type GoalType = "cut" | "bulk" | "gain" | "maintain"
export type Gender = "male" | "female" | "other"
export type MealType = "breakfast" | "lunch" | "dinner" | "snack"
export type Verdict = "recommended" | "caution" | "not_recommended"

export interface UserProfile {
  name: string
  age: number
  gender: Gender
  height: number // cm
  weight: number // kg
  goal: GoalType
  target_calories?: number
}
