import { twMerge } from "tailwind-merge";

type PageContainerProps = {
  className?: string;
  children: React.ReactNode;
};
export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <main className={twMerge("min-h-dvh w-dvw bg-[#F7DCDF]", className)}>
      <div className="pt-[calc(76px+1.5rem)]">{children}</div>
    </main>
  );
};
