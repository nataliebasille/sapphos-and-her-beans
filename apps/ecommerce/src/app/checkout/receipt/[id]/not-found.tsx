import { ReceiptStatus } from "../_components/receipt-status";

export default function ReceiptNotFound() {
  return (
    <div className="bg-surface-50 -mt-[calc(89px+1.5rem)] min-h-dvh w-full pt-[89px]">
      <ReceiptStatus type="not_found" />
    </div>
  );
}
