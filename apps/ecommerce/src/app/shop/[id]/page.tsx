import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { products } from "@models";
import { getProducts } from "~/server/products/get_products";
import { groupForId } from "../_components/catalog-data";
import { CoffeeDetails } from "./coffee-details";

type CoffeePageProps = {
  params: Promise<{ id: string }>;
};

async function findCoffee(id: string) {
  const coffees = await getProducts();
  const size = coffees
    .flatMap((coffee) => products.resolveVariants(coffee))
    .find((product) => product.id === id);
  return { coffees, size };
}

export async function generateMetadata({
  params,
}: CoffeePageProps): Promise<Metadata> {
  const { id } = await params;
  const { size: coffee } = await findCoffee(id);

  if (!coffee) {
    return { title: "Coffee not found — Sappho and her beans" };
  }

  const title = [coffee.country, coffee.name].filter(Boolean).join(" — ");
  const description =
    coffee.tastingNotes ?
      `${title} — tasting notes of ${coffee.tastingNotes}.`
    : `${title} from ${coffee.country ?? "our roasters"}.`;

  return {
    title: `${title} — Sappho and her beans`,
    description,
  };
}

export default async function CoffeePage({ params }: CoffeePageProps) {
  const { id } = await params;
  const { coffees, size: coffee } = await findCoffee(id);

  if (!coffee) {
    notFound();
  }

  const group = groupForId(coffees, id);
  const sizes = group?.sizes ?? [coffee];

  return <CoffeeDetails coffee={coffee} sizes={sizes} />;
}
