import 'server-only';

import { Stripe } from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_KEY ?? '', {
  apiVersion: '2020-08-27; checkout_server_update_beta=v1' as any,
});
