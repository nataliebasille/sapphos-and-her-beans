import { twMerge } from "tailwind-merge";
import { useCartQuantity } from "../_stores/cart";
import { Cart } from "./icons/cart";

type CartIconProps = {
  className?: string;
  onClick?: () => void;
};

export function CartIcon({ onClick, className }: CartIconProps) {
  const quantity = useCartQuantity();

  return (
    <div
      className={twMerge("relative ml-auto mr-6 w-fit md:ml-0", className)}
      onClick={onClick}
    >
      <Cart className="ml-auto size-12 md:ml-0" />
      {quantity > 0 && (
        <span className="pointer-events-none absolute bottom-[7px] left-[12px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-primary-600/80 text-xs text-primary-contrast-600 text-white">
          {quantity}
        </span>
      )}
    </div>
  );
}
