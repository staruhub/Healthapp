"use client"

import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { PageTransition } from "@/components/page-transition"
import { useDailyInsight, useGenerateInsight } from "@/hooks/use-insights"
import { Lightbulb, Sparkles, AlertTriangle } from "lucide-react"

export default function InsightsPage() {
  const today = format(new Date(), "yyyy-MM-dd")
  const { data: insight, isLoading } = useDailyInsight(today)
  const generate = useGenerateInsight()

  const handleGenerate = () => {
    generate.mutate({ date: today })
  }

  return (
    <PageTransition className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">每日洞察</h1>
        <Button onClick={handleGenerate} disabled={generate.isPending}>
          {generate.isPending ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              生成中...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              生成洞察
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      ) : insight ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>今日分析</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">差距分析</h3>
                <p className="text-muted-foreground">{insight.gap_analysis}</p>
              </div>

              {insight.attribution && insight.attribution.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">原因归因</h3>
                  <ul className="space-y-2">
                    {insight.attribution.map((item, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-muted-foreground">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {insight.recommendations && insight.recommendations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4" />
                    行动建议
                  </h3>
                  <ul className="space-y-2">
                    {insight.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-primary">→</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {insight.cautions && insight.cautions.length > 0 && (
                <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <AlertTriangle className="h-4 w-4" />
                    注意事项
                  </h3>
                  <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                    {insight.cautions.map((caution, idx) => (
                      <li key={idx}>{caution}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <p className="text-xs text-center text-muted-foreground">
            💡 以上洞察由AI生成,仅供参考,不构成医疗建议
          </p>
        </div>
      ) : (
        <EmptyState
          icon={<Lightbulb className="h-16 w-16" />}
          title="还没有今日洞察"
          description={'点击"生成洞察"按钮，基于您今天的数据生成个性化建议'}
          action={
            <Button onClick={handleGenerate} disabled={generate.isPending}>
              {generate.isPending ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  生成洞察
                </>
              )}
            </Button>
          }
        />
      )}
    </PageTransition>
  )
}