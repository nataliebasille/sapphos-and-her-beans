import Link from "next/link";
import { Heading } from "~/app/_components/heading";

export default function CoffeeNotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-24 text-center">
      <Heading level={2} className="tracking-wide">
        Coffee not found
      </Heading>
      <p className="mt-2 text-on-surface-50/70">
        We couldn&apos;t find that coffee. It may have sold out or been retired.
      </p>
      <Link
        href="/shop"
        className="btn-solid/primary btn-size-lg mt-8 inline-flex tracking-wider uppercase"
      >
        Explore our coffee
      </Link>
    </div>
  );
}
