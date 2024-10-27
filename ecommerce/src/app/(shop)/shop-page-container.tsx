"use client";

import { usePathname } from "next/navigation";
import { PageContainer } from "../_components/page-container";

export default function ShopPageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();

  return path === "/" ?
      <>{children}</>
    : <PageContainer>{children}</PageContainer>;
}
