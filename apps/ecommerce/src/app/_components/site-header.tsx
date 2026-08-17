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
import {
  useCartIsDisabled,
  useCartQuantity,
  useOpenCart,
} from "../_stores/cart";

const NAV = [
  { label: "Shop Coffee", href: "/shop" },
  { label: "Wholesale", href: "/wholesale" },
  { label: "Our Story", href: "/about" },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const desktopNavLinkClass =
  "text-primary-800/70 after:bg-secondary-500 hover:text-primary-800 relative whitespace-nowrap py-1 text-sm font-medium tracking-wide transition-colors after:absolute after:right-0 after:-bottom-1 after:left-0 after:h-0.5 after:origin-left after:scale-x-0 after:transition-transform after:duration-300";

const activeNavLinkClass = "text-primary-800 after:scale-x-100";

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
        solid ?
          "border-primary-500/10 bg-surface-50/90 border-b backdrop-blur-md"
        : "border-b border-transparent",
      )}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center px-6 py-4 md:px-10">
        {/* left nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={twMerge(
                  desktopNavLinkClass,
                  active && activeNavLinkClass,
                )}
              >
                {item.label}
              </Link>
            );
          })}
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
            aria-current={
              isActivePath(pathname, "/locations") ? "page" : undefined
            }
            className={twMerge(
              desktopNavLinkClass,
              "hidden md:block",
              isActivePath(pathname, "/locations") && activeNavLinkClass,
            )}
          >
            Find Us
          </Link>
          <button
            onClick={openCart}
            aria-label="Open cart"
            className={twMerge(
              "text-primary-800 relative",
              isDisabled && "invisible",
            )}
          >
            <CartIcon className="size-6" />
            {quantity > 0 && (
              <span className="bg-accent-700 text-primary-800 pointer-events-none absolute -top-2 -right-2 flex size-[18px] items-center justify-center rounded-full text-[0.65rem] font-semibold">
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
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="flex flex-col gap-1.5"
      >
        <span className="bg-primary-500 block h-0.5 w-6" />
        <span className="bg-primary-500 block h-0.5 w-6" />
        <span className="bg-primary-500 block h-0.5 w-4" />
      </button>
      <div
        aria-hidden={!open}
        className={twMerge(
          "fixed inset-x-0 top-0 z-[110] h-dvh",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        <button
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          tabIndex={open ? 0 : -1}
          className={twMerge(
            "bg-primary-500/45 absolute inset-0 backdrop-blur-sm transition-opacity duration-300 ease-out",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={twMerge(
            "text-on-primary-500 bg-primary-500 relative h-dvh w-full overflow-y-auto px-8 py-6 shadow-2xl transition-all duration-300 ease-out",
            open ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0",
          )}
        >
          <button
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className="mb-16 text-3xl leading-none transition-transform duration-300 hover:rotate-90"
          >
            ×
          </button>
          <nav className="flex flex-col gap-7 text-2xl">
            {[...NAV, { label: "Find Us", href: "/locations" }].map((i) => {
              const active = isActivePath(pathname, i.href);

              return (
                <Link
                  key={i.href}
                  href={i.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  tabIndex={open ? 0 : -1}
                  className={twMerge(
                    "-mx-3 rounded px-3 py-2 transition-all duration-300 ease-out",
                    open ?
                      "translate-x-0 opacity-100"
                    : "-translate-x-3 opacity-0",
                    active && "bg-surface-50/12 text-accent-700",
                  )}
                >
                  {i.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
