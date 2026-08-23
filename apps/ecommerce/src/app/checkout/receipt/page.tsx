import { ReceiptConfirmation } from "./_components/receipt-confirmation";

export default function CheckoutReceiptPage() {
  return (
    <div className="bg-surface-50 -mt-[calc(89px+1.5rem)] min-h-dvh w-full pt-[89px]">
      <ReceiptConfirmation />
    </div>
  );
}
