import Link from "next/link";

type ReceiptStatusProps = {
  type: "not_found" | "unavailable";
};

export function ReceiptStatus({ type }: ReceiptStatusProps) {
  const isNotFound = type === "not_found";

  return (
    <main className="mx-auto max-w-xl px-4 pt-20 pb-28 text-center md:px-6 md:pt-28">
      <p className="text-accent-700 text-[0.72rem] font-semibold tracking-[0.28em] uppercase">
        {isNotFound ? "Receipt not found" : "Receipt unavailable"}
      </p>
      <h1 className="font-primary text-primary-800 mt-3 text-3xl leading-tight font-semibold md:text-5xl">
        {isNotFound ?
          "We couldn't find that receipt."
        : "We couldn't load this receipt."}
      </h1>
      <p className="text-primary-800/65 mx-auto mt-4 max-w-md text-sm leading-relaxed md:text-base">
        {isNotFound ?
          "Check the link in your confirmation email, then try again."
        : "Please refresh in a moment. Your order details are still available in the confirmation email."
        }
      </p>
      <Link
        href="/shop"
        className="bg-primary-500 text-on-primary-500 mt-8 inline-flex rounded-full px-6 py-3 text-xs font-semibold tracking-[0.16em] uppercase"
      >
        Continue shopping
      </Link>
    </main>
  );
}
