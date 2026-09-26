"use client";

/**
 * PROTOTYPE — three not-found (404) variants for the new UI, switchable via
 * `?variant=A|B|C`, rendered inside the real app chrome (site header +
 * PageContainer come from the root layout). Throwaway: delete this whole
 * `prototype/` route once a direction is chosen and folded into a real
 * root-level `not-found.tsx`.
 */
import { useSearchParams } from "next/navigation";
import { PrototypeSwitcher } from "~/app/_components/prototype-switcher";
import { VariantA, VariantB, VariantC } from "./variants";

const VARIANTS = ["A", "B", "C"] as const;
const LABELS: Record<string, string> = {
  A: "Editorial split",
  B: "Centered spotlight",
  C: "Coffee metaphor",
};

export default function NotFoundPrototypePage() {
  const params = useSearchParams();
  const raw = params.get("variant")?.toUpperCase() ?? "A";
  const variant = (VARIANTS as readonly string[]).includes(raw) ? raw : "A";

  return (
    <>
      {variant === "A" && <VariantA />}
      {variant === "B" && <VariantB />}
      {variant === "C" && <VariantC />}
      <PrototypeSwitcher
        variants={[...VARIANTS]}
        current={variant}
        labels={LABELS}
      />
    </>
  );
}
