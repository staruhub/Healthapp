import type { ReactNode } from "react"
import { AppShell } from "@/components/app-shell"
import { ChatWidget } from "@/components/chat/chat-widget"

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppShell>{children}</AppShell>
      <ChatWidget />
    </>
  )
}
