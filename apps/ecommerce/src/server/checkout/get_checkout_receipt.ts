"use server";

import "server-only";
import { stripe, type Stripe } from "~/server/+utils/stripe";

export type CheckoutReceiptLine = {
  id: string;
  name: string;
  detail: string;
  quantity: number;
  amount: number;
};

export type CheckoutReceipt = {
  id: string;
  completedAt: string | null;
  customerEmail: string | null;
  receiptUrl: string | null;
  shippingAddress: string[];
  subtotal: number | null;
  shipping: number | null;
  total: number | null;
  lines: CheckoutReceiptLine[];
};

export async function getCheckoutReceipt(
  checkoutSessionId?: string,
): Promise<CheckoutReceipt | null> {
  if (!checkoutSessionId) return null;

  try {
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
      expand: ["payment_intent"],
    });
    const lineItems = await stripe.checkout.sessions.listLineItems(
      checkoutSessionId,
      { limit: 100 },
    );

    return {
      id: session.id,
      completedAt:
        session.created ? new Date(session.created * 1000).toISOString() : null,
      customerEmail: session.customer_details?.email ?? null,
      receiptUrl: await receiptUrlForSession(session),
      shippingAddress: shippingAddressForSession(session),
      subtotal: session.amount_subtotal ?? null,
      shipping: session.total_details?.amount_shipping ?? null,
      total: session.amount_total ?? null,
      lines: lineItems.data.map((line) => ({
        id: line.id,
        name: line.description ?? "Coffee",
        detail: "",
        quantity: line.quantity ?? 1,
        amount: line.amount_total,
      })),
    };
  } catch (cause) {
    console.error("Unable to load Stripe checkout receipt.", cause);
    return null;
  }
}

async function receiptUrlForSession(session: Stripe.Checkout.Session) {
  const paymentIntent = session.payment_intent;
  if (!paymentIntent || typeof paymentIntent === "string") return null;

  const latestCharge = paymentIntent.latest_charge;
  if (!latestCharge) return null;

  if (typeof latestCharge === "string") {
    const charge = await stripe.charges.retrieve(latestCharge);
    return charge.receipt_url ?? null;
  }

  return latestCharge.receipt_url ?? null;
}

function shippingAddressForSession(session: Stripe.Checkout.Session) {
  const details = session.customer_details;
  const address = details?.address;
  if (!details || !address) return [];

  return [
    details.name,
    address.line1,
    address.line2,
    [address.city, address.state, address.postal_code]
      .filter(Boolean)
      .join(" "),
    address.country,
  ].filter(Boolean) as string[];
}
