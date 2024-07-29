import Image from "next/image";
import { SidebarLink } from "./sidebar-link";

export function Sidebar() {
  return (
    <>
      <div className="mx-auto">
        <Image
          src="/images/Sappho no background - cropped.png"
          alt="Sappho - Admin"
          className="!static mx-auto !h-auto !w-[50%] border-b-[1px] border-secondary-base object-contain"
          fill
        />
        <h2
          className="py-2 text-center uppercase tracking-widest text-primary-contrast-base"
          style={{ fontFamily: "fantasy" }}
        >
          Admin
        </h2>
      </div>

      <div className="my-0 border-b-[1px] border-surface-900" />

      <ul className="list list-secondary text-secondary-base">
        <SidebarLink href="/products">Products</SidebarLink>
      </ul>
    </>
  );
}
