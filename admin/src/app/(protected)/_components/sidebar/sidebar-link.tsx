"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

export const SidebarLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname.startsWith(href);
  return (
    <li
      className={twMerge(
        "list-item !rounded-none border-b-[1px] border-t-[1px] border-surface-900 bg-primary-900 !p-4 text-sm font-bold uppercase tracking-wider transition-all duration-150 hover:opacity-100",
        isActive && "active",
      )}
    >
      <Link href={href} prefetch>
        {children}
      </Link>
    </li>
  );
};
