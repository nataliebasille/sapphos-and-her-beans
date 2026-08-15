/**
 * Sappho & Her Beans homepage — "Editorial Split".
 *
 * Shop-forward hierarchy: header → hero → featured coffees → why Sappho →
 * relational story → find us locally → newsletter/footer. Featured products
 * come from the live catalog, with distinct origins preferred.
 */
import { getProducts } from "~/server/products/get_products";
import { type products } from "@models";
import { HomeFeatured, HomeHeader, HomeHero } from "./_components/home-top";
import {
  FindUsLocally,
  NewsletterFooter,
  RelationalStory,
  WhySappho,
} from "./_components/sections";

type Coffee = products.Product;

function gramsOf(size: string): number {
  const match = /(\d+)\s*g/.exec(size);
  return match ? Number(match[1]) : 0;
}

/** Featured set for the homepage: distinct origins, prefer featured + larger bags. */
function selectFeatured(all: Coffee[]): Coffee[] {
  const usable = all.filter((c) => c.size !== "singleserve" && !!c.country);
  const featured = usable.filter((c) => c.featured);
  const pool = (featured.length >= 3 ? featured : usable)
    .slice()
    .sort((a, b) => gramsOf(b.size) - gramsOf(a.size));

  const seen = new Set<string>();
  const out: Coffee[] = [];
  for (const c of pool) {
    const key = c.country!;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
    if (out.length >= 3) break;
  }
  return out;
}

export default async function HomePage() {
  const coffees = selectFeatured((await getProducts()) as unknown as Coffee[]);

  return (
    <div className="min-h-screen bg-[#FAF9F8] font-sans text-[#001F36]">
      <HomeHeader />
      <HomeHero />
      <HomeFeatured coffees={coffees} />
      <WhySappho />
      <RelationalStory />
      <FindUsLocally />
      <NewsletterFooter />
    </div>
  );
}
