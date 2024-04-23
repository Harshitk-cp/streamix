import { create } from "zustand";

export const useCreatorSidebar = create((set) => ({
  collapsed: false,
  onExpand: () => set({ collapsed: false }),
  onCollapse: () => set({ collapsed: true }),
}));
