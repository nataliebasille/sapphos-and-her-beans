import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <article className="bg-surface-50 text-primary-800 -mt-[calc(89px+1.5rem)] min-h-dvh px-4 pt-[calc(89px+3rem)] pb-20 md:px-10 md:pt-[calc(89px+5rem)]">
      <div className="border-primary-500/10 mx-auto max-w-5xl overflow-hidden rounded-[2rem] border bg-white shadow-[0_18px_60px_rgba(0,31,54,0.08)]">
        <div className="grid md:grid-cols-[1.15fr_0.85fr]">
          <div className="p-7 sm:p-10 md:p-14">
            <Eyebrow>A note from Samantha</Eyebrow>
            <h1 className="font-primary mt-5 text-4xl leading-none font-semibold tracking-tight md:text-6xl">
              Hi.
            </h1>
            <p className="font-primary mt-7 text-xl leading-snug md:text-2xl text-justify">
              My name is Samantha, and I am the owner of Sappho and Her Beans.
            </p>
            <div className="text-primary-800/75 mt-8 space-y-5 text-justify text-[15px] leading-relaxed md:text-base">
              <p>
                My business was started in the summer of 2023, just a few short
                days before my daughter was born. My wife and I were at a local
                farmers market when she saw someone selling fresh roasted
                coffee. My wife suggested that I look into roasting my own
                coffee, because if he could do it why couldn’t I? She thought it
                would make a neat hobby and maybe save us some money because we
                drink a lot of coffee. Little did she know that she was setting
                me off on the path that has led me to where I am today!
              </p>
              <p>
                I soon began selling my coffee at a local farmers market and
                knew I was on to something when I sold out three weeks in a row,
                with my streak only ending because I kept taking more product.
                Since starting in my home kitchen I have expanded into a
                commercial facility and am proud to offer both retail and
                wholesale, developing lifelong partnerships and friendships
                along the way. You can find my coffee throughout the Northeast
                Ohio region and I’m always looking for new opportunities.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-on-primary-500 bg-primary-500 mt-9 inline-flex rounded-full px-7 py-3 text-sm font-semibold tracking-[0.14em] uppercase transition-transform hover:-translate-y-0.5"
            >
              Shop coffee
            </Link>
          </div>

          <aside className="bg-primary-500 text-on-primary-500 flex flex-col p-7 sm:p-10 md:p-10">
            <figure>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
                <Image
                  src="/images/our story.jpg"
                  alt="Samantha, her wife, their daughter, and producing partner Marcelo"
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
              </div>
              <figcaption className="text-on-primary-500/55 mt-3 text-xs leading-relaxed">
                Samantha, her wife and daughter, with producing partner Marcelo
                at the 2024 SCA Expo in Chicago.
              </figcaption>
            </figure>
            <dl className="border-surface-50/15 mt-10 grid grid-cols-3 gap-3 border-t pt-6 text-center">
              <Fact value="2023" label="Started" />
              <Fact value="NE Ohio" label="Home" />
              <Fact value="People" label="First" />
            </dl>
          </aside>
        </div>
      </div>
    </article>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-accent-700 text-[0.7rem] font-semibold tracking-[0.28em] uppercase">
      {children}
    </span>
  );
}

function Fact({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="font-primary text-lg">{value}</dt>
      <dd className="text-on-primary-500/55 mt-1 text-[0.63rem] font-semibold tracking-[0.14em] uppercase">
        {label}
      </dd>
    </div>
  );
}
