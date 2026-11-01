/**
 * Sappho & Her Beans homepage — "Editorial Split".
 *
 * Shop-forward hierarchy: header → hero → featured coffees → why Sappho →
 * relational story → find us locally → newsletter/footer. Featured products
 * come from the live catalog, with distinct origins preferred.
 */
import { getProducts } from "~/server/products/get_products";
import { products } from "@models";
import { type CatalogCoffee } from "~/app/shop/_components/catalog-data";
import { HomeFeatured, HomeHero } from "./_components/home-top";
import {
  FindUsLocally,
  NewsletterFooter,
  RelationalStory,
  WhySappho,
} from "./_components/sections";

function gramsOf(size: string): number {
  const match = /(\d+)\s*g/.exec(size);
  return match ? Number(match[1]) : 0;
}

/**
 * Featured set for the homepage: distinct origins, prefer featured + larger
 * bags. Each coffee is narrowed to the single bag size being featured.
 */
function selectFeatured(all: CatalogCoffee[]): CatalogCoffee[] {
  const usable = all.flatMap((coffee) =>
    products
      .resolveVariants(coffee)
      .filter((size) => size.size !== "singleserve" && !!size.country)
      .map((size) => ({ coffee, size })),
  );
  const featured = usable.filter(({ size }) => size.featured);
  const pool = (featured.length >= 3 ? featured : usable)
    .slice()
    .sort((a, b) => gramsOf(b.size.size) - gramsOf(a.size.size));

  const seen = new Set<string>();
  const out: CatalogCoffee[] = [];
  for (const { coffee, size } of pool) {
    const key = size.country!;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({
      ...coffee,
      variants: coffee.variants.filter((variant) => variant.id === size.id),
    });
    if (out.length >= 3) break;
  }
  return out;
}

export default async function HomePage() {
  const coffees = selectFeatured(await getProducts());

  return (
    <div className="text-primary-800 bg-surface-50 min-h-screen font-sans">
      <HomeHero />
      <HomeFeatured coffees={coffees} />
      <WhySappho />
      <RelationalStory />
      <FindUsLocally />
      <NewsletterFooter />
    </div>
  );
}
