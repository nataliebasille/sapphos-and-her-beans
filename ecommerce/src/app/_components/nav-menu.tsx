"use client";
import Image from "next/image";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Close } from "./icons/close";
import { Hamburger } from "./icons/hamburger";
import { NavLink } from "./navlink";

const navigationItems = [
  {
    name: "Explore our coffee",
    href: "/shop",
    menuType: "all",
  },
  {
    name: "Wholesale",
    href: "/wholesale",
    menuType: "all",
  },
  {
    name: "Our story",
    href: "/about",
    menuType: "all",
  },
  {
    name: "Where to find us",
    href: "/locations",
    menuType: "mobile",
  },
] as const;

type NavMenuProps = {
  contrast: "white" | "black";
};

const DesktopNavMenu = ({ contrast }: NavMenuProps) => {
  return (
    <ul
      className={twMerge(
        "hidden items-center justify-center divide-x pl-6 *:px-2 md:flex",
        contrast === "white" ? "divide-white" : "divide-black",
      )}
    >
      {navigationItems
        .filter((x) => x.menuType !== "mobile")
        .map((item) => (
          <li key={item.name}>
            <NavLink
              href={item.href}
              className={twMerge(
                contrast === "white" ? "hover:text-white" : "hover:text-black",
              )}
              underlineClassName={twMerge(
                contrast === "white" ?
                  "group-hover:bg-white"
                : "group-hover:bg-black",
              )}
            >
              {item.name}
            </NavLink>
          </li>
        ))}
    </ul>
  );
};

const MobileNavMenu = ({ contrast }: NavMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Hamburger
        className={twMerge(
          "ml-6 size-10 cursor-pointer md:hidden",
          contrast === "white" ? "text-white" : "text-black",
        )}
        onClick={() => setIsOpen(true)}
      />
      <div
        className={twMerge(
          "fixed bottom-0 top-0 h-[100dvh] w-full -translate-x-full bg-[#F7DCDF] text-black transition-all duration-300 md:hidden",
          isOpen && "translate-x-0",
        )}
      >
        <div className="relative grid w-full grid-cols-[min-content_1fr_min-content] items-start justify-items-center gap-4 p-6 text-black">
          <Close
            className="size-10 cursor-pointer"
            onClick={() => setIsOpen(false)}
          />

          <Image
            src="/images/sappho black logo cropped.png"
            className="absolute left-[50%] top-0 mt-2 -translate-x-1/2 object-contain"
            alt="Sappho logo"
            width={200}
            height={200}
          />
        </div>

        <ul className="ml-10 mt-24 flex flex-col gap-10">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <NavLink
                href={item.href}
                className="text-3xl"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="px-6">
          <div className="mt-6 h-[1px] w-full bg-black" />
        </div>
      </div>
    </>
  );
};

export const NavMenu = (props: NavMenuProps) => {
  return (
    <>
      <DesktopNavMenu {...props} />
      <MobileNavMenu {...props} />
    </>
  );
};
