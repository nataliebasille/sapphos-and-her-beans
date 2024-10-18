"use client";

import { HamburgerSVG } from "@natcore/design-system-core";
import { useSidebar } from "./sidebar/sidebar-provider";

export function MenuIcon() {
  const toggle = useSidebar((x) => x.toggle);

  return (
    <HamburgerSVG
      className="size-10 cursor-pointer md:hidden"
      onClick={toggle}
    />
  );
}
