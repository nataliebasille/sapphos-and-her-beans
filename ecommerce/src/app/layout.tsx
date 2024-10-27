import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { getProducts } from "~/server/actions/products";
import { ProductsProvider } from "./_stores/products/products-provider";
import { CartProvider } from "./_stores/cart/cart-provider";

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
        <ProductsProvider initialValue={{ products }}>
          <CartProvider>{children}</CartProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
