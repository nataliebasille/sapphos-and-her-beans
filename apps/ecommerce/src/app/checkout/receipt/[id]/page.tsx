import { ReceiptConfirmation } from "../_components/receipt-confirmation";

type CheckoutReceiptPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CheckoutReceiptPage({
  params,
}: CheckoutReceiptPageProps) {
  const { id } = await params;

  return (
    <div className="bg-surface-50 -mt-[calc(89px+1.5rem)] min-h-dvh w-full pt-[89px]">
      <ReceiptConfirmation checkoutSessionId={id} />
    </div>
  );
}
