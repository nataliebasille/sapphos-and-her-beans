import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import Script from "next/script";
import { getProducts } from "~/server/products/get_products";
import { Cart } from "./_components/cart";
import { CartProvider } from "./_stores/cart/cart-provider";
import { ProductsProvider } from "./_stores/products/products-provider";
import { ShopHeader } from "./shop-header";
import { ShopPageContainer } from "./shop-page-container";

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
            process.env.DEPLOYMENT_TYPE === "PRODUCTION" ?
              "/heap_load_prod.js"
            : "/heap_load_dev.js"
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
