import { twMerge } from "tailwind-merge";
type HeadingProps = {
  children: React.ReactNode;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
};

export const Heading = ({ children, level, className }: HeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const textSize = {
    1: "text-5xl",
    2: "text-4xl",
    3: "text-3xl",
    4: "text-2xl",
    5: "text-xl",
    6: "text-lg",
  };
  const marginBottom = {
    1: "mb-8",
    2: "mb-6",
    3: "mb-4",
    4: "mb-3",
    5: "mb-2",
    6: "mb-1",
  };
  return (
    <Tag
      className={twMerge(
        "uppercase tracking-wide",
        textSize[level],
        marginBottom[level],
        className,
      )}
    >
      {children}
    </Tag>
  );
};
