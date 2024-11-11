"use client";

import { createContext, useContext, useRef } from "react";
import { create } from "zustand";

type SidebarApi = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
};

const createSidebarStore = create<SidebarApi>();
const SidebarContext = createContext<ReturnType<
  typeof createSidebarStore
> | null>(null);

export const SidebarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storeRef = useRef<ReturnType<typeof createSidebarStore> | null>(null);

  if (storeRef.current === null) {
    storeRef.current = createSidebarStore((set) => ({
      isOpen: false,
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      close: () => set({ isOpen: false }),
    }));
  }

  return (
    <SidebarContext.Provider value={storeRef.current}>
      {children}
    </SidebarContext.Provider>
  );
};

export function useSidebar(): SidebarApi;
export function useSidebar<U>(selector: (state: SidebarApi) => U): U;
export function useSidebar<U>(selector?: (state: SidebarApi) => U) {
  const store = useContext(SidebarContext);

  if (store === null) {
    throw new Error("useSidebar must be used within a CartProvider");
  }

  return selector ? store(selector) : store();
}
