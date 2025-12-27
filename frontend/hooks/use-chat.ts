import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import apiClient from "@/lib/api-client"
import type { ChatMessage, ChatRequest, ChatResponse } from "@/types/api"
import { toast } from "sonner"

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const sendMessage = useMutation({
    mutationFn: async (request: ChatRequest) => {
      const { data } = await apiClient.post<ChatResponse>("/api/v1/chat/message", request)
      return data
    },
    onSuccess: (data, variables) => {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: variables.message },
        { role: "assistant", content: data.response },
      ])
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "发送失败")
    },
  })

  const clearMessages = () => setMessages([])

  return { messages, sendMessage, clearMessages }
}
