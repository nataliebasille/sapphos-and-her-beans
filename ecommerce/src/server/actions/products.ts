import "server-only";
import { unstable_cache } from "next/cache";

export type Product = {
  id: number;
  name: string;
  tastingNotes: string;
  price: number;
  imageSrc: string;
};

export const getProducts = unstable_cache(
  () => {
    return Promise.resolve(
      Array.from({ length: 8 }).map((_, index) => ({
        id: index,
        name: `Ethiopian Layago Teraga`,
        tastingNotes: "Sweet, balanced, and smooth",
        price: 20,
        imageSrc: "/images/placeholder coffee bag.jpg",
      })),
    );
  },
  ["products"],
  {
    tags: ["products"],
  },
);
