"use client"

import { usePathname } from "next/navigation"
import { useChatStore } from "@/store/chat-store"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import { ChatWindow } from "./chat-window"

export function ChatWidget() {
  const pathname = usePathname()
  const { isOpen, toggleChat } = useChatStore()

  // 在认证和引导页面隐藏聊天
  const hiddenPaths = ["/login", "/register", "/onboarding"]
  if (hiddenPaths.some((path) => pathname?.startsWith(path))) {
    return null
  }

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
        onClick={toggleChat}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      <ChatWindow isOpen={isOpen} onClose={toggleChat} />
    </>
  )
}
