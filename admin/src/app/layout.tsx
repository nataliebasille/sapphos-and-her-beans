import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { UserProvider } from "@auth0/nextjs-auth0/client";

export const metadata: Metadata = {
  title: "Admin - Sappho and her beans",
  description: "Admin - Sappho and her beans",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <UserProvider>
        <body className="h-dvh w-dvw bg-surface-base">{children}</body>
      </UserProvider>
    </html>
  );
}
