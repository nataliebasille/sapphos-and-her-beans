import { shippo } from "@shippo";
import { stripe } from "@stripe";
import { type Stripe } from "stripe";

export async function POST(request: Request) {
  const event = (await request.json()) as Stripe.Event;

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

    console.log("shippo label id", labelId);
    await shippo.transactions.create({
      rate: labelId!,
      labelFileType: "PNG",
      async: false,
    });
  },
};
