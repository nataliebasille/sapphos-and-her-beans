import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { getProducts } from "~/server/actions/products";
import { ProductsProvider } from "./_stores/products/products-provider";
import { CartProvider } from "./_stores/cart/cart-provider";
import { Cart } from "./_components/cart";
import { ShopHeader } from "./shop-header";
import { ShopPageContainer } from "./shop-page-container";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Sappho and her beans - Coffee Roasters",
  description:
    "The ecommerce store front for Sappho and her beans Coffee Roasters",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const products = await getProducts();
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <head>
        <Script
          type="text/javascript"
          src={
            process.env.NODE_ENV === "production" ?
              "/head_load_prod.js"
            : "/head_load_dev.js"
          }
        ></Script>
      </head>
      <body>
        <ProductsProvider initialValue={{ products }}>
          <CartProvider>
            <Cart />
            <ShopHeader />
            <ShopPageContainer>{children}</ShopPageContainer>
          </CartProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
