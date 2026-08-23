import type { Product } from "~/app/_stores/products";

export type CompletedOrderLine = {
  id: string;
  name: string;
  detail: string;
  quantity: number;
  price: number;
};

export type CompletedOrder = {
  checkoutSessionId: string;
  completedAt: string;
  subtotal: number;
  lines: CompletedOrderLine[];
};

export function createCompletedOrderSnapshot({
  cart,
  checkoutSessionId,
  products,
}: {
  cart: Record<string, { quantity: number }>;
  checkoutSessionId: string;
  products: Product[];
}): CompletedOrder {
  const productMap = new Map(products.map((product) => [product.id, product]));
  const lines = Object.entries(cart).flatMap(([id, item]) => {
    const product = productMap.get(id);
    if (!product) return [];

    return [
      {
        id,
        name: product.name,
        detail: [product.processing, product.tastingNotes]
          .filter(Boolean)
          .join(", "),
        quantity: item.quantity,
        price: product.price * item.quantity,
      },
    ];
  });

  return {
    checkoutSessionId,
    completedAt: new Date().toISOString(),
    lines,
    subtotal: lines.reduce((total, line) => total + line.price, 0),
  };
}
