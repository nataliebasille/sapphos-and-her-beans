"use client";

import { usePathname, useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { useCartIsDisabled, useOpenCart } from "./_stores/cart";
import { NavMenu } from "./_components/nav-menu";
import { CartIcon } from "./_components/cart-icon";
import Image from "next/image";

export const ShopHeader = () => {
  const path = usePathname();
  const router = useRouter();
  const isHome = path === "/";
  const contrast = isHome ? "white" : "black";
  const openCart = useOpenCart();
  const isDisabled = useCartIsDisabled();

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
      {!isHome && (
        <div className="relative -z-10 h-full flex-1 px-2">
          <Image
            src="/images/sappho black logo cropped.png"
            alt="Sappho logo"
            width={125}
            height={100}
            className="absolute left-[50%] top-[50%] mx-auto -translate-x-1/2 -translate-y-1/2"
          />
        </div>
      )}
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

      <CartIcon
        onClick={openCart}
        className={twMerge("cursor-pointer", isDisabled && "invisible")}
      />
    </header>
  );
};
