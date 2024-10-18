import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { PageHeader } from "./_components/page-header";
import { Cart } from "./_components/cart";
import { getProducts } from "~/server/actions/products";
import { ProductListProvider } from "./_stores/product-list-provider";
import { CartProvider } from "./_stores/cart-provider";

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
      <body>
        <ProductListProvider products={products}>
          <CartProvider>
            <Cart />
            <PageHeader />
            {children}
          </CartProvider>
        </ProductListProvider>
      </body>
    </html>
  );
}
