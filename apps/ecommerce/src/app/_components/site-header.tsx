"use client";

/**
 * Shared site header — the editorial nav introduced on the homepage, promoted
 * to every route.
 *
 * On the homepage the header starts transparent and the centered logo fades in
 * once the hero scrolls past. On every other route there is no tall hero, so the
 * header renders solid with the logo visible from the start.
 */
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Cart as CartIcon } from "./icons/cart";
import { useCartIsDisabled, useCartQuantity, useOpenCart } from "../_stores/cart";

const NAV = [
  { label: "Shop Coffee", href: "/shop" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Our Story", href: "/about" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHome);
  const openCart = useOpenCart();
  const isDisabled = useCartIsDisabled();
  const quantity = useCartQuantity();

  useEffect(() => {
    // Inner pages have no tall hero, so the header stays solid with the logo
    // visible. Only the homepage reacts to scroll.
    if (!isHome) {
      setScrolled(true);
      return;
    }

    const onScroll = () => setScrolled(window.scrollY > 120);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const solid = isHome ? scrolled : true;
  const logoVisible = isHome ? scrolled : true;

  return (
    <header
      className={twMerge(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-[#001F36]/10 bg-[#FAF9F8]/90 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6 py-4 md:px-10">
        {/* left nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium tracking-wide text-[#001F36]/80 transition-colors hover:text-[#001F36]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <MobileMenu />

        {/* center logo — always visible off the homepage, fades in past the hero on home */}
        <Link
          href="/"
          className={twMerge(
            "relative mx-auto h-9 w-[130px] transition-opacity duration-500",
            logoVisible ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={!logoVisible}
        >
          <Image
            src="/images/sappho black logo cropped.png"
            alt="Sappho & Her Beans"
            fill
            className="object-contain"
          />
        </Link>

        {/* right actions */}
        <div className="flex items-center justify-end gap-5">
          <Link
            href="/locations"
            className="hidden text-sm font-medium tracking-wide text-[#001F36]/80 transition-colors hover:text-[#001F36] md:block"
          >
            Find Us
          </Link>
          <button
            onClick={openCart}
            aria-label="Open cart"
            className={twMerge(
              "relative text-[#001F36]",
              isDisabled && "invisible",
            )}
          >
            <CartIcon className="size-6" />
            {quantity > 0 && (
              <span className="pointer-events-none absolute -top-2 -right-2 flex size-[18px] items-center justify-center rounded-full bg-[#EFAA9C] text-[0.65rem] font-semibold text-[#001F36]">
                {quantity}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex flex-col gap-1.5"
      >
        <span className="block h-0.5 w-6 bg-[#001F36]" />
        <span className="block h-0.5 w-6 bg-[#001F36]" />
        <span className="block h-0.5 w-4 bg-[#001F36]" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-[#001F36] px-8 py-6 text-[#FAF9F8]">
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="mb-16 text-3xl"
          >
            ×
          </button>
          <nav className="flex flex-col gap-7 text-2xl">
            {[...NAV, { label: "Find Us", href: "/locations" }].map((i) => (
              <Link key={i.href} href={i.href} onClick={() => setOpen(false)}>
                {i.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}
