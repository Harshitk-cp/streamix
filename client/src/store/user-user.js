import { create } from "zustand";

export const useUserStore = create((set) => ({
  user: {},
  setUser: () => set({ user: JSON.parse(localStorage.getItem("user")) }),
}));
