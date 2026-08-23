"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  loadCompletedOrder,
  type CompletedOrder,
} from "./completed-order-storage";
import {
  getCheckoutReceipt,
  type CheckoutReceipt,
} from "~/server/checkout/get_checkout_receipt";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  currency: "USD",
  style: "currency",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "long",
});

type ReceiptConfirmationProps = {
  checkoutSessionId: string;
};

export function ReceiptConfirmation({
  checkoutSessionId,
}: ReceiptConfirmationProps) {
  const [order, setOrder] = useState<CompletedOrder | null>(null);
  const [receipt, setReceipt] = useState<CheckoutReceipt | null>(null);

  useEffect(() => {
    setOrder(null);
    setReceipt(null);

    const completedOrder = loadCompletedOrder();

    if (completedOrder?.checkoutSessionId === checkoutSessionId) {
      setOrder(completedOrder);
      return;
    }

    void getCheckoutReceipt(checkoutSessionId).then(setReceipt);
  }, [checkoutSessionId]);

  const lines = receipt?.lines.length ? receipt.lines : (order?.lines ?? []);
  const completedAt = receipt?.completedAt ?? order?.completedAt;
  const email = receipt?.customerEmail;

  return (
    <main className="mx-auto max-w-3xl px-4 pt-10 pb-28 md:px-6 md:pt-14">
      <section className="text-center">
        <span className="bg-success-500 text-surface-50 mx-auto flex size-14 items-center justify-center rounded-full">
          <CheckIcon className="size-7" />
        </span>
        <p className="text-accent-700 mt-6 text-[0.72rem] font-semibold tracking-[0.28em] uppercase">
          Order confirmed
        </p>
        <h1 className="font-primary text-primary-800 mt-3 text-3xl leading-tight font-semibold md:text-5xl">
          Coffee is on the way.
        </h1>
        <p className="text-primary-800/65 mx-auto mt-4 max-w-xl text-sm leading-relaxed md:text-base">
          {email ?
            `A receipt has been sent to ${email}. Keep this page for your order number and shipping details.`
          : "A receipt has been sent to the email used at checkout. Keep this page for your order number and shipping details."
          }
        </p>
      </section>

      <section className="border-primary-500/10 mt-10 rounded-3xl border bg-white p-5 shadow-[0_1px_3px_rgba(0,31,54,0.06)] md:p-7">
        <div className="border-primary-500/10 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-primary-800/50 text-xs font-semibold tracking-[0.18em] uppercase">
              Confirmation
            </p>
            <p className="text-primary-800 mt-1 text-xl font-semibold">
              {receipt?.id ??
                (completedAt ?
                  dateFormatter.format(new Date(completedAt))
                : "Thank you")}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {receipt?.receiptUrl ?
              <Link
                href={receipt.receiptUrl}
                className="border-primary-500/20 text-primary-800 inline-flex w-fit rounded-full border px-5 py-3 text-xs font-semibold tracking-[0.16em] uppercase"
              >
                View Stripe receipt
              </Link>
            : null}
            <Link
              href="/shop"
              className="bg-primary-500 text-on-primary-500 inline-flex w-fit rounded-full px-5 py-3 text-xs font-semibold tracking-[0.16em] uppercase"
            >
              Continue shopping
            </Link>
          </div>
        </div>

        {lines.length > 0 ?
          <>
            <div className="mt-6 space-y-4">
              {lines.map((line) => (
                <div
                  key={line.id}
                  className="border-primary-500/10 grid grid-cols-[1fr_auto] gap-4 border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-primary-800 text-sm font-semibold">
                      {line.name}
                    </p>
                    <p className="text-primary-800/55 mt-1 text-[13px]">
                      Qty {line.quantity}
                      {line.detail ? ` · ${line.detail}` : ""}
                    </p>
                  </div>
                  <p className="text-primary-800 text-sm font-semibold">
                    {currencyFormatter.format(
                      "price" in line ? line.price : line.amount / 100,
                    )}
                  </p>
                </div>
              ))}
            </div>

            <dl className="border-primary-500/10 mt-6 space-y-2 border-t pt-5 text-sm">
              {receipt ?
                <>
                  {receipt.subtotal !== null ?
                    <ReceiptTotal
                      label="Subtotal"
                      value={currencyFormatter.format(receipt.subtotal / 100)}
                    />
                  : null}
                  {receipt.shipping !== null ?
                    <ReceiptTotal
                      label="Shipping"
                      value={currencyFormatter.format(receipt.shipping / 100)}
                    />
                  : null}
                  {receipt.total !== null ?
                    <ReceiptTotal
                      label="Total"
                      value={currencyFormatter.format(receipt.total / 100)}
                      strong
                    />
                  : null}
                </>
              : <>
                  <ReceiptTotal
                    label="Item subtotal"
                    value={currencyFormatter.format(order?.subtotal ?? 0)}
                  />
                  <p className="text-primary-800/55 pt-2 text-[13px] leading-relaxed">
                    Shipping, discounts, tax, and final payment details are on
                    the Stripe receipt.
                  </p>
                </>
              }
            </dl>

            {receipt?.shippingAddress.length ?
              <div className="border-primary-500/10 mt-6 border-t pt-5">
                <p className="text-primary-800/50 text-xs font-semibold tracking-[0.18em] uppercase">
                  Ship to
                </p>
                <address className="text-primary-800/65 mt-2 text-sm leading-relaxed not-italic">
                  {receipt.shippingAddress.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </div>
            : null}
          </>
        : <p className="text-primary-800/65 mt-6 text-sm leading-relaxed">
            Your payment was completed. Use the Stripe receipt email for the
            itemized payment details.
          </p>
        }
      </section>
    </main>
  );
}

function ReceiptTotal({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt
        className={
          strong ? "text-primary-800 font-semibold" : "text-primary-800/60"
        }
      >
        {label}
      </dt>
      <dd
        className={
          strong ? "text-primary-800 text-lg font-semibold" : "text-primary-800"
        }
      >
        {value}
      </dd>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}
