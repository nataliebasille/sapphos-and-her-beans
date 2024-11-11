"use client";

import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children: React.ReactNode;
  variant: "primary" | "secondary" | "surface" | "danger";
  style?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export function Button({
  children,
  variant = "surface",
  style = "solid",
  size = "md",
  className,
  disabled,
  onClick,
}: ButtonProps) {
  const classes = twMerge(
    "btn",
    variant === "primary" && "btn-primary",
    variant === "secondary" && "btn-secondary",
    variant === "surface" && "btn-surface",
    variant === "danger" && "bg-red-700 text-white hover:bg-red-800",
    style === "outline" && "btn-outline",
    style === "ghost" && "btn-ghost",
    variant === "primary" && style === "outline" && "hover:text-white",
    size === "sm" && "btn-sm",
    size === "md" && "btn-md",
    size === "lg" && "btn-lg",
    className,
  );

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
