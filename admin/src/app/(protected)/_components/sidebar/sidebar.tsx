import Image from "next/image";
import { SidebarLink } from "./sidebar-link";
import { SidebarCloseIcon } from "./sidebar-close-icon";
import { twMerge } from "tailwind-merge";

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside
      className={twMerge(
        "flex w-full flex-col bg-primary-base md:w-72",
        className,
      )}
    >
      <div className="flex items-center py-2 md:p-0">
        <SidebarCloseIcon className="flex-1 pl-4 md:hidden" />
        <div className="divide ml-auto flex w-fit flex-initial items-end divide-x divide-secondary-base md:mx-auto md:flex-col md:items-center md:divide-x-0">
          <Image
            src="/images/Sappho no background - cropped.png"
            alt="Sappho - Admin"
            className="!static mx-auto !h-auto !w-40 border-secondary-base object-contain px-2 md:!w-[50%] md:border-b-[1px] md:border-r-0"
            fill
          />
          <h2
            className="px-2 py-2 text-center text-lg uppercase tracking-widest text-primary-contrast-base md:text-2xl"
            style={{ fontFamily: "fantasy" }}
          >
            Admin
          </h2>
        </div>
      </div>

      <div className="my-0 border-b-[1px] border-surface-900" />

      <ul className="list list-secondary text-secondary-base">
        <SidebarLink href="/products">Products</SidebarLink>
      </ul>
    </aside>
  );
}
