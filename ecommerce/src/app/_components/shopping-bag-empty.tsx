import { memo, useCallback } from "react";
import { useCloseCart } from "../_stores/cart";
import { useRouter } from "next/navigation";

export const ShoppingBagEmpty = memo(function CartEmpty() {
  const closeCart = useCloseCart();
  const router = useRouter();
  const handleExplore = useCallback(() => {
    closeCart();
    router.push("/shop");
  }, [router, closeCart]);
  return (
    <div className="flex flex-col items-center justify-center p-5">
      <div className="text-center text-xl opacity-75">
        Your shopping bag is empty
      </div>
      <button
        className="btn-primary btn btn-ghost btn-lg mt-5 uppercase"
        onClick={handleExplore}
      >
        Explore our coffee
      </button>
    </div>
  );
});
