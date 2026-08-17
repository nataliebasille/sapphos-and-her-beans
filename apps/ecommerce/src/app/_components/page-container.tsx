import { twMerge } from "tailwind-merge";

type PageContainerProps = {
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
};
export const PageContainer = ({
  children,
  className,
  contentClassName,
}: PageContainerProps) => {
  return (
    <main className={twMerge("min-h-dvh w-full bg-[#F7DCDF]", className)}>
      <div className={twMerge("pt-[calc(76px+1.5rem)]", contentClassName)}>
        {children}
      </div>
    </main>
  );
};
