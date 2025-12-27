"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClientOnly } from "@/components/ui/client-only"

const profileSchema = z.object({
  name: z.string().min(2, "姓名至少需要2个字符"),
  age: z.number().min(10, "年龄至少10岁").max(120, "请输入有效年龄"),
  gender: z.enum(["male", "female", "other"], { message: "请选择性别" }),
  height: z.number().min(100, "身高至少100cm").max(250, "请输入有效身高"),
  weight: z.number().min(30, "体重至少30kg").max(300, "请输入有效体重"),
})

export type ProfileFormData = z.infer<typeof profileSchema>

interface ProfileFormProps {
  onSubmit: (data: ProfileFormData) => void
  defaultValues?: Partial<ProfileFormData>
}

export function ProfileForm({ onSubmit, defaultValues }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema) as any,
    defaultValues: defaultValues || {
      name: "",
      age: 25,
      gender: "male",
      height: 170,
      weight: 65,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">姓名</Label>
          <Input
            id="name"
            placeholder="请输入您的姓名"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="age">年龄</Label>
            <Input
              id="age"
              type="number"
              placeholder="25"
              {...register("age", { valueAsNumber: true })}
            />
            {errors.age && (
              <p className="text-sm text-destructive">{errors.age.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">性别</Label>
            <ClientOnly
              fallback={
                <div className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm">
                  男
                </div>
              }
            >
              <Select
                onValueChange={(value) => setValue("gender", value as "male" | "female" | "other")}
                defaultValue={defaultValues?.gender || "male"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择性别" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">男</SelectItem>
                  <SelectItem value="female">女</SelectItem>
                  <SelectItem value="other">其他</SelectItem>
                </SelectContent>
              </Select>
            </ClientOnly>
            {errors.gender && (
              <p className="text-sm text-destructive">{errors.gender.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">身高 (cm)</Label>
            <Input
              id="height"
              type="number"
              placeholder="170"
              {...register("height", { valueAsNumber: true })}
            />
            {errors.height && (
              <p className="text-sm text-destructive">{errors.height.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">体重 (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="65.0"
              {...register("weight", { valueAsNumber: true })}
            />
            {errors.weight && (
              <p className="text-sm text-destructive">{errors.weight.message}</p>
            )}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        下一步
      </Button>
    </form>
  )
}