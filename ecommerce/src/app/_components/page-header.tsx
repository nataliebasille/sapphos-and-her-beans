"use client";

import { twMerge } from "tailwind-merge";
import { Cart } from "./icons/cart";
import { NavMenu } from "./nav-menu";
import { usePathname, useRouter } from "next/navigation";
import { useCartStore } from "../_stores/cart-provider";

export const PageHeader = () => {
  const path = usePathname();
  const router = useRouter();
  const contrast = path === "/" ? "white" : "black";
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

      <CartIcon />
    </header>
  );
};

function CartIcon() {
  const cart = useCartStore((s) => s.cart);

  return (
    <div className="relative ml-auto mr-6 w-fit md:ml-0">
      <Cart className="ml-auto size-12 cursor-pointer md:ml-0" />
      {cart.length > 0 && (
        <span className="pointer-events-none absolute bottom-[7px] left-[12px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-primary-600/80 text-xs text-primary-contrast-600 text-white">
          {cart.length}
        </span>
      )}
    </div>
  );
}
