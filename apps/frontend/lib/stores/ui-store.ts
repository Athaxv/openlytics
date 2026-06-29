"use client";

import { create } from "zustand";

type UIState = {
  sidebarHoverOpen: boolean;
  mobileNavOpen: boolean;
  setSidebarHoverOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  sidebarHoverOpen: false,
  mobileNavOpen: false,
  setSidebarHoverOpen: (open) => set({ sidebarHoverOpen: open }),
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
}));
