"use client";
import { useSidebar } from "./sidebar-provider";

export function SidebarToggle() {
  const { isOpen } = useSidebar();

  return (
    <input
      type="checkbox"
      className="layer-drawer-toggle"
      checked={isOpen}
      readOnly
    />
  );
}
