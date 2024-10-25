"use client";

import { usePathname, useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useOpenCart } from "../_stores/cart";
import { CartIcon } from "./cart-icon";
import { NavMenu } from "./nav-menu";

export const PageHeader = () => {
  const path = usePathname();
  const router = useRouter();
  const contrast = path === "/" ? "white" : "black";
  const openCart = useOpenCart();
  return (
    <header
      className={twMerge(
        "fixed top-0 z-50 flex w-full items-center border-b-[1px] py-4",
        path !== "/" && "bg-[#F7DCDF]",
        contrast === "white" ?
          "border-slate-200/30 text-white"
        : "border-slate-800/30 text-black",
      )}
    >
      <NavMenu contrast={contrast} />
      <button
        className={twMerge(
          "ml-auto mr-6 hidden text-nowrap rounded-full border px-4 py-2 text-base uppercase transition-all duration-300 md:block",
          contrast === "white" ?
            "border-white hover:bg-white hover:text-slate-800"
          : "border-black hover:bg-black/70 hover:text-slate-200",
        )}
        onClick={() => router.push("/locations")}
      >
        Where to find us
      </button>

      <CartIcon onClick={openCart} className="cursor-pointer" />
    </header>
  );
};
