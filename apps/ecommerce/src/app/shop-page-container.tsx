"use client";

import { usePathname } from "next/navigation";
import { PageContainer } from "./_components/page-container";

export function ShopPageContainer({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const isCoffeePage = /^\/shop\/[^/]+$/.test(path);

  return path === "/" ?
      <>{children}</>
    : <PageContainer
        className={isCoffeePage ? "h-dvh" : undefined}
        contentClassName={isCoffeePage ? "h-full pt-[89px]" : undefined}
      >
        {children}
      </PageContainer>;
}
