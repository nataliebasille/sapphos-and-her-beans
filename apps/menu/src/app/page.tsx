export const revalidate = 60;
import { stripe } from "@/server/+utils/stripe";

export default async function LandingPage() {
  const products = await getProducts();

  return (
    <div>
      <h1>Menu App Landing Page</h1>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </div>
  );
}

async function getProducts() {
  return await stripe.products.list();
}