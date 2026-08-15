import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { getProducts } from "~/server/products/get_products";
import { CoffeeDetails } from "./coffee-details";

type CoffeePageProps = {
  params: Promise<{ id: string }>;
};

async function findCoffee(id: string) {
  const products = await getProducts();
  return products.find((product) => product.id === id);
}

export async function generateMetadata({
  params,
}: CoffeePageProps): Promise<Metadata> {
  const { id } = await params;
  const coffee = await findCoffee(id);

  if (!coffee) {
    return { title: "Coffee not found — Sappho and her beans" };
  }

  const description =
    coffee.tastingNotes ?
      `${coffee.name} — tasting notes of ${coffee.tastingNotes}.`
    : `${coffee.name} from ${coffee.country ?? "our roasters"}.`;

  return {
    title: `${coffee.name} — Sappho and her beans`,
    description,
  };
}

export default async function CoffeePage({ params }: CoffeePageProps) {
  const { id } = await params;
  const coffee = await findCoffee(id);

  if (!coffee) {
    notFound();
  }

  return <CoffeeDetails coffee={coffee} />;
}
