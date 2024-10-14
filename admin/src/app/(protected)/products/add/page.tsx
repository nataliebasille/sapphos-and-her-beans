import { unstable_cache } from "next/cache";
import { ProductForm } from "../_components/product-form";

const randomNumberCache = unstable_cache(
  async () => {
    return getRandomInt(100);
  },
  ["test-cache"],
  {
    revalidate: 3600,
  },
);
export default async function AddProductPage() {
  const time = await randomNumberCache();
  return (
    <article>
      {time}
      <ProductForm label="Add product" />
    </article>
  );
}

async function getRandomInt(max: number) {
  console.log("miss");
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  await delay(100);
  return Math.floor(Math.random() * max);
}
