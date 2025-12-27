"use client"

import { useState, useRef, useEffect } from "react"
import { usePathname } from "next/navigation"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useChat } from "@/hooks/use-chat"
import { X, Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatWindowProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatWindow({ isOpen, onClose }: ChatWindowProps) {
  const [input, setInput] = useState("")
  const pathname = usePathname()
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
      page: pathname || undefined,
      date: format(new Date(), "yyyy-MM-dd"),
    }

    sendMessage.mutate({ message: input, context })
    setInput("")
  }

  const quickCommands = [
    { label: "分析今日", command: "/analyze_today" },
    { label: "成分分析", command: "/ingredient" },
  ]

  const handleQuickCommand = (command: string) => {
    setInput(command)
  }

  return (
    <div
      className={cn(
        "fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] transition-all duration-300 z-50",
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">AI助手</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScrollArea className="h-96" ref={scrollRef}>
            <div className="space-y-4 pr-4">
              {messages.length === 0 ? (
                <div className="text-center text-sm text-muted-foreground py-8">
                  <p>👋 你好!我是你的AI健康助手</p>
                  <p className="mt-2">有什么可以帮你的吗?</p>
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
                        "max-w-[80%] rounded-lg px-4 py-2 text-sm",
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
                  <div className="bg-muted rounded-lg px-4 py-2">
                    <LoadingSpinner size="sm" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
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
              placeholder="输入消息..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={sendMessage.isPending}
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
            ⚠️ AI生成内容仅供参考,不构成医疗建议
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
