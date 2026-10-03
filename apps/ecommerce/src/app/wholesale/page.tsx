const BENEFITS = [
  {
    title: "Volume pricing",
    body: "Tiered wholesale rates that scale with your order — the more you pour, the better it gets.",
  },
  {
    title: "Dedicated support",
    body: "A real person on our team who knows your account, your menu, and your roast cadence.",
  },
  {
    title: "Roasted to order",
    body: "Fresh batches roasted for your delivery window so every bag lands at peak flavor.",
  },
  {
    title: "Custom offerings",
    body: "Signature blends, single-origin rotations, and private-label options for your brand.",
  },
];

export default function WholesalesPage() {
  return (
    <div className="bg-surface-50 text-primary-800 -mt-[calc(89px+1.5rem)] min-h-dvh px-4 pt-[calc(89px+3rem)] pb-20 md:px-10 md:pt-[calc(89px+5rem)]">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <span className="text-accent-700 text-[0.7rem] font-semibold tracking-[0.28em] uppercase">
            Wholesale — coming soon
          </span>
          <h1 className="font-primary text-primary-800 mt-4 text-4xl leading-none font-semibold tracking-tight md:text-5xl">
            Here&apos;s what to expect.
          </h1>
          <p className="text-primary-800/70 mx-auto mt-5 max-w-2xl text-base leading-relaxed">
            We&apos;re putting the finishing touches on a wholesale program built
            for partners who care about quality as much as we do.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className="border-primary-500/10 rounded-2xl border bg-white p-7 shadow-[0_10px_40px_rgba(0,31,54,0.05)]"
            >
              <h3 className="font-primary text-primary-800 text-xl font-semibold tracking-tight">
                {benefit.title}
              </h3>
              <p className="text-primary-800/70 mt-3 text-sm leading-relaxed">
                {benefit.body}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-primary-500 text-on-primary-500 mt-14 rounded-[2rem] px-7 py-12 text-center md:px-14">
          <h2 className="font-primary text-3xl font-semibold tracking-tight md:text-4xl">
            Opening soon.
          </h2>
          <p className="text-on-primary-500/70 mx-auto mt-3 max-w-md text-sm leading-relaxed">
            We&apos;re finalizing the details of our wholesale program. Check
            back soon to partner with us.
          </p>
        </div>
      </div>
    </div>
  );
}
