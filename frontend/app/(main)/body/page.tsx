"use client"

import { useState } from "react"
import { format, subDays } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { PageTransition } from "@/components/page-transition"
import { useBodyLogs, useAddBodyLog, useWorkoutLogs, useAddWorkoutLog } from "@/hooks/use-body-logs"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Activity, Dumbbell } from "lucide-react"

export default function BodyPage() {
  const [days, setDays] = useState(7)
  const endDate = format(new Date(), "yyyy-MM-dd")
  const startDate = format(subDays(new Date(), days), "yyyy-MM-dd")

  const [weight, setWeight] = useState("")
  const [workoutType, setWorkoutType] = useState("")
  const [duration, setDuration] = useState("")
  const [notes, setNotes] = useState("")

  const { data: bodyLogs, isLoading: bodyLoading } = useBodyLogs(startDate, endDate)
  const { data: workoutLogs, isLoading: workoutLoading } = useWorkoutLogs(startDate, endDate)
  const addBodyLog = useAddBodyLog()
  const addWorkoutLog = useAddWorkoutLog()

  const handleAddWeight = () => {
    const weightNum = parseFloat(weight)
    if (!isNaN(weightNum) && weightNum > 0) {
      addBodyLog.mutate(
        { date: endDate, weight_kg: weightNum },
        { onSuccess: () => setWeight("") }
      )
    }
  }

  const handleAddWorkout = () => {
    const durationNum = parseInt(duration, 10)
    if (workoutType.trim() && !isNaN(durationNum) && durationNum > 0) {
      addWorkoutLog.mutate(
        { date: endDate, workout_type: workoutType.trim(), duration_minutes: durationNum, notes: notes.trim() || undefined },
        {
          onSuccess: () => {
            setWorkoutType("")
            setDuration("")
            setNotes("")
          },
        }
      )
    }
  }

  const chartData = bodyLogs?.map((log) => ({
    date: format(new Date(log.date), "MM/dd"),
    weight: log.weight_kg,
  })) || []

  return (
    <PageTransition className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">体重运动</h1>

      <Tabs defaultValue="weight" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="weight">体重追踪</TabsTrigger>
          <TabsTrigger value="workout">运动记录</TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>记录体重</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">体重 (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="70.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddWeight} className="w-full" disabled={addBodyLog.isPending}>
                    {addBodyLog.isPending ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                    记录
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>体重趋势</CardTitle>
              <div className="flex gap-2">
                <Button variant={days === 7 ? "default" : "outline"} size="sm" onClick={() => setDays(7)}>
                  7天
                </Button>
                <Button variant={days === 30 ? "default" : "outline"} size="sm" onClick={() => setDays(30)}>
                  30天
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {bodyLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="hsl(var(--primary))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState
                  icon={<Activity className="h-12 w-12" />}
                  title="还没有数据"
                  description="开始记录您的体重变化"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>记录运动</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workoutType">运动类型</Label>
                  <Input
                    id="workoutType"
                    placeholder="如: 跑步、游泳"
                    value={workoutType}
                    onChange={(e) => setWorkoutType(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">时长 (分钟)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">备注</Label>
                <Textarea
                  id="notes"
                  placeholder="运动强度、感受等"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                />
              </div>
              <Button onClick={handleAddWorkout} className="w-full" disabled={addWorkoutLog.isPending}>
                {addWorkoutLog.isPending ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                记录运动
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>运动历史</CardTitle>
            </CardHeader>
            <CardContent>
              {workoutLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : workoutLogs && workoutLogs.length > 0 ? (
                <div className="space-y-3">
                  {workoutLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{log.workout_type}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(log.date), "yyyy-MM-dd")} · {log.duration_minutes} 分钟
                          </p>
                          {log.notes && <p className="text-sm mt-2">{log.notes}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={<Dumbbell className="h-12 w-12" />}
                  title="还没有记录"
                  description="开始记录您的运动"
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageTransition>
  )
}