"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { PageTransition } from "@/components/page-transition"
import { useIngredientAnalysis, useIngredientHistory } from "@/hooks/use-ingredient"
import { FlaskConical, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import type { IngredientAnalysisResult } from "@/types/api"
import { toast } from "sonner"

// Map Chinese verdict categories to config keys
const getVerdictKey = (category: string): "recommended" | "caution" | "not_recommended" => {
  if (category === "推荐") return "recommended"
  if (category === "谨慎") return "caution"
  return "not_recommended"
}

const verdictConfig = {
  recommended: { label: "推荐", color: "bg-green-500", icon: CheckCircle },
  caution: { label: "谨慎", color: "bg-yellow-500", icon: AlertCircle },
  not_recommended: { label: "不推荐", color: "bg-red-500", icon: XCircle },
}

export default function IngredientPage() {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<IngredientAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyze = useIngredientAnalysis()
  const { data: history, isLoading: historyLoading } = useIngredientHistory()

  const handleAnalyze = async () => {
    if (!input.trim()) return
    setError(null)
    try {
      const data = await analyze.mutateAsync({ text: input })
      setResult(data)
    } catch (err: any) {
      const message = err.response?.data?.detail || "分析失败，请稍后重试"
      setError(message)
      toast.error(message)
    }
  }

  const verdictKey = result ? getVerdictKey(result.verdict.category) : null
  const VerdictIcon = verdictKey ? verdictConfig[verdictKey].icon : null

  return (
    <PageTransition className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">成分分析</h1>

      <Card>
        <CardHeader>
          <CardTitle>分析配料表</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="粘贴食品配料表,例如: 水、白砂糖、食用香精、柠檬酸、焦糖色..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={4}
          />
          <Button
            onClick={handleAnalyze}
            className="w-full"
            disabled={analyze.isPending || !input.trim()}
          >
            {analyze.isPending ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                分析中...
              </>
            ) : (
              "开始分析"
            )}
          </Button>

          {error && (
            <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950/20 p-3 rounded">
              {error}
            </div>
          )}

          {result && verdictKey && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-3">
                {VerdictIcon && <VerdictIcon className="h-6 w-6" />}
                <Badge className={verdictConfig[verdictKey].color}>
                  {verdictConfig[verdictKey].label}
                </Badge>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">分析原因</h3>
                <p className="text-sm">{result.verdict.reason}</p>
              </div>

              {result.verdict.suggestions.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold">建议</h3>
                  <ul className="space-y-2">
                    {result.verdict.suggestions.map((rec, idx) => (
                      <li key={idx} className="text-sm flex gap-2">
                        <span className="text-muted-foreground">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.details && (
                <div className="space-y-2">
                  <h3 className="font-semibold">详细说明</h3>
                  <p className="text-sm text-muted-foreground">{result.details}</p>
                </div>
              )}

              <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded">
                💡 此分析基于您的健康目标,仅供参考,不构成医疗建议
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>分析历史</CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : history && history.length > 0 ? (
            <div className="space-y-3">
              {history.map((item) => {
                const historyVerdictKey = getVerdictKey(item.result_json?.verdict?.category || "不推荐")
                return (
                  <div key={item.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.raw_input}
                      </p>
                      <Badge className={verdictConfig[historyVerdictKey].color}>
                        {verdictConfig[historyVerdictKey].label}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <EmptyState
              icon={<FlaskConical className="h-12 w-12" />}
              title="还没有分析记录"
              description="开始分析食品配料表"
            />
          )}
        </CardContent>
      </Card>
    </PageTransition>
  )
}