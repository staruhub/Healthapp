import { create } from "zustand"

interface ChatState {
  isOpen: boolean
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
}))
