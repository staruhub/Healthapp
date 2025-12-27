"use client"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { PageTransition } from "@/components/page-transition"
import { useChat } from "@/hooks/use-chat"
import { Send, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ChatPage() {
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const { messages, sendMessage } = useChat()

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = () => {
    if (!input.trim() || sendMessage.isPending) return

    const context = {
      page: "/chat",
      date: format(new Date(), "yyyy-MM-dd"),
    }

    sendMessage.mutate({ message: input, context })
    setInput("")
  }

  const quickCommands = [
    { label: "分析今日饮食", command: "/analyze_today" },
    { label: "分析配料表", command: "/ingredient " },
  ]

  const handleQuickCommand = (command: string) => {
    setInput(command)
  }

  return (
    <PageTransition className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">AI助手</h1>
      </div>

      <Card className="flex flex-col h-[calc(100vh-220px)]">
        <CardHeader>
          <CardTitle>智能健康对话</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col space-y-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-12 space-y-4">
                  <Sparkles className="h-12 w-12 mx-auto opacity-50" />
                  <div>
                    <p className="text-lg">👋 你好！我是你的AI健康助手</p>
                    <p className="text-sm mt-2">
                      我可以帮你分析今日饮食、解读配料表、提供健康建议
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-3 whitespace-pre-wrap",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {sendMessage.isPending && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg px-4 py-3">
                    <LoadingSpinner size="sm" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2 flex-wrap">
            {quickCommands.map((cmd) => (
              <Button
                key={cmd.command}
                variant="outline"
                size="sm"
                onClick={() => handleQuickCommand(cmd.command)}
              >
                {cmd.label}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="输入消息，或使用快捷命令..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              disabled={sendMessage.isPending}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={sendMessage.isPending || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            ⚠️ AI生成的健康建议仅供参考，不构成医疗诊断或治疗建议
          </p>
        </CardContent>
      </Card>
    </PageTransition>
  )
}
