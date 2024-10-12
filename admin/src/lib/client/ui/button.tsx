import { twMerge } from "tailwind-merge";

type ButtonProps = {
  children: React.ReactNode;
  variant: "primary" | "secondary" | "surface" | "danger";
  style?: "solid" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

const variantClasses: Partial<
  Record<Exclude<ButtonProps["variant"], undefined>, string>
> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  surface: "btn-surface",
  danger: "bg-red-700 text-white hover:bg-red-800 border-red-900",
};

const styleClasses: Partial<
  Record<Exclude<ButtonProps["style"], undefined>, string>
> = {
  solid: "btn-solid",
  outline: "btn-outline",
  ghost: "btn-ghost",
};

const sizeClasses: Partial<
  Record<Exclude<ButtonProps["size"], undefined>, string>
> = {
  sm: "btn-sm",
  md: "btn-md",
  lg: "btn-lg",
};

export function Button({
  children,
  variant = "surface",
  style = "solid",
  size = "md",
  className,
  onClick,
}: ButtonProps) {
  const variantClass = variantClasses[variant];
  const styleClass = styleClasses[style];
  const sizeClass = sizeClasses[size];

  return (
    <button
      className={twMerge("btn", variantClass, styleClass, sizeClass, className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
