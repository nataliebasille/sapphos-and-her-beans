"use client";

import { useSidebar } from "./sidebar-provider";

export const SidebarOverlay = () => {
  const toggle = useSidebar((x) => x.toggle);

  return <div className="layer-overlay" onClick={toggle} />;
};
