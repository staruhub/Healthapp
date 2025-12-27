"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StepIndicator } from "@/components/onboarding/step-indicator"
import { ProfileForm, type ProfileFormData } from "@/components/onboarding/profile-form"
import { GoalSelector } from "@/components/onboarding/goal-selector"
import { TargetCalculator } from "@/components/onboarding/target-calculator"
import { useUpdateProfile } from "@/hooks/use-profile"
import type { GoalType } from "@/types/models"

type OnboardingStep = 1 | 2 | 3

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>(1)
  const [profileData, setProfileData] = useState<ProfileFormData | null>(null)
  const [goal, setGoal] = useState<GoalType | null>(null)

  const updateProfile = useUpdateProfile()

  const handleProfileSubmit = (data: ProfileFormData) => {
    setProfileData(data)
    setStep(2)
  }

  const handleGoalSubmit = (selectedGoal: GoalType) => {
    setGoal(selectedGoal)
    setStep(3)
  }

  const handleFinalSubmit = (targetCalories: number) => {
    if (profileData && goal) {
      updateProfile.mutate({
        ...profileData,
        goal,
        target_calories: targetCalories,
      })
    }
  }

  const stepTitles = {
    1: "个人信息",
    2: "健康目标",
    3: "热量计算",
  }

  const stepDescriptions = {
    1: "请填写您的基本信息,帮助我们为您定制计划",
    2: "选择您的健康目标,我们将据此调整建议",
    3: "根据您的信息,计算每日目标热量",
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card>
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold text-center">
                {stepTitles[step]}
              </CardTitle>
              <CardDescription className="text-center">
                {stepDescriptions[step]}
              </CardDescription>
            </div>
            <StepIndicator currentStep={step} totalSteps={3} />
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <ProfileForm
                onSubmit={handleProfileSubmit}
                defaultValues={profileData || undefined}
              />
            )}

            {step === 2 && (
              <GoalSelector
                onSubmit={handleGoalSubmit}
                onBack={() => setStep(1)}
                defaultValue={goal || undefined}
              />
            )}

            {step === 3 && profileData && goal && (
              <TargetCalculator
                profile={{ ...profileData, goal }}
                onSubmit={handleFinalSubmit}
                onBack={() => setStep(2)}
                isSubmitting={updateProfile.isPending}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}