"use client";

// PROTOTYPE: What cart presentation best carries the new editorial shop UI?
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Variant = "drawer" | "modal" | "page";

type CartItem = {
  id: string;
  name: string;
  origin: string;
  process: string;
  size: string;
  price: number;
  quantity: number;
  color: string;
};

const VARIANTS: { key: Variant; label: string }[] = [
  { key: "drawer", label: "A - Editorial drawer" },
  { key: "modal", label: "B - Review modal" },
  { key: "page", label: "C - Full bag" },
];

const INITIAL_ITEMS: CartItem[] = [
  {
    id: "ethiopia",
    name: "Ethiopia Guji",
    origin: "Ethiopia",
    process: "Natural",
    size: "12 oz",
    price: 24,
    quantity: 1,
    color: "#F2C9B3",
  },
  {
    id: "colombia",
    name: "Colombia El Tambo",
    origin: "Colombia",
    process: "Washed",
    size: "12 oz",
    price: 21,
    quantity: 2,
    color: "#C9D9C2",
  },
];

const money = (value: number) => `$${value.toFixed(2)}`;

export function ShoppingCartPrototype() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchVariant = searchParams.get("variant");
  const variant: Variant = VARIANTS.some((item) => item.key === searchVariant)
    ? (searchVariant as Variant)
    : "drawer";
  const [items, setItems] = useState(INITIAL_ITEMS);

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const quantity = items.reduce((total, item) => total + item.quantity, 0);

  const setVariant = (next: Variant) => router.replace(`${pathname}?variant=${next}`);
  const changeQuantity = (id: string, next: number) => {
    setItems((current) =>
      current
        .map((item) => item.id === id ? { ...item, quantity: next } : item)
        .filter((item) => item.quantity > 0),
    );
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        const current = VARIANTS.findIndex((item) => item.key === variant);
        const direction = event.key === "ArrowRight" ? 1 : -1;
        router.replace(
          `${pathname}?variant=${VARIANTS[(current + direction + VARIANTS.length) % VARIANTS.length]!.key}`,
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [pathname, router, variant]);

  return (
    <main className="min-h-screen bg-[#FAF9F8] text-[#001F36]">
      <PrototypeState items={items} subtotal={subtotal} quantity={quantity} variant={variant} />
      {variant === "drawer" && <DrawerVariant items={items} subtotal={subtotal} onQuantityChange={changeQuantity} />}
      {variant === "modal" && <ModalVariant items={items} subtotal={subtotal} onQuantityChange={changeQuantity} />}
      {variant === "page" && <PageVariant items={items} subtotal={subtotal} onQuantityChange={changeQuantity} />}
      {process.env.NODE_ENV !== "production" && (
        <PrototypeSwitcher current={variant} onChange={setVariant} />
      )}
    </main>
  );
}

function PrototypeState({ items, subtotal, quantity, variant }: { items: CartItem[]; subtotal: number; quantity: number; variant: Variant }) {
  return (
    <output className="fixed top-3 left-3 z-[70] max-w-[calc(100vw-1.5rem)] rounded-lg bg-[#001F36] px-3 py-2 font-mono text-[10px] leading-relaxed text-[#FAF9F8] shadow-lg">
      PROTOTYPE STATE: {variant} | {quantity} items | {money(subtotal)} | {items.map((item) => `${item.name} x${item.quantity}`).join(", ") || "empty"}
    </output>
  );
}

function PrototypeSwitcher({ current, onChange }: { current: Variant; onChange: (next: Variant) => void }) {
  const index = VARIANTS.findIndex((item) => item.key === current);
  const cycle = (direction: number) => onChange(VARIANTS[(index + direction + VARIANTS.length) % VARIANTS.length]!.key);

  return (
    <nav className="fixed right-4 bottom-4 left-4 z-[80] mx-auto flex max-w-md items-center justify-between rounded-full bg-[#001F36] p-1.5 text-sm text-[#FAF9F8] shadow-2xl" aria-label="Prototype variants">
      <button type="button" onClick={() => cycle(-1)} className="rounded-full px-4 py-2 hover:bg-white/15" aria-label="Previous variant">←</button>
      <span className="font-semibold tracking-wide">{VARIANTS[index]!.label}</span>
      <button type="button" onClick={() => cycle(1)} className="rounded-full px-4 py-2 hover:bg-white/15" aria-label="Next variant">→</button>
    </nav>
  );
}

function DrawerVariant({ items, subtotal, onQuantityChange }: CartViewProps) {
  return (
    <div className="min-h-screen bg-[#F7DCDF] pt-24">
      <div className="mx-auto max-w-6xl px-6 text-[#001F36] md:px-10">
        <p className="text-sm tracking-[0.2em] uppercase">Shop coffee / bag preview</p>
        <h1 className="mt-4 max-w-xl font-primary text-5xl leading-none md:text-7xl">The page stays in view.</h1>
      </div>
      <aside className="absolute top-0 right-0 flex min-h-screen w-full max-w-xl flex-col border-l border-[#001F36]/10 bg-[#FAF9F8] shadow-[-18px_0_60px_rgba(0,31,54,0.14)]">
        <CartHeader eyebrow="Your bag" title="Ready when you are" />
        <div className="flex-1 space-y-3 overflow-auto bg-[#F7DCDF]/30 p-4 pt-20 md:p-6 md:pt-20">
          {items.map((item) => <CompactItem key={item.id} item={item} onQuantityChange={onQuantityChange} />)}
          {!items.length && <EmptyCart />}
        </div>
        <CheckoutBar subtotal={subtotal} />
      </aside>
    </div>
  );
}

function ModalVariant({ items, subtotal, onQuantityChange }: CartViewProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#001F36] p-4 md:p-10">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] bg-[#FAF9F8] shadow-2xl">
        <CartHeader eyebrow="A pause before checkout" title="Your coffee, gathered." />
        <div className="grid pt-20 md:grid-cols-[1.35fr_.65fr]">
          <div className="space-y-3 p-5 md:p-8">
            {items.map((item) => <CompactItem key={item.id} item={item} onQuantityChange={onQuantityChange} />)}
            {!items.length && <EmptyCart />}
          </div>
          <aside className="bg-[#F7DCDF] p-6 md:p-8">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase">Order total</p>
            <p className="mt-4 font-primary text-5xl">{money(subtotal)}</p>
            <p className="mt-2 text-sm text-[#001F36]/65">Shipping calculated at checkout.</p>
            <button type="button" className="mt-12 w-full rounded-full bg-[#001F36] px-5 py-4 text-sm font-semibold tracking-[0.15em] text-white uppercase">Checkout</button>
            <p className="mt-5 text-center text-xs text-[#001F36]/60">Free shipping on orders over $60</p>
          </aside>
        </div>
      </div>
    </div>
  );
}

function PageVariant({ items, subtotal, onQuantityChange }: CartViewProps) {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-28 pb-28 md:px-10">
      <header className="border-b border-[#001F36]/15 pb-8">
        <p className="text-xs font-semibold tracking-[0.24em] text-[#E87A01] uppercase">Your order</p>
        <h1 className="mt-3 font-primary text-5xl md:text-7xl">The bag.</h1>
      </header>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.45fr_.7fr]">
        <section className="divide-y divide-[#001F36]/15">
          {items.map((item) => <EditorialItem key={item.id} item={item} onQuantityChange={onQuantityChange} />)}
          {!items.length && <EmptyCart />}
        </section>
        <aside className="h-fit rounded-3xl bg-[#F7DCDF] p-6 lg:sticky lg:top-8">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase">Order summary</p>
          <div className="mt-8 flex justify-between border-b border-[#001F36]/15 pb-4 text-sm"><span>Subtotal</span><span>{money(subtotal)}</span></div>
          <div className="mt-4 flex justify-between font-primary text-3xl"><span>Total</span><span>{money(subtotal)}</span></div>
          <button type="button" className="mt-8 w-full rounded-full bg-[#001F36] py-4 text-sm font-semibold tracking-[0.15em] text-white uppercase">Secure checkout</button>
        </aside>
      </div>
    </div>
  );
}

type CartViewProps = { items: CartItem[]; subtotal: number; onQuantityChange: (id: string, next: number) => void };

function CartHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return <header className="absolute top-0 right-0 left-0 z-10 border-b border-[#001F36]/10 bg-[#FAF9F8] px-5 py-5 md:px-6"><p className="text-xs font-semibold tracking-[0.2em] text-[#E87A01] uppercase">{eyebrow}</p><h2 className="mt-1 font-primary text-3xl">{title}</h2></header>;
}

function CompactItem({ item, onQuantityChange }: { item: CartItem; onQuantityChange: CartViewProps["onQuantityChange"] }) {
  return <article className="flex gap-4 rounded-2xl bg-white p-3 shadow-sm"><ProductMark item={item} /><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><div><p className="text-[10px] font-semibold tracking-[0.18em] text-[#001F36]/55 uppercase">{item.origin} / {item.process}</p><h3 className="font-primary text-xl">{item.name}</h3></div><span className="font-primary text-xl">{money(item.price * item.quantity)}</span></div><div className="mt-3 flex items-center justify-between"><QuantityControl item={item} onQuantityChange={onQuantityChange} /><span className="text-xs text-[#001F36]/60">{item.size}</span></div></div></article>;
}

function EditorialItem({ item, onQuantityChange }: { item: CartItem; onQuantityChange: CartViewProps["onQuantityChange"] }) {
  return <article className="grid gap-5 py-6 sm:grid-cols-[130px_1fr_auto]"><ProductMark item={item} large /><div><p className="text-xs font-semibold tracking-[0.18em] text-[#E87A01] uppercase">{item.origin} / {item.process}</p><h3 className="mt-2 font-primary text-3xl">{item.name}</h3><p className="mt-1 text-sm text-[#001F36]/65">{item.size} whole bean</p><div className="mt-5"><QuantityControl item={item} onQuantityChange={onQuantityChange} /></div></div><p className="font-primary text-2xl">{money(item.price * item.quantity)}</p></article>;
}

function ProductMark({ item, large = false }: { item: CartItem; large?: boolean }) {
  return <div className={`flex shrink-0 items-center justify-center rounded-2xl p-3 ${large ? "h-28 w-full sm:w-[130px]" : "h-20 w-20"}`} style={{ backgroundColor: item.color }}><span className="border border-[#001F36]/20 bg-white/45 px-2 py-1 text-center text-[10px] font-semibold tracking-[0.16em] uppercase">{item.size}</span></div>;
}

function QuantityControl({ item, onQuantityChange }: { item: CartItem; onQuantityChange: CartViewProps["onQuantityChange"] }) {
  return <div className="inline-flex overflow-hidden rounded-full border border-[#001F36]/20"><button type="button" className="px-3 py-1 hover:bg-[#F7DCDF]" onClick={() => onQuantityChange(item.id, item.quantity - 1)} aria-label={`Remove one ${item.name}`}>-</button><span className="border-x border-[#001F36]/20 px-3 py-1 text-sm">{item.quantity}</span><button type="button" className="px-3 py-1 hover:bg-[#F7DCDF]" onClick={() => onQuantityChange(item.id, item.quantity + 1)} aria-label={`Add one ${item.name}`}>+</button></div>;
}

function CheckoutBar({ subtotal }: { subtotal: number }) {
  return <footer className="border-t border-[#001F36]/10 bg-white p-5"><div className="mb-3 flex justify-between"><span>Subtotal</span><span className="font-primary text-2xl">{money(subtotal)}</span></div><button type="button" className="w-full rounded-full bg-[#001F36] py-4 text-sm font-semibold tracking-[0.15em] text-white uppercase">Checkout</button></footer>;
}

function EmptyCart() {
  return <div className="rounded-2xl border border-dashed border-[#001F36]/20 p-8 text-center"><p className="font-primary text-2xl">Your bag is ready for coffee.</p></div>;
}
