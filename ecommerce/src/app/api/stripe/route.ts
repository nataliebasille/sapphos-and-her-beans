import { shippo } from "@shippo";
import { stripe } from "@stripe";
import { headers } from "next/headers";
import { type Stripe } from "stripe";

const stripeEndpointSecret = process.env.STRIPE_ENDPOINT_SECRET!;
export async function POST(request: Request) {
  if (!stripeEndpointSecret) {
    return new Response("Stripe endpoint secret not set", {
      status: 500,
    });
  }

  const body = await request.text();
  const sig = headers().get("stripe-signature");

  if (!sig) {
    return new Response("No signature header", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, stripeEndpointSecret);
  } catch (err: unknown) {
    return new Response(
      `Webhook Error: ${(err as { message: string }).message}`,
      {
        status: 400,
      },
    );
  }

  const handler =
    stripeWebhookHandlers[event.type as keyof typeof stripeWebhookHandlers];

  if (handler) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
    await handler(event as any);
  }

  return new Response("OK");
}

const stripeWebhookHandlers = {
  "checkout.session.completed": async function (
    event: Stripe.CheckoutSessionCompletedEvent,
  ) {
    const shippingChoice = event.data.object.shipping_options[0];

    if (!shippingChoice) {
      throw new Error(
        `No shipping details found for session checkout: ${event.data.object.id}`,
      );
    }

    const shippingDetails = await stripe.shippingRates.retrieve(
      shippingChoice.shipping_rate as string,
    );

    const labelId = shippingDetails.metadata.shippo_shipping_rate_id;

    await shippo.transactions.create({
      rate: labelId!,
      labelFileType: "PNG",
      async: false,
    });
  },
};
