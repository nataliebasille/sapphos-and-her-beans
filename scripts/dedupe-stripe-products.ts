import dotenv from "dotenv";
import { Stripe } from "stripe";

dotenv.config({ path: ".env" });

/**
 * Archives duplicate active Stripe products that share the same name, keeping
 * the OLDEST record per name (preserves long-standing product/price IDs and any
 * existing payment links). Duplicates are archived (`active: false`), not
 * deleted, because Stripe forbids deleting products that have a price attached.
 *
 * Usage:
 *   npx tsx "scripts/dedupe-stripe-products.ts"          # dry run (default)
 *   npx tsx "scripts/dedupe-stripe-products.ts" --apply  # actually archive
 */
async function main() {
  const apply = process.argv.includes("--apply");
  const key = process.env.STRIPE_KEY!;
  const mode = key.startsWith("sk_test_")
    ? "TEST"
    : key.startsWith("sk_live_")
      ? "LIVE"
      : "UNKNOWN";
  console.log(`Stripe mode: ${mode}`);
  console.log(`Run mode: ${apply ? "APPLY (archiving)" : "DRY RUN (no changes)"}\n`);

  const stripe = new Stripe(key);
  const all = await listAllActiveProducts(stripe);
  console.log(`Active products: ${all.length}`);

  const byName = new Map<string, Stripe.Product[]>();
  for (const p of all) {
    const arr = byName.get(p.name ?? "") ?? [];
    arr.push(p);
    byName.set(p.name ?? "", arr);
  }

  const toArchive: { name: string; product: Stripe.Product }[] = [];
  for (const [name, arr] of byName) {
    if (arr.length <= 1) continue;
    // Oldest first; keep [0], archive the rest.
    const sorted = arr.slice().sort((a, b) => a.created - b.created);
    const keep = sorted[0]!;
    const extras = sorted.slice(1);
    console.log(`\n"${name}" (x${arr.length})`);
    console.log(
      `   KEEP    id=${keep.id} created=${new Date(keep.created * 1000).toISOString()}`,
    );
    for (const p of extras) {
      console.log(
        `   ARCHIVE id=${p.id} created=${new Date(p.created * 1000).toISOString()}`,
      );
      toArchive.push({ name, product: p });
    }
  }

  console.log(
    `\n${toArchive.length} duplicate record(s) ${apply ? "to archive" : "would be archived"}.`,
  );

  if (!apply) {
    console.log("\nDry run only. Re-run with --apply to archive these.");
    return;
  }

  for (const { name, product } of toArchive) {
    await stripe.products.update(product.id, { active: false });
    console.log(`Archived ${product.id} ("${name}")`);
  }
  console.log(`\nDone. Archived ${toArchive.length} duplicate(s).`);
}

async function listAllActiveProducts(
  stripe: Stripe,
): Promise<Stripe.Product[]> {
  const all: Stripe.Product[] = [];
  let startingAfter: string | undefined;
  for (;;) {
    const page = await stripe.products.list({
      active: true,
      limit: 100,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });
    all.push(...page.data);
    if (!page.has_more) break;
    startingAfter = page.data[page.data.length - 1]!.id;
  }
  return all;
}

main();
