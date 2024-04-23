import { create } from "zustand";

const ChatVariant = {
  CHAT: "CHAT",
  COMMUNITY: "COMMUNITY",
};

const useChatSidebar = create((set) => ({
  collapsed: false,
  variant: ChatVariant.CHAT,
  onExpand: () => set(() => ({ collapsed: false })),
  onCollapse: () => set(() => ({ collapsed: true })),
  onChangeVariant: (variant) => set(() => ({ variant })),
}));

export { ChatVariant, useChatSidebar };
