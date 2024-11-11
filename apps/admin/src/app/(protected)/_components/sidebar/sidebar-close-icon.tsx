"use client";

import { ArrowLeftSVG } from "@natcore/design-system-core/src/icons/arrow-left";
import { useSidebar } from "./sidebar-provider";
import { twMerge } from "tailwind-merge";

export const SidebarCloseIcon = ({ className }: { className?: string }) => {
  const close = useSidebar((s) => s.close);

  return (
    <div
      className={twMerge(
        "cursor-pointer text-primary-contrast-base md:hidden",
        className,
      )}
      onClick={close}
    >
      <ArrowLeftSVG className="size-10" />
    </div>
  );
};
