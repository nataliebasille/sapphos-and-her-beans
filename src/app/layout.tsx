import Image from "next/image";
import type { ReactNode } from "react";
import { Email } from "~/icons/email";
import { Instagram } from "~/icons/instagram";
import { Phone } from "~/icons/phone";
import { Twitter } from "~/icons/twitter";
import "~/styles/globals.css";

const MyApp = ({ children }: { children: ReactNode }) => {
  return (
    <html>
      <head>
        <title>Sappho and Her Beans - Coffee Roaster</title>
      </head>
      <body className="h-screen w-screen">
        {/* 
        // comment out until a header is needed
        <header>
          <nav className="flex h-14 w-full items-center bg-[#d2ac8c] px-5">
            <Image
              src="/images/shappo-logo.png"
              alt="Logo"
              height={68}
              width={68}
            />
          </nav>
        </header> */}
        <section className="w-full">{children}</section>
        <footer className="w-full justify-items-center bg-[#416f6e] p-10 text-[#D4AE8F] md:grid md:grid-cols-2">
          <div>
            <h5 className="font-bold uppercase">Contact us</h5>

            <p className="mt-4">
              <a className="flex gap-2" href="tel:555-555-5555">
                <Phone width={18} />
                555-555-5555
              </a>
            </p>

            <p className="mt-2">
              <a className="flex gap-2" href="mailto:sappho@gmail.com">
                <Email width={18} />
                sappho@gmail.com
              </a>
            </p>
          </div>
          <div className="mt-5 md:mt-0">
            <h5 className="font-bold uppercase">Social</h5>

            <p className="mt-4">
              <a
                target="_blank"
                className="flex items-center gap-2"
                href="https://www.instagram.com/sapphoandherbeans/"
              >
                <Instagram width={18} />
                sapphoandherbeans
              </a>
            </p>

            <p className="mt-2">
              <a
                className="flex items-center gap-2"
                href="https://twitter.com/@sapphoandherbeans"
              >
                <Twitter width={18} />
                @sapphoandherbeans
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
};

export default MyApp;
