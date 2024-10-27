import { Cart } from "../_components/cart";
import { ShopHeader } from "./shop-header";
import ShopPageContainer from "./shop-page-container";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Cart />
      <ShopHeader />
      <ShopPageContainer>{children}</ShopPageContainer>
    </>
  );
}
