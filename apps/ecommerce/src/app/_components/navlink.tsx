"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from "tailwind-merge";

type NavLinkProps = {
  children: React.ReactNode;
  href: string;
  className?: string;
  underlineClassName?: string;
  onClick?: () => void;
};

export const NavLink = ({
  children,
  href,
  className,
  underlineClassName,
  onClick,
}: NavLinkProps) => {
  const isActive = href === usePathname();

  return (
    <Link
      href={href}
      className={twMerge(
        "group relative text-lg transition-all duration-300",
        className,
      )}
      onClick={onClick}
    >
      {children}
      <span
        className={twMerge(
          "absolute left-1/2 block h-[2px] w-0 bg-current transition-all duration-300 group-hover:left-0 group-hover:w-full",
          underlineClassName,
          isActive && "left-0 w-full",
        )}
      />
    </Link>
  );
};
